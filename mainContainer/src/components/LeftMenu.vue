<template>
  <div id="menu" >
    <div><Input class="search-menu" prefix="icon-search" readonly placeholder="请输入菜单" @click.native.stop="hiddenSearch" /></div>
    <ul @mouseleave="hiddenMenu" class="menu-div" ref="menu">
      <li v-for="(menu, i) in leftMenu" :key="menu.id" :class="['menu-item', {'menu-item-active': menu.attributes.url === activeMenu, 'menu-item-hover': menu.id === hoverMenu.id }]" @mouseenter="showMenu(menu, i)">
        {{menu.text}}
        <Icon v-if="menu.children && menu.children.length > 0" size="13" class="right-icon" type="icon-right-bracket" />
      </li>
      <li :style="menuStyle" class="menu-wrap" v-if="isShowMenu">
        <div style="width:100%; height: 100%; overflow-x: hidden; overflow-y: auto;">
          <ul class="menu-child-content">
            <li class="menu-first-item" v-for="(child, i) in hoverMenu.children" :key="i">
              <div class="first-title">{{child.text}}</div>
              <p class="line"></p>
              <ul class="menu-second-item" v-if="child.hasChildren">
                <li v-for="(last, index) in child.children" :key="index" @click="clickRouter(last)" :class="[{'item-active': last.attributes.url === $route.path}]">
                  {{last.text}}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </li>
      <li v-if="showSearch" class="search-wrap" v-clickoutside="() => showSearch = false" @click.stop @keydown.enter="search">
        <Input prefix="icon-search" placeholder="请输入菜单名称" clearable v-model="searchMenu" />
        <Button :loading="searching" type="primary" @click="search">搜索</Button>
        <div class="search-result-wrap" v-if="searchResult.length > 0">
          <ul class="search-result menu-child-content">
            <li class="menu-first-item" v-for="(child, i) in searchResult" :key="i">
              <div class="first-title">{{child.text}}</div>
              <p class="line"></p>
              <ul class="menu-second-item" v-if="child.hasChildren">
                <li v-for="(last, index) in child.children" :key="index" @click="clearSearchVal(last)">
                  {{last.text}}
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div v-else class="empty">
          暂无数据
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

import { save } from '@/storage'
import { mapState, mapActions, mapMutations } from 'vuex'
import clickoutside from '../directives/clickoutside.js'

export default {
  name: 'LeftMenu',
  props: {
    active: String
  },
  directives: {
    clickoutside
  },
  data () {
    return {
      searchMenu: '',
      isShowMenu: false,
      showSearch: false,
      hoverMenu: {},
      activeMenu: null,
      menuStyle: {},
      searchResult: [],
      searching: false
    }
  },
  computed: {
    ...mapState({
      tabList: ({ common }) => common.tabList,
      leftMenu: ({ tenant }) => tenant.leftMenu
    })
  },
  watch: {
    active (val) {
      this.findMenu(val)
      /**
       * 遍历左侧菜单，寻找当前菜单对应一级路由
       */
    }
  },
  methods: {
    ...mapActions(['searchUserMenu']),
    ...mapMutations(['PUSH_TAB_LIST']),
    isEmpty (val = this.searchMenu) {
      return val && val.trim() !== ''
    },
    findMenu (url) {
      if (url === this.activeMenu) return
      let result = {}
      function deepFind (arr, firstMenu) {
        for (let i = 0; i < arr.length; i++) {
          const first = firstMenu || arr[i]
          const item = arr[i]
          if (result.attributes) break
          if (item.attributes.url === url) {
            result = first
            break
          }
          if (item.children) deepFind(item.children, first)
        }
      }
      deepFind(this.leftMenu)
      this.activeMenu = result.attributes ? result.attributes.url : ''
    },
    routeTo (route) {
      if (route.path !== this.$route.path) {
        this.$router.push(route.path)
        window.sessionStorage.setItem('currentTabName', route.label)
      }
    },
    search () {
      if (this.searching) return
      this.searching = true
      this.searchResult = []
      this.searchUserMenu({ searchKey: this.searchMenu })
        .then(res => {
          res.data.forEach(menu => {
            this.searchResult.push(...menu.children)
          })
        })
        .finally(() => {
          this.searching = false
        })
    },
    hiddenMenu () {
      if (this.isShowMenu) {
        this.isShowMenu = false
      }
      this.hoverMenu = {}
    },
    hiddenSearch () {
      if (this.isShowMenu) this.isShowMenu = false
      this.showSearch = true
    },
    showMenu (menu, index) {
      /**
       * 1. 显示左侧菜单
       * 2. 计算菜单定位位置（滚动条情况）
       */
      if (!this.showSearch && menu.children && menu.children.length > 0) {
        this.hoverMenu = menu
        this.isShowMenu = true
        const maxHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeigh
        const top = 40 + 40 + index * 38 - this.$refs.menu.scrollTop
        if (maxHeight - top - 370 <= 10) {
          this.menuStyle = { bottom: '10px' }
        } else {
          this.menuStyle = { top: top + 'px' }
        }
      }
    },
    clickRouter (obj) {
      this.activeMenu = this.hoverMenu.attributes.url
      save('currentMenu', this.activeMenu)
      this.routeTo({ path: obj.attributes.url, label: obj.text || obj.menuName })
      this.hiddenMenu()
    },
    clearSearchVal (obj) {
      this.searchMenu = ''
      this.searchResult = []
      this.showSearch = false
      this.routeTo({ path: obj.attributes.url, label: obj.text || obj.menuName })
    }
  }
}
</script>

