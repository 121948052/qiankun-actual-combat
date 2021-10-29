<template>
  <div>
    <li :class="['node',node.children?'':'node-leaf']" v-for="node in data" :key='node.index'>
      <div v-if="node.children && node.children.length" class="li-hover-item" :style="{ paddingLeft: ( level*20 + 10 ) + 'px' }">
        <Icon :type="!node.expand ? 'icon-up' : 'icon-down'" v-if="hasChild(node)" @click="clickIcon(node)" />
        <Checkbox :disabled="disabled" @on-change="nodeCheck(node)" v-model="node.checked" :label="node.checked" />
        {{node.text}}
        <span style="float:right">全选<Checkbox :disabled="disabled" @on-change="nodeCheckAll(node)" v-model="node.checkedAll" :label="node.checkedAll" style="padding:0 5px" /></span>
      </div>
      <div v-else class="li-hover-item" :style="{ paddingLeft: ( level*20 + 36 ) + 'px' }">
        <Checkbox :disabled="disabled" @on-change="nodeCheck(node)" v-model="node.checked" :label="node.checked" />
        {{node.text}}
      </div>
      <!-- 支持slideDown slideUp效果的动画 -->
      <transition
        @before-enter="beforeEnter"
        @enter="enter"
        :level="1 + level"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        @leave="leave"
        @after-leave="afterLeave">
        <ul v-if="node.children" v-show="!node.expand">
          <TreeNode :disabled="disabled" :data="node.children"></TreeNode>
        </ul>
      </transition>
    </li>
  </div>
</template>

<script>
import TreeNode from './TreeNode'
export default {
  name: 'TreeNode',
  inject: ['giveNodes', 'giveAllNodes'],
  props: {
    data: {
      type: Array
    },
    level: {
      type: Number,
      default: 0
    },
    icon: {
      type: String,
      default: 'icon-down'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectData: []
    }
  },
  watch: {
    data: {
      handler (d) {
        // 回显已选节点
        this.getSelectedFromTree(d)
      },
      deep: true
    }
  },
  components: {
    TreeNode
  },
  methods: {
    selectItem (node) {
      node.checked = !node.checked
    },
    hasChild (node) {
      return node.children && node.children.length > 0
    },
    clickIcon (node) {
      this.$set(node, 'expand', !node.expand)
    },
    nodeCheck (node) {
      this.giveNodes(node)
    },
    nodeCheckAll (node) {
      // node.checkedAll = !node.checkedAll
      this.giveAllNodes(node)
    },
    getSelectedFromTree (tree) {
      let that = this
      tree.map(t => {
        if (t.checked) {
          that.selectData.push(t)
        }
        if (t.children && t.children.length) {
          t.children.some(tc => tc.checked) && that.selectData.push(t) // 半选也算进去
          that.getSelectedFromTree(t.children)
        }
      })
    },
    beforeEnter: function (el) {
      el.style.transition = '0.3s height ease-in-out, 0.3s padding-top ease-in-out, 0.3s padding-bottom ease-in-out'
      if (!el.dataset) el.dataset = {}
      el.dataset.oldPaddingTop = el.style.paddingTop
      el.dataset.oldPaddingBottom = el.style.paddingBottom
      el.style.height = 0
      el.style.paddingTop = 0
      el.style.paddingBottom = 0
    },
    enter: function (el) {
      el.dataset.oldOverflow = el.style.overflow
      if (el.scrollHeight !== 0) {
        el.style.height = el.scrollHeight + 'px'
        el.style.paddingTop = el.dataset.oldPaddingTop
        el.style.paddingBottom = el.dataset.oldPaddingBottom
      } else {
        el.style.height = ''
        el.style.paddingTop = el.dataset.oldPaddingTop
        el.style.paddingBottom = el.dataset.oldPaddingBottom
      }
      el.style.overflow = 'hidden'
    },
    afterEnter: function (el) {
      el.style.transition = ''
      el.style.height = ''
      el.style.overflow = el.dataset.oldOverflow
    },
    beforeLeave: function (el) {
      if (!el.dataset) el.dataset = {}
      el.dataset.oldPaddingTop = el.style.paddingTop
      el.dataset.oldPaddingBottom = el.style.paddingBottom
      el.dataset.oldOverflow = el.style.overflow
      el.style.height = el.scrollHeight + 'px'
      el.style.overflow = 'hidden'
    },
    leave: function (el) {
      if (el.scrollHeight !== 0) {
        el.style.transition = '0.3s height ease-in-out, 0.3s padding-top ease-in-out, 0.3s padding-bottom ease-in-out'
        el.style.height = 0
        el.style.paddingTop = 0
        el.style.paddingBottom = 0
      }
    },
    afterLeave: function (el) {
      el.style.transition = ''
      el.style.height = ''
      el.style.overflow = el.dataset.oldOverflow
      el.style.paddingTop = el.dataset.oldPaddingTop
      el.style.paddingBottom = el.dataset.oldPaddingBottom
    }
  }
}
</script>

<style lang="less" scoped >
    .node {
        padding-left: 22px;
        cursor: pointer;
        color: #333;
        line-height: 30px;
        font-size: 12px;
        font-weight:400;
        color:rgba(17,17,17,1);
        .li-hover-item{
            &:hover{
                background: #E4E4E4;
            }
        }
        .cover-ctn{
            position: absolute;
            left: 0;
        }
    }
    .minus-sign-icon{
        position: relative;
        display: inline-block;
        width: 12px;
        height: 11px;
        border: 1px solid #A5A5A5;
        border-radius: 2px;
        vertical-align: middle;
        margin-top: -2px;
        &::before{
            content: '';
            display: inline-block;
            position: absolute;
            background: #8c8a8a;
            height: 2px;
            width: 6px;
            top: 4px;
            left: 3px;
        }
    }
    .plus-icon{
        position: relative;
        display: inline-block;
        width: 12px;
        height: 11px;
        border: 1px solid #A5A5A5;
        border-radius: 2px;
        vertical-align: middle;
        margin-top: -2px;
        &::before{
            content: '';
            display: inline-block;
            position: absolute;
            background: #8c8a8a;
            height: 2px;
            width: 6px;
            top: 4px;
            left: 3px;
        }
        &::after{
            content: '';
            display: inline-block;
            position: absolute;
            width: 2px;
            height: 7px;
            top: 2px;
            left: 5px;
            background: #8c8a8a;
        }
    }
    ul, li {
        // padding-left: 1em;
        list-style-type: none;
    }
    .close-expand-icon{
        width: 14px;
        height: 14px;
        border-radius: 2px;
        border: 1px solid #A5A5A5;
        display: inline-block;
        text-align: center;
        line-height: 9px;
        font-size: 14px;
        color: #666666;
        font-weight: 400;
        vertical-align: middle;
        margin-top: -2px;
        margin-right: 4px;
    }
</style>
