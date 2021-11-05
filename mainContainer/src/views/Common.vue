<template>
  <a-layout id="components-layout-demo-responsive">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
    >
      <div class="logo">Logo</div>
      <MainMenu />
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ background: '#fff', paddingLeft: '20px' }">
        <TagsMenu :tags="tabsList" @on-click="changeRouter" @on-close="closeRouter" />
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div class="router-view" ref="router" :style="{ padding: '24px', background: '#fff', minHeight: '460px' }">
          <keep-alive v-show="!isSubRouter()">
            <router-view></router-view>
          </keep-alive>
          <div id="root-view"></div>
        </div>
      </a-layout-content>
      <a-layout-footer style="textAlign: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import MainMenu from '../components/MainMenu'
import TagsMenu from '../components/TagsMenu'
import { save, read, clear } from '../storage'
import { isSubRouter } from '../assets/js/router'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Common',
  components: {
    MainMenu,
    TagsMenu
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
      tabsList: ({ common }) => common.tabsList,
      stopClose: ({ common }) => common.stopClose,
      loaded: ({ loaded }) => loaded
    })
  },
  watch: {
    $route (val) {
      this.countMenuList(val)
    },
    tabsList: {
      deep: true,
      handler: function (val, oldVal) {
        save('tabsList', JSON.stringify(val))
      }
    }
  },
  mounted () {
    this.loginSucceed()
  },
  methods: {
    ...mapMutations([
      'SET_TAB_LIST',
      'PUSH_TAB_LIST',
      'SET_LEFT_MENU',
      'SET_LOADED_APP',
      'GET_ASYNC_ROUTES'
    ]),
    loginSucceed () {
      this.SET_LOADED_APP(true)
      this.GET_ASYNC_ROUTES()
      this.countMenuList(this.$route)
      const tabsList = JSON.parse(read('tabsList'))
      if (tabsList && tabsList.length > 0) {
        this.SET_TAB_LIST(tabsList)
      } else {
        this.SET_TAB_LIST([{ label: '首页', name: '首页', path: '/main/home', closed: false }])
      }
    },
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
        const result = this.tabsList.filter(t => t.path !== tab.path)
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
          const index = this.tabsList.findIndex(tab => tab.name === payload.name)
          if (index > -1) {
            const result = this.$utils.deepCopy(this.tabsList)
            result.splice(index, 1, payload)
            this.SET_TAB_LIST(result)
            this.dispatchEvent('tab-change', { tab: payload, index })
          } else {
            this.PUSH_TAB_LIST(payload)
            this.dispatchEvent('tab-add', { tab: payload, index: this.tabsList.length })
            this.addCustomeEvent('tab-change-new', { event: 'add', args: { tab: payload, index: this.tabsList.length - 1 } })
          }
        }
        // if (payload.label && !this.tabsList.find(tab => tab.path === payload.path)) {
        //   this.PUSH_TAB_LIST(payload)
        //   this.dispatchEvent('tab-add', { tab: payload, index: this.tabsList.length })
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
<style lang="less">
#components-layout-demo-responsive {
  height: 100%;
  .logo {
    color: white;
    text-align: center;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
}
</style>
