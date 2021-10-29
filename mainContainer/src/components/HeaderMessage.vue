<template>
  <div class="message-box">
    <slot name="header"></slot>
    <slot name="content">
      <ul class="content" ref="messageWrap" @scroll="scrollButtom">
        <li class="content-item" v-for="(item, i) in dataList" :key="i" @click="clickMessage(item)">
          <span class="right-text">
            <div style="display: flex; height: 100%;">
              <p v-html="item.title" class="html-inner"></p>
            </div>
          </span>
        </li>
        <li class="content-item" v-show="dataList.length === 0">
          暂无数据
        </li>
        <Loading class="loading-wrap" v-model="loading"/>
      </ul>
    </slot>
    <slot name="footer">
      <footer class="footer">
        <Button size="middle" @click="more">查看更多</Button>
      </footer>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'HeaderMessage',
  props: {
    num: {
      type: [String, Number]
    },
    dataList: {
      type: Array,
      required: true
    },
    feach: {
      type: Function,
      default: () => {
      }
    },
    loading: {
      type: Boolean
    },
    more: {
      type: Function,
      default: () => {
      }
    }
  },
  data () {
    return {
      params: {
        pageNum: 1,
        pageSize: 5
      }
    }
  },
  created () {
    this.feach(this.params)
  },
  methods: {
    clickMessage (item) {
      this.$emit('on-click-item', item)
    },
    scrollToTop () {
      this.$nextTick(() => {
        let num = this.$refs.messageWrap.scrollHeight / 10
        if (this.$refs.messageWrap.scrollTop > 0) {
          let time = setInterval(() => {
            if (this.$refs.messageWrap.scrollTop > 0) {
              this.$refs.messageWrap.scrollTop -= num
            } else {
              clearInterval(time)
            }
          }, 30)
        }
      })
    },
    scrollButtom () {
      // const el = this.$refs.messageWrap
      // if ((el.scrollTop + el.clientHeight === el.scrollHeight) && !this.loading) {
      //   ++this.params.pageNum
      //   this.feach(this.params)
      // }
    }
  }
}
</script>
<style scoped lang="less">
.message-box {
  color         : #1F2E4D;
  border-radius : 4px;
  background    : #ffffff;

  .header {
    font-size : 16px;
    color     : #3377ff;
    padding   : 20px 40px;
    position  : relative;

    &::before {
      content    : '';
      position   : absolute;
      left       : 30px;
      bottom     : -1px;
      height     : 2px;
      background : #3377ff;
      width      : 114px;
    }
  }

  .content {
    max-height    : 340px;
    overflow-y    : auto;
    border-top    : 1px solid #E6E9F0;
    border-bottom : 1px solid #E6E9F0;
    padding       : 10px;
    position      : relative;
    transition    : all .3s;

    .content-item {
      transition  : all .3s;
      //padding     : 10px 20px;
      padding     : 8px;
      display     : flex;
      width       : 100%;
      align-items : center;

      //.left-icon {
      //  color           : #3275FC;
      //  display         : inline-flex;
      //  align-items     : center;
      //  justify-content : center;
      //  padding         : 20px;
      //  width           : 20px;
      //  height          : 20px;
      //  background      : rgba(50, 117, 252, 0.2);
      //  border-radius   : 50%;
      //
      //  .iconfont {
      //    font-size : 36px;
      //  }
      //}

      .right-text {
        //height : 42px;

        p {
          margin-left : 10px;
        }

        .title {
          width         : 85px;
          white-space   : nowrap;
          text-overflow : ellipsis;
          word-break    : keep-all;
          overflow      : hidden;
        }

        .html-inner {
          width         : 200px;
          margin-left   : 10px;
          white-space   : nowrap;
          text-overflow : ellipsis;
          word-break    : keep-all;
          overflow      : hidden;
        }
      }
    }

    .content-item:hover {
      background : #E7F0F8;
    }

    .loading-wrap {
      top             : 0;
      left            : 0;
      width           : 100%;
      height          : 100%;
      position        : absolute;
      display         : flex;
      align-items     : center;
      justify-content : center;
      background      : hsla(0, 0%, 100%, .9);
    }
  }

  .footer {
    padding    : 8px 0;
    text-align : right;

    /deep/ .sh-btn {
      margin-right : 20px;
    }
  }
}
</style>
