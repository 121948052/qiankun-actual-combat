<template>
  <Model v-model="showModel">
      <template #header>
        <div>
          <Icon type="icon-warning" style="color:#FFA033;font-size:16px;"/>
          <span style="color:#1F2E4D;font-weight:600;margin-left:5px;">删除</span>
          <Icon style="float:right;color:#8F9BB3;cursor:pointer;" type="icon-close" class="close" @click="cal" />
        </div>
      </template>
      <div style="color:#1F2E4D;margin:20px 0 40px;">
        确定要删除所选数据吗？
      </div>
      <template #footer>
        <div style="width:100%;text-align:center;">
          <Button type="primary" @click="ok">确定</Button>
        </div>
      </template>
    </Model>
</template>

<script>
export default {
  name: 'DeleteModel',
  props: {
    ok: Function,
    cal: Function,
    showModel: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  }
}
</script>
