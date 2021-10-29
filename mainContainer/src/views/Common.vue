<template>
  <div id="common">
    <Layout>
      <sh-header v-if="$route.path !== '/404'">
        <sh-tab v-model="currentTab" :list="tabList" @on-click="changeRouter" @on-close="closeRouter"/>
      </sh-header>
      <Layout style="flex-direction: row; height: calc(100% - 44px)">
        <Article class="left-nav" v-if="!hiddenMenu">
          <left-menu :active="currentTab"/>
        </Article>
        <Content class="right-content">
          <div class="router-view" ref="router">
            <keep-alive v-show="!isSubRouter()">
              <router-view></router-view>
            </keep-alive>
            <div id="root-view"></div>
          </div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import ShTab from '../components/ShTab'
import ShHeader from '../components/ShHeader'
import LeftMenu from '../components/LeftMenu'
import { save, read, clear } from '../storage'
import { isSubRouter } from '../assets/js/router'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Common',
  components: {
    ShTab,
    ShHeader,
    LeftMenu
  },
  data () {
    return {
      isSubRouter: isSubRouter,
      currentTab: null,
      isOutModel: false,
      hiddenMenu: false
    }
  },
  computed: {
    ...mapState({
      tabList: ({ common }) => common.tabList,
      stopClose: ({ common }) => common.stopClose
    })
  },
  watch: {
    $route (val) {
      this.countMenuList(val)
    },
    tabList: {
      deep: true,
      handler: function (val, oldVal) {
        save('tabList', JSON.stringify(val))
      }
    }
  },
  mounted () {
    this.SET_LOADED_APP(true)
    const menu = read('menu')
    if (menu) this.SET_LEFT_MENU(JSON.parse(menu))
    this.countMenuList(this.$route)
    const tabList = JSON.parse(read('tabList'))
    if (tabList && tabList.length > 0) this.SET_TAB_LIST(tabList)
  },
  methods: {
    ...mapMutations(['SET_TAB_LIST', 'PUSH_TAB_LIST', 'SET_LEFT_MENU', 'SET_LOADED_APP']),
    dispatchEvent (eventName, detail) {
      window.dispatchEvent(new CustomEvent(eventName, { detail: detail }))
    },
    changeRouter ({ tab, index }) {
      this.addCustomeEvent('tab-change-new', { event: 'active', args: { tab, index } })
      this.$router.push(tab.path)
    },
    closeRouter ({ tab, index }) {
      /**
       * 1. 抛出关闭事件
       * 2. 子系统监听事件，修改state(同步 SET_STOP_CLOSE)
       * 3. 主系统根据state判断是否需要继续执行，从而实现阻拦tabList
       */
      this.dispatchEvent('tab-close', { tab, index })
      this.addCustomeEvent('tab-change-new', { event: 'close', args: { tab, index } })
      if (!this.stopClose) {
        const result = this.tabList.filter(t => t.path !== tab.path)
        this.SET_TAB_LIST(result)
        this.$router.replace(result[result.length - 1].path)
        // const path = this.$route.fullPath
        // if (path === '/502' || path === '/403') return this.$router.replace('/work/home')
      }
    },
    countMenuList (val) {
      const state = val.path !== '/502' && val.path !== '/403' && val.path !== '/404'
      const { path, fullPath, query } = val
      if (!this.isSubRouter()) {
        this.$nextTick(() => {
          let routers = this.$router.options.routes.filter(t => t.path === val.path)
          // 后边进行权限校验
          if (val.path !== '/' && this.$refs.router.childNodes[0].nodeType === 8 && (!routers || routers.length === 0)) {
            return this.$router.replace('/404')
          }
        })
      }
      if (state) {
        this.currentTab = fullPath
        /**
         * 新增路由
         * 1. 子系统路由的name    拿不到
         * 2. 子系统路由的params  拿不到
         * 3. 子系统路由的meta    拿不到
         * 4. 仅能拿到loaction相关信息
         *    a: fullPath
         *    b: query
         *    c: path
         */
        let payload = {
          name: query._s ? fullPath : path, // _s表示是否使用严格比对即含有query的路径
          path: fullPath, // 严格比对
          label: read('currentTabName'), // tab-name
          closed: !query._disClose // 禁止关闭
        }
        if (payload.label) {
          const index = this.tabList.findIndex(tab => tab.name === payload.name)
          if (index > -1) {
            const result = this.$utils.deepCopy(this.tabList)
            result.splice(index, 1, payload)
            this.SET_TAB_LIST(result)
            this.dispatchEvent('tab-change', { tab: payload, index })
          } else {
            this.PUSH_TAB_LIST(payload)
            this.dispatchEvent('tab-add', { tab: payload, index: this.tabList.length })
            this.addCustomeEvent('tab-change-new', { event: 'add', args: { tab: payload, index: this.tabList.length - 1 } })
          }
        }
        // if (payload.label && !this.tabList.find(tab => tab.path === payload.path)) {
        //   this.PUSH_TAB_LIST(payload)
        //   this.dispatchEvent('tab-add', { tab: payload, index: this.tabList.length })
        // }
      }
      clear('currentTabName')
      // eslint-disable-next-line no-return-assign
      if (path === '/403' || path === '/502') return this.hiddenMenu = true
      if (this.hiddenMenu) this.hiddenMenu = false
    },
    addCustomeEvent (eventName, params) {
      window.dispatchEvent(new CustomEvent(eventName, { detail: { ...params } }))
    }
  }
}
</script>
<style scoped lang="less">

#common {
  height : 100%;
  width  : 100%;
}

/deep/ .left-nav {
  height             : 100%;
  background         : white;
  flex               : none;
  -ms-overflow-style : none;
  scrollbar-width    : none;
}

/deep/ .left-nav::-webkit-scrollbar {
  display : none;
}

.right-content {
  display        : flex;
  overflow       : hidden;
  flex-direction : column;
  padding        : 14 0 0 14;
  width          : 100%;
  height         : 100%;

  .router-view {
    height     : 100%;
    overflow-y : auto;
    background : white;

    /deep/ .home-wraps {
      height : ~"calc(100vh - 54px)";
    }
  }
}
</style>
