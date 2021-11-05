<template>
  <div id="base-wrap">
    <Commom />
  </div>
</template>

<script>
import Commom from './views/Common'
import { MicroApps } from '@/assets/js/router'
import { start, prefetchApps } from 'qiankun'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'App',
  components: {
    Commom
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      loaded: ({ loaded }) => loaded
    })
  },
  watch: {
  },
  mounted () {
    if (this.loaded) {
      this.reloadApp()
    } else {
      this.fetchCode()
    }
  },
  methods: {
    ...mapMutations(['GET_ASYNC_ROUTES']),
    reloadApp () {
      delete window.func
      console.log(MicroApps)
      // 预加载资源
      this.fetchCode()
      // 重启qiankun
      start({
        prefetch: false,
        sandbox: false,
        fetch (url) {
          return window.fetch(url, { cache: 'no-cache' })
        }
      })
    },
    fetchCode () {
      prefetchApps(MicroApps, {
        fetch (url) {
          console.log('fetch code', url)
          return window.fetch(url, {
            cache: 'no-cache'
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
@deep: ~">>>";
html,
body,
#base-wrap {
  height: 100%;
  width: 100%;
  .hidden-img {
    display: none;
    width: 0;
    height: 0;
  }
}

@{deep}.router-view, #root-view {
  overflow-y : auto;
  height: 100%;
  > div {
    height: 100%;
  }
}
</style>
