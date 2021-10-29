<template>
  <div id="base-wrap">
    <Commom />
  </div>
</template>

<script>
import Commom from './views/Common'
import { mapMutations, mapState } from 'vuex'
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
      compoentsSize: ({ common }) => common.compoentsSize
    })
  },
  watch: {
    compoentsSize (val) {
      this.$shui.size = val
      this.SET_TABLE_HEIGHT(val)
    }
  },
  mounted () {
  },
  methods: {
    ...mapMutations(['SET_COMPOENTS_SIZE', 'SET_TABLE_HEIGHT', 'SET_NOTICE_STATUS'])
  }
}
</script>

<style lang="less">
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
</style>
