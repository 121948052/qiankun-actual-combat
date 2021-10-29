<template>
  <header class="com-header">
    <section class="left-logo">
      header
    </section>
  </header>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import clickoutside from '../directives/clickoutside.js'

export default {
  name: 'Common',
  components: {
  },
  directives: {
    clickoutside
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      tabList: ({ common }) => common.tabList,
      currentMenu: ({ common }) => common.currentMenu
    })
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    ...mapActions(['loginOuts', 'changPasswd'])
  }
}
</script>
<style scoped lang="less">
</style>
