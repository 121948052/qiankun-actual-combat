<template>
  <Model v-model="showModel" width="630px" class="upload-wrap">
    <template #header>
      <div>
        <span >{{title}}</span>
        <Icon style="float:right;cursor:pointer;" type="icon-close" @click="cal(false)" />
      </div>
    </template>
    <div class="top-input">
      <slot><Input :maxlength="500" v-model="form.details" type="textarea" placeholder="请输入催办结果说明（催办梳理方案、达成效果等）" /></slot>
    </div>
    <div
      class="drop-wrap"
      @drop.prevent="onDrop"
      @paste='handlePaste'
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @click.stop="checkedFile">
      上传附件：<p style="color: #F05656">支持doc、docx、xls、xlsx、jpg、png、pdf格式文件上传，最大{{maxSize}}M</p>
      <Button style="margin-top: 14px" :disabled="disabled" icon="icon-document" >选择上传文件</Button>
      <input
        ref="upload"
        class="file-input"
        type="file"
        :multiple="multiple"
        :accept="accept"
        @change="uploadInputChange" />
    </div>
    <ul class="result-wrap">
      <li v-for="(file, i) in uploadFileList" :key="i">
        {{file.name}}
        <Icon type="icon-close-bg" @click="removeFile(i)" />
      </li>
    </ul>
    <template #footer>
      <div class="add-btns">
        <Button type="primary" @click="ok(form)">{{okText}}</Button>
        <Button @click="cal(form)">{{calText}}</Button>
      </div>
    </template>
  </Model>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'ModelUpload',
  props: {
    // 识别Model组件的属性、方法，剩余挂载在上传组件中
    value: {
      type: Array
    },
    showModel: {
      type: Boolean
    },
    calText: {
      type: String,
      default: '取消'
    },
    okText: {
      type: String,
      default: '确定'
    },
    multiple: {
      type: Boolean
    },
    title: {
      type: [String, Number],
      default: '上传文件'
    },
    width: {
      type: [String, Number],
      default: 450
    },
    accept: {
      type: String
    },
    maxSize: {
      type: Number,
      default: 50
    },
    disabled: {
      type: Boolean
    },
    ok: {
      type: Function
    },
    cal: {
      type: Function
    }
  },
  data () {
    return {
      dragOver: false,
      form: {
        details: ''
      },
      uploadFileList: this.value
    }
  },
  watch: {
    value: {
      deep: true,
      handler (arr) {
        this.uploadFileList = arr
      }
    },
    showModel (val) {
      if (!val) {
        this.form = {}
      }
    }
  },
  methods: {
    checkedFile () {
      this.$refs.upload.value = ''
      this.$refs.upload.click()
    },
    onDrop (e) {
      this.dragOver = false
      this.loadFile(e.dataTransfer.files)
    },
    handlePaste (e) {
      this.loadFile(e.clipboardData.files)
    },
    uploadInputChange (e) {
      const files = e.target.files
      if (!files) return
      this.loadFile(files)
    },
    loadFile (file) {
      file.forEach(p => {
        this.uploadFileList.push(p)
        // const s = this.uploadFileList.find(s => p.name === s.name)
        // if (!s) this.uploadFileList.push(p)
      })
      this.$emit('on-file-change', file)
    },
    // 删除已上传文件
    removeFile (i) {
      this.uploadFileList.splice(i, 1)
      this.$emit('change', i, this.uploadFileList)
    }
  }
}
</script>

<style scoped lang="less">
@deep: ~">>>";
@{deep} .top-input {
  margin-bottom: 20px;
  textarea {
    width: 570px;
    height: 100px;
    resize: none;
  }
}
.file-input {
  display: none;
}

.upload-wrap {
  @{deep} .wrap{
    padding: 0 0 20px 0;
    .header {
      color: #fff;
      padding: 0 20px;
      height: 36px;
      line-height: 36px;
      background-color: #37f;
    }
    .content, .footer {
       padding: 0 20px;
    }
  }
}

@{deep} .result-wrap {
  padding-left: 68px;
  max-height: 200px;
  overflow: auto;
  li {
    justify-content: space-between;
    width: 200px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    padding: 10px 20px 10px 0;
    cursor: pointer;
    position: relative;
  }
  .icon-close-bg {
    color: #D2DAE2;
    transition: all .3s;
    position: absolute;
    right: 0;
    &:hover {
      color: #B7BECA;
    }
  }
}
.add-btns {
  width:100%;
  text-align:center;
  .sh-btn {
    margin: 0 10px;
  }
}
</style>