<style scoped lang="less">
@deep: ~">>>";
#menu {
  padding-top: 20px;
  width: 140px;
  height: 100%;
  background: #001529;
  scrollbar-width: none;
  -ms-overflow-style: none;
  .menu-div {
    height: ~"calc(100% - 40px)";
    width: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .menu-wrap, .search-wrap {
    left: 140px;
    position: fixed;
    padding: 24px 0 20px 24px;
    width: 540px;
    z-index: 999;
    box-shadow:0px 2px 13px 0px rgba(175,175,175,0.47);
    background: #fff;
  }
  .menu-wrap {
    height: 370px;
  }
  .menu-child-content {
    column-count:4;
    .menu-first-item {
      width: 100px;
      break-inside: avoid;
      padding-bottom: 26px;
      line-height: 1;
      .first-title {
        color: #333333;
        font-size: 13px;
        font-weight: 600;
      }
      .line {
        width: 100px;
        height: 1px;
        background: #EBEBEB;
        margin: 14px 0;
      }
      .menu-second-item {
        color: #707070;
        font-size: 12px;
        li {
          padding-bottom: 14px;
          cursor: pointer;
          &:hover {
            color: #0673FC;
          }
        }
      }
      .item-active {
        color: #0673FC;
      }
    }
  }
  .menu-item {
    color: #A6ADB4;
    height: 38px;
    padding: 0 20px;
    transition: all .3s;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    .right-icon {
      color: rgba(255, 255, 255, .4);
    }
    &:hover {
      color: #fff;
      background: #083155;
      .right-icon {
        color: #fff;
      }
    }
    &-hover {
      color: #fff;
      background: #083155;
      .right-icon {
        color: #fff;
      }
    }
    &-active {
      color: #fff;
      background: #3377FF;
      .right-icon {
        color: #fff;
      }
    }
  }
  /deep/.search-wrap {
    top: 54px;
    height: 370px;
    padding-bottom: 0;
    .sh-input-wrapper {
      width: 82%;
      margin-right: 10px;
      input {
        width: 100%;
      }
    }
    .sh-btn {
      display: inline-flex;
    }
    .search-result-wrap {
      width: 100%;
      height: 290px;
      overflow: auto;
      margin-top: 10px;
      padding: 0px 20px 0 20px;
    }
    .search-result {
      column-count:4;
      .result {
        cursor: pointer;
        padding: 10px 0;
        &:hover {
          color: #0673FC;
        }
      }
    }
    .empty {
      padding: 14px;
    }
  }
  @{deep} .search-menu {
    margin: 0 10px 10px 10px;
    .sh-input {
      font-size: 12px;
      cursor: pointer;
      width: 120px;
      background: #32475B;
      color: #A6ADB4;
      border-color: transparent;
    }
    .sh-input-prefix {
      left: 2px;
    }
    .sh-input-prefix i, .sh-input-suffix i {
      font-size: 20px;
    }
    .sh-input:focus {
      border-color: transparent;
      box-shadow: none;
    }
  }
}
</style>
