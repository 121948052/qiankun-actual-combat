<template>
  <div class="sh-tree"
       v-if="treeData.length > 0" :reset_key="reset_key">
    <ul v-for="(node, i) in treeData"
        :key="i">
      <li :class="['child-node', activeNode.dropType , {'second-last-node': level === 1 && i === treeData.length-1}]"
          :style="{paddingLeft: paddingLeft}"
          :draggable="draggable"
          @dragstart.stop="handleDragStart(node, $event)"
          @dragend.stop="handleDragEnd">
        <div :class="['node-content', {'active-li': node === activeNode.activeNode, 'drop-node': node === activeNode.dropData, 'first-level': firstCompoents()}]"
             @dragenter.prevent.stop="handelDragEnter(i, $event)"
             @dragover.prevent.stop
             @drop.prevent.stop="handleDrop(i, $event)">
          <div :class="[{'lastLine70': i===treeData.length-1 && !hasChild(node), line70: i!==treeData.length-1 && !hasChild(node), 'lastLine': i===treeData.length-1 && hasChild(node), 'line': i!==treeData.length-1 && hasChild(node)}]"
               v-if="!firstCompoents()">
            <div class="inner-line">
            </div>
            <span v-if="level !== 0 && !hasChild(node)"
                  class="menu-spot">
            </span>
          </div>
          <div class="third-line"
               v-if="level === 2">
          </div>
          <span :class="['icon', node.expand ? 'rotate180-enter' : 'rotate180-leave']">
            <Icon :type="icon"
                  v-if="hasChild(node)"
                  @click="clickIcon(node)" />
          </span>
          <div style="margin-left:20px"
               :class="['inner-wrap', {'drop-inner': isDrop(node),'third-font': level === 2}]"
               @click.stop="clickContent(node, treeData)">
            <slot :node="node"
                  :treeData="treeData">
              <span class="text-span"
                    style="margin-right:50px"
                    v-show="!(node === activeNode.editNodes)">
                <Tooltip placement="top" :content="node.text" :delay="1000">
                  {{node.text}}
                </Tooltip>
              </span>
              <Input v-show="(node === activeNode.editNodes)"
                     :maxlength="50"
                     v-model="node.text"
                     style="width:auto;"
                     :ref="`p${node.id}`"
                     @on-enter="editNodeText(node)"
                     class="treeInput" />
              <Button @click="editNodeText(node, treeData)"
                      type="primary"
                      style="margin-left:20px"
                      v-if="node === activeNode.editNodes">确定</Button>
              <Icon v-if="node.attributes.menuType !== 2 && node.attributes.nodeType !== 2 && !(node === activeNode.editNodes)"
                    type="icon-add"
                    @click="addNode(node, treeData)"
                    class="tree-icon" />
              <Icon v-if="!(node === activeNode.editNodes) && editable"
                    type="icon-edit"
                    @click.stop="editNode(node, treeData)"
                    class="tree-icon" />
              <Icon v-if="!(node === activeNode.editNodes) && deletable"
                    type="icon-delete"
                    @click="deleteNode(node, treeData)"
                    class="tree-icon" />
            </slot>
          </div>
        </div>
        <!-- vue2.6+使用v-slot,方便兼容vue3.0 -->
        <transition name="transition-drop">
          <sh-tree v-show="node.expand"
                   class="sh-tree"
                   :editable="editable"
                   :deletable="deletable"
                   :level="1 + level"
                   :changeData="changeData"
                   :draggable="draggable"
                   :treeData="node.children"
                   :commonData="commonData"
                   :renderTreeNode="renderTreeNode"
                   :showCheckbox="showCheckbox">
          </sh-tree>
        </transition>
      </li>
    </ul>
  </div>
</template>

