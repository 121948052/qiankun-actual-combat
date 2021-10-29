<template>
  <div id="app">
    <keep-alive :max="10" :exclude="$GAIA_STORE.GAIA_STATE.catchComponent[appName]">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>

import { read } from '@/storage'
import localforage from 'localforage'
export default {
  name: 'App',
  data () {
    return {
      catchComponent: [],
      appName: require('../package.json').name
    }
  },
  computed: {
  },
  watch: {
    $route (val) {
      this.go404()
    }
  },
  methods: {
    go404 (name = this.$route.name) {
      if (name === '404') window.func.changeRouter('replace', '/404')
    },
    beforeunloadHandler () {
      this._beforeUnload_time = new Date().getTime()
    },
    unloadHandler (e) {
      if (!read('token')) {
        this.clearStrutsTree()
      }
    },
    clearStrutsTree () {
      localforage.setItem(this.$store.getters.getStructsTreeKey, [])
    }
  },
  mounted () {
    this.GAIA_COM_MUTATIONS.SET_CATCH_COMPONENT({
      key: this.appName,
      arr: this.catchComponent
    })
    this.go404()
    this.$shui.size = this.$GAIA_STORE.GAIA_STATE.compoentsSize
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.addEventListener('unload', e => this.unloadHandler(e))
    this.$onGlobalStateChange((state, prev) => {
      if (state.isLogout) {
        this.clearStrutsTree()
      }
    })
  },
  destroyed () {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.removeEventListener('unload', e => this.unloadHandler(e))
  }
}
</script>

<style lang="less">
  html,
  body,
  #app {
    height: 100%;
    width: 100%;
  }
</style>
