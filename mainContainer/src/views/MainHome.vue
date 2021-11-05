<template>
  <div id="main-home">
    <a-select default-value="菜单1" style="width: 120px" @change="handleChange">
      <a-select-option value="菜单1">
        菜单1
      </a-select-option>
      <a-select-option value="菜单2">
        菜单2
      </a-select-option>
      <a-select-option value="菜单3" disabled>
        菜单3
      </a-select-option>
      <a-select-option value="菜单4">
        菜单4
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
export default {
  name: 'MainHome',
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less">
</style>