<script>
// import Icon from '../icon/Icon'
// import Render from './render'
export default {
  name: 'ShTree',
  components: {
    // Icon,
    // Render
  },
  props: {
    level: {
      type: Number,
      default: 0
    },
    renderTreeNode: {
      type: Function
    },
    icon: {
      type: String,
      default: 'icon-down'
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    changeData: { // 是否需要响应拖拽
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    deletable: {
      type: Boolean,
      default: true
    },
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    commonData: {
      default: () => {
        return {
          activeNode: {}, // 激活节点
          target: [], // 拖动组件
          dropData: {}, // 拖动数据
          dropType: null, // 拖动类型[插入，禁止]（插入子节点，禁止拖放）
          dropNode: null // 拖放容器
        }
      }
    },
    searchVal: {
      type: [Number, String]
    }
  },
  data () {
    return {
      activeNode: {},
      oneNode: [],
      reset_key: 0
    }
  },
  computed: {
    paddingLeft () {
      return this.firstCompoents() ? 0 : null
    }
  },
  mounted () {
    this.activeNode = this.commonData
  },
  methods: {
    firstCompoents () {
      return this.$parent.$options.name !== 'ShTree'
    },
    hasChild (node) {
      return node.hasChildren
    },
    isDrop (node) {
      return node === this.activeNode.dropNode && node !== this.activeNode.dropData
    },
    emitChecked (node) {
      if (!this.firstCompoents()) {
        this.$parent.emitChecked(node)
      } else {
        this.$nextTick(() => {
          this.countCheckedArr(node)
        })
      }
    },
    emitEvent (event, params) {
      if (!this.firstCompoents()) {
        this.$parent.emitEvent(event, params)
      } else {
        this.$emit(event, params)
      }
    },
    clickContent (node, arr) {
      this.$set(this.activeNode, 'activeNode', node)
      this.emitEvent('on-selected-change', {
        target: node,
        callback: (n) => {
          node = n
          this.$set(this.activeNode, 'activeNode', null)
        }
      })
    },
    clickIcon (node) {
      this.reset_key++
      this.$set(node, 'expand', !node.expand)
      if (node.hasChildren) {
        if (node.children && node.children.length) {
          return false
        } else {
          this.emitEvent('load-data', {
            target: node,
            callback: (node, childs) => {
              node.children = [...childs]
            }
          })
        }
      }
    },
    addNode (node, arr) {
      this.emitEvent('on-add', {
        target: node,
        callback: (node, obj) => {
          this.$set(node, 'expand', true)
          arr.forEach(n => {
            if (n === node) {
              if (!n.children) {
                n.children = []
              }
              if (n.children.length === 0) {
                n.children.push(obj)
              } else if (n.children.length > 0) {
                let cds = this.$utils.deepCopy(n.children)
                n.children.length = 0
                cds.push(obj)
                n.children = cds
              }
            }
          })
          setTimeout(() => {
            this.reset_key++
          }, 1)
        }
      })
    },
    editNode (node, arr) {
      if (this.activeNode.editNodes) {
        if (!this.activeNode.editNodes.text) {
          this.activeNode.backArr.forEach(n => {
            if (n === this.activeNode.editNodes) {
              n.text = this.activeNode.backText
            }
          })
        }
      }
      this.$set(this.activeNode, 'backText', node.text)
      this.$set(this.activeNode, 'backArr', arr)
      this.$set(this.activeNode, 'editNodes', node)
      this.$refs['p' + node.id][0].focus()
      this.emitEvent('on-edit', {
        target: node,
        callback: (node) => {
          arr.forEach(n => {
            if (n === node) {
              n = node
            }
          })
          this.$set(this.activeNode, 'editNodes', null)
        }
      })
    },
    editNodeText (node, arr) {
      if (!node.text) {
        this.$message({
          type: 'error',
          message: '菜单名称不能为空！'
        })
        arr.forEach(n => {
          if (n === node) {
            n.text = this.activeNode.backText
          }
        })
      } else if (node.text === this.activeNode.backText) {
        this.$set(this.activeNode, 'editNodes', null)
      } else {
        this.emitEvent('submitNodeText', node)
      }
    },
    deleteNode (node, arr) {
      this.emitEvent('on-delete', {
        target: node,
        callback: node => {
          arr.forEach((n, i) => {
            if (n === node) {
              arr.splice(i, 1)
            }
          })
        }
      })
    },
    /**
     * 节点拖拽事件
    */
    handleDragStart (item, event) {
      item.level = this.level
      if (item.expand) {
        this.$set(item, 'expand', false)
      }
      this.$set(this.activeNode, 'dropData', item)
      this.activeNode.target = this.treeData
    },
    handelDragEnter (index, event) {
      const target = this.treeData[index]
      if (event.fromElement) {
        if (!target.expand && target !== this.activeNode.dropData && this.level < this.activeNode.dropData.level) {
          this.$set(target, 'expand', true)
        }
      }
      if (this.level !== this.activeNode.dropData.level) {
        this.$set(this.activeNode, 'dropNode', null)
        this.$set(this.activeNode, 'dropType', 'disabled')
      } else {
        this.$set(this.activeNode, 'dropNode', target)
        this.$set(this.activeNode, 'dropType', 'inset')
      }
    },
    handleDrop (index, event) {
      const target = this.treeData[index]
      if (target !== this.activeNode.dropData && this.activeNode.dropType !== 'disabled') {
        if (this.changeData) {
          this.dropCallback(index)
        }
        this.emitEvent('on-drop', {
          parentNode: target,
          targetNode: this.activeNode.dropData,
          index: index, // 添加下标
          callback: this.dropCallback
        })
      }
    },
    dropCallback (index, node = this.activeNode.dropData) {
      let _index = 0
      this.activeNode.target.forEach((obj, i) => {
        if (obj === this.activeNode.dropData) {
          _index = i
        }
      })
      if (this.treeData === this.activeNode.target) {
        [this.treeData[index], this.treeData[_index]] = [this.treeData[_index], this.treeData[index]]
      } else {
        this.treeData.splice(index, 0, node)
        this.activeNode.target.splice(_index, 1)
      }
      this.$set(this.activeNode, 'activeNode', this.activeNode.dropData)
      this.$set(this.activeNode, 'dropData', null)
    },
    handleDragEnd () {
      this.$set(this.activeNode, 'dropNode', null)
      this.$set(this.activeNode, 'dropType', null)
    },
    /**
     * 查找所有子孙组件（可选枝干组件）
     * 查找结果平级展示
    */
    searchNode () { },
    /**
     * 父级组件使用事件监听
     * 子孙后代使用递归查找
    */
    countState (node) {
      let result = false
      if (this.hasChild(node) && this.showCheckbox) {
        let checkAll = true
        node.children.forEach(obj => {
          if (obj.checked || obj.halfelEction) {
            result = true
          }
          if (!obj.checked) {
            checkAll = false
          }
        })
        this.$set(node, 'checked', checkAll)
      }
      this.$set(node, 'halfelEction', result)
      return (result && !node.checked)
    },
    changeCheckBox (node) {
      let stack = []// 同来存放将来要访问的节点
      stack.push(node)
      let num = 1 // 当前节点数据不改变
      while (stack.length !== 0) {
        let item = stack.pop()// 正在访问的节点
        if (num !== 1 && !item.disabled) {
          this.$set(item, 'checked', !!node.checked)
        }
        let childrens = item.children
        for (let i = childrens.length - 1; i >= 0; i--) { // 将现在访问点的节点的子节点存入stack，供将来访问
          stack.push(childrens[i])
        }
        num++
      }
      this.emitChecked(node)
    },
    countCheckedArr (obj, arr = this.treeData) {
      let result = []
      if (arr.length > 0) {
        arr.forEach(node => {
          let stack = [node]
          while (stack.length !== 0) {
            let item = stack.pop()
            if (item.checked) {
              result.push(item)
            }
            if (this.hasChild(item)) {
              let childrens = item.children
              for (let i = childrens.length - 1; i >= 0; i--) {
                stack.push(childrens[i])
              }
            }
          }
        })
      }
      this.$emit('on-checked-change', { node: obj, selectedData: result })
      return result
    },

    /** 闭合其他节点 edit 视图 @util */
    closeEdit (node) {
      this.treeData.forEach(one => {
        one.isEdit = one !== node
        if (one.hasChildren) {
          one.children.forEach(two => {
            two.isEdit = two !== node
            if (two.hasChildren) {
              one.children.forEach(three => {
                three.isEdit = three !== node
              })
            }
          })
        }
      })
    }

  }
}
</script>
<style scoped lang="less">
@import "../assets/css/color.less";
@deep: '>>>';
// 中型尺寸
@media only screen and (max-width: 1440px) and (min-width: 768px) {
  .text-span {
    width: auto;
    min-width: 180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
// 最优尺寸
@media only screen and (max-width: 1920px) and (min-width: 1441px) {
  .text-span {
    width: auto;
    min-width: 280px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.treeInput input {
  background-color: transparent !important;
  /* border: 1px solid transparent !important; */
}
.tree-icon {
  margin-right: 20px;
  color: #8f9bb2;
}
.line {
  position: absolute;
  left: -36px;
  width: 40px;
  height: 42px;
  border-left: 1px solid #d3dbeb;
  .inner-line {
    height: 21px;
    border-bottom: 1px solid #d3dbeb;
  }
}

.line70 {
  position: absolute;
  left: -36px;
  width: 70px;
  height: 42px;
  border-left: 1px solid #d3dbeb;
  .inner-line {
    height: 21px;
    border-bottom: 1px solid #d3dbeb;
  }
}

.lastLine {
  position: absolute;
  left: -36px;
  width: 40px;
  height: 42px;
  .inner-line {
    height: 21px;
    border-bottom: 1px solid #d3dbeb;
    border-left: 1px solid #d3dbeb;
  }
}

.lastLine70 {
  position: absolute;
  left: -36px;
  width: 70px;
  height: 42px;
  .inner-line {
    height: 21px;
    border-bottom: 1px solid #d3dbeb;
    border-left: 1px solid #d3dbeb;
  }
}

.second-last-node {
  .third-line {
    display: none;
  }
}
.h-line {
  position: absolute;
  height: 20px;
  width: 37px;
  border-bottom: 1px solid #d3dbeb;
}
.menu-spot {
  width: 5px;
  height: 5px;
  background-color: @normal-color;
  position: absolute;
  top: 18px;
  border-radius: 10px;
  left: 68px;
}
.third-line {
  position: absolute;
  left: -82px;
  height: 42px;
  width: 1px;
  border-left: 1px solid #d3dbeb;
}
/* .drop-node {
  background: #00f;
} */
// 覆盖组件库样式
.sh-tree .child-node{
  line-height: 42px;
}
.inner-wrap:hover {
  .iconfont {
    display: block;
  }
}
.tree-icon {
  display: none;
}
</style>
