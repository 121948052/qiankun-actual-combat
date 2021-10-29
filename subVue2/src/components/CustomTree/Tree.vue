<template>
  <div>
    <ul class="tree-ctn">
      <TreeNode :disabled="disabled" :data="data" />
    </ul>
  </div>
</template>

<script>
import TreeNode from './TreeNode'
export default {
  name: 'Tree',
  props: ['data', 'disabled'],
  data () {
    return {}
  },
  components: {
    TreeNode
  }
}
</script>

<style lang="less" scoped >
.tree-ctn{
  position: relative;
  overflow-y: auto;
  // 禁止选中文字
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-align: left;
}
</style>
