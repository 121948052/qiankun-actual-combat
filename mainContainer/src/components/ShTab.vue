<template>
  <div class="sh-tabs-wrap" v-clickoutside="hideMenu">
    <div :class="['prev-btn', { 'tabs-disabled': disabledPrev }]" @click="clickPrev">
      <Icon  v-if="showPage" type="icon-left-bracket" size="14" />
    </div>
    <ul class="sh-tabs" ref="tabWrap" @scroll.stop="judgeScroll">
      <li :class="['tabs', { 'tabs-active': t.path === activeTab, 'tabs-disabled': t.disabled }]"
      v-for="(t, i) in list" :key="i" @click.stop="clickTab(t, i)">
        <span v-if="t.path === activeTab" class="left-radio"></span>
        <span v-if="t.path === activeTab" class="right-radio"></span>
        <div class="label" :title="t.label">{{t.label}}</div>
        <Icon type="icon-close" v-show="t.closed" size="12" @click.stop="closeTab(t, i)" :class="[]" />
      </li>
    </ul>
    <div :class="['next-btn', { 'tabs-disabled': disabledNext }]" @click="clickNext">
      <Icon v-if="showPage" type="icon-right-bracket" size="14" />
    </div>
    <div class="close-menu" @click="showMenu = !showMenu" v-if="list.length > 1">
      <Icon type="icon-more" size="14" class="close-icon" />
      <ul class="tabs-menu-wrap" v-show="showMenu">
        <li v-for="(menu, i) in menuList" :key="i" @click.stop="clickMenu(menu)">
          <Icon :size="menu.size" :type="menu.icon" />
          {{menu.label}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import clickoutside from '../directives/clickoutside.js'
import { mapMutations } from 'vuex'

export default {
  name: 'ShTab',
  props: {
    value: {
      type: String
    },
    list: {
      type: Array,
      required: true
    }
  },
  directives: {
    clickoutside
  },
  data () {
    this.menuList = [
      {
        label: '关闭左侧',
        value: 'closeLeft',
        icon: 'icon-close-left',
        size: 12
      },
      {
        label: '关闭右侧',
        value: 'closeRight',
        icon: 'icon-close-right',
        size: 12
      },
      {
        label: '关闭其他',
        value: 'closeOther',
        icon: 'icon-shanchu1',
        size: 12
      },
      {
        label: '关闭所有',
        value: 'closeAll',
        icon: 'icon-close-all',
        size: 14
      }
    ]
    return {
      activeTab: '',
      showMenu: false,
      showPage: false,
      disabledPrev: true,
      disabledNext: true
    }
  },
  computed: {

  },
  watch: {
    value (val) {
      this.activeTab = val
      this.$nextTick(this.autoScroll)
    },
    list: {
      deep: true,
      handler: function () {
        this.$nextTick(this.autoScroll)
      }
    }
  },
  mounted () {
    this.activeTab = this.value
    this.autoScroll()
  },
  methods: {
    ...mapMutations(['SET_TAB_LIST']),
    // move (ele, attribute, lang, speed) {
    //   let timer = setInterval(() => {
    //     if (ele[attribute] < lang) {
    //       ele[attribute] += speed
    //     } else {
    //       ele[attribute] = lang
    //       clearInterval(timer)
    //     }
    //   }, speed)
    // },
    clickPrev () {
      // 向上一个
      /**
       * 根据当前滚动距离 判断将那个tabs完整显示，从而控制滚动距离
       */
      this.$refs.tabWrap.scrollLeft -= 110
      // this.move(this.$refs.tabWrap, 'scrollLeft', 110, 30)
    },
    clickNext () {
      // 向下一个
      this.$refs.tabWrap.scrollLeft += 110
    },
    clickMenu (closeType) {
      let result = []
      const index = this.list.findIndex(tab => tab.path === this.activeTab)
      switch (closeType.value) {
        case 'closeOther':
          // 除却当前tab，其他全部关闭
          this.list.forEach(tab => {
            if (tab.closed !== true || tab.path === this.activeTab) result.push(tab)
          })
          break
        case 'closeLeft':
          // 关闭当前tab左侧的所有tab
          result = this.list.filter((tab, i) => !(i < index && tab.closed !== false))
          break
        case 'closeRight':
          // 关闭当前tab右侧所有tab
          result = this.list.filter((tab, i) => !(i > index && tab.closed !== false))
          break
        case 'closeAll':
          // 关闭所有tab
          result = this.list.filter(tab => tab.closed === false)
          this.$router.push('/work/home')
          break
      }
      this.SET_TAB_LIST(result)
      this.hideMenu()
    },
    clickTab (tab, index) {
      this.$emit('on-click', { tab, index })
    },
    closeTab (tab, index) {
      this.$emit('on-close', { tab, index })
    },
    judgeScroll () {
      /**
       * 1. 判断是否有滚动条
       * 2. 根据菜单动态滚动tabs，使activetabs始终保持显示
       */
      const el = this.$refs.tabWrap
      this.showPage = el.scrollWidth > el.clientWidth
      this.disabledPrev = !!(el.scrollLeft === 0 || !this.showPage)
      this.disabledNext = !!(el.scrollLeft === el.scrollWidth - el.clientWidth || !this.showPage)
    },
    autoScroll () {
      this.judgeScroll()
      if (this.showPage) {
        /**
         * 1. 循环判断activeTab.index
         * 2. index * 136 > el.scrollLeft
         */
        let index = null
        this.list.some((tab, i) => {
          if (tab.path === this.activeTab) {
            index = i
            return index
          }
        })
        if (index) this.$refs.tabWrap.scrollLeft = (index + 1) * 110 - this.$refs.tabWrap.clientWidth
      }
    },
    hideMenu () {
      this.showMenu = false
    }
  }
}
</script>

<style scoped lang="less">
.sh-tabs-wrap {
  width: ~"calc(100% - 520px)";
  // flex: 1;
  display: flex;
  align-items: center;
  .close-menu {
    padding: 4px;
    margin-right: 20px;
    .close-icon {
      color: #fff;
    }
    transition: background-color .3s;
    position: relative;
    .tabs-menu-wrap {
      z-index: 1;
      width: 100px;
      position: absolute;
      background: #fff;
      border: 1px solid #E1E3EA;
      box-shadow: 0px 1px 5px 0px rgba(194, 196, 204, 0.4);
      z-index: 100;
      top: 35px;
      right: 0;
      .iconfont {
        color: #6f7e95;
      }
      li {
        transition: all .3s;
        padding: 10px 16px;
        &:hover {
          color: #397AFD;
          background-color: #E7EFFC;
          .iconfont {
            color: #397AFD;
          }
        }
      }
    }
    &:hover {
      cursor: pointer;
      background: rgba(255, 255, 255, .2);
      border-radius: 2px;
    }
  }
}
.sh-tabs {
  margin-bottom: 0 !important;
  margin-top: 4px;
  display: flex;
  flex: 1;
  height: 36px;
  color: #A6CBFB;
  position: relative;
  overflow-x: auto;
  padding-left: 62px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  .tabs {
    flex: none;
    width: 110px;
    display: flex;;
    align-items: center;
    border-radius: 4px;
    justify-content: space-between;
    padding: 0 10px 6px 10px;
    position: relative;
    cursor: pointer;
    // transition: all .3s;
    .label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &:first-child {
      width: 62px;
      // width: 68px;
      position: fixed;
      left: 184px;
      height: 36px;
      z-index: 1;
      background: #0673FC;
      border-radius: 0 4px 4px 0;
      padding-left: 16px;
    }
    &:last-child {
      &::before {
        background: none;
      }
    }
    .iconfont {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      color: #A6CBFB;
      &:hover {
        color: #fff;
        border-radius: 50%;
        background:rgba(239,239,245,.2)
      }
    }
    &::before {
      content: "";
      width: 1px;
      height: 16px;
      background: rgba(255, 255, 255, .3);
      position: absolute;
      right: 0px;
    }
    // &:hover{
    //   color: #fff;
    //   height: 100%;
    //   background: rgba(255,255,255, .2);
    //   position: relative;
    //   border-radius: 4px 4px 0 0;
    //   .left-radio {
    //     width: 4px;
    //     height: 4px;
    //     background: rgba(255,255,255, .2);
    //     position: absolute;
    //     left: -4px;
    //     bottom: 0;
    //     &::after {
    //       position: absolute;
    //       content: "";
    //       height: 4px;
    //       width: 4px;
    //       background: #0673FC;
    //       border-radius: 0 0 4px 0;
    //     }
    //   }
    //   .right-radio {
    //     width: 4px;
    //     height: 4px;
    //     background: rgba(255,255,255, .2);
    //     position: absolute;
    //     right: -4px;
    //     bottom: 0;
    //     &::before {
    //       position: absolute;
    //       content: "";
    //       width: 4px;
    //       height: 4px;
    //       background: #0673FC;
    //       border-radius: 0 0 0 4px;
    //     }
    //   }
    // }
    &-active{
      color: #0673FC;
      height: 100%;
      background: #EFEFF5;
      border-radius: 4px 4px 0 0;
      box-shadow: .5px 0px 2px 0px rgba(255, 255, 255, .3);
      .label {
        color: #0673fc !important;
        font-weight: 400 !important;
      }
      &:first-child {
        background: #EFEFF5;
        border-radius: 4px;
        .left-radio{
          width: 8px;
        }
        .right-radio{
          width: 8px;
          &::after {
            width: 8px;
            right: -4px;
          }
        }
      }
      .iconfont {
        color: #0673FC;
        &:hover {
          background: #0673FC;
        }
      }
      .left-radio {
        width: 4px;
        height: 4px;
        background: #EFEFF5;
        position: absolute;
        left: -4px;
        bottom: 0;
        &::after {
          position: absolute;
          content: "";
          height: 4px;
          width: 4px;
          background: #0673FC;
          border-radius: 0 0 4px 0;
        }
      }
      .right-radio {
        width: 4px;
        height: 4px;
        background: #EFEFF5;
        position: absolute;
        right: -4px;
        bottom: 0;
        &::after {
          position: absolute;
          content: "";
          width: 4px;
          height: 4px;
          background: #0673FC;
          border-radius: 0 0 0 4px;

        }
      }
    }
  }
}
.prev-btn, .next-btn {
  cursor: pointer;
  display: flex;;
  align-items: center;
  justify-content: space-between;
  width: 24px;
  height: 24px;
  // margin: 0 10px 0 0;
  .iconfont {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: #fff;
    border-radius: 50%;
    // background: rgba(255,255,255, .2);
    &:hover {
      transition: all .3s;
      color: #fff;
      border-radius: 50%;
      background: rgba(255,255,255, .2);
    }
  }
}
.tabs-disabled {
  cursor: not-allowed;
  .iconfont {
    opacity: .5;
    &:hover {
      background: none;
    }
  }
}
</style>
