<template>
  <div>
    <a-menu
      style="width: 200px"
      :default-selected-keys="['1']"
      :default-open-keys="['sub1']"
      mode="inline"
      :theme="theme"
      :selected-keys="[current]"
    >
      <a-menu-item v-for="i in menus" :key="i.name" @click="handleClick(i)">
        <a-icon type="mail" />
        {{ i.name }}
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      current: '1',
      theme: 'light'
    }
  },
  computed: {
    ...mapState({
      menus: ({ common }) => common.menus
    })
  },
  methods: {
    handleClick (e) {
      this.current = e.path
      this.$router.push(e.path)
    }
  }
}
</script>
