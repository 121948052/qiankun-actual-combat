<template>
  <div>
    <a-select default-value="lucy" style="width: 120px" @change="handleChange">
      <a-select-option value="jack">
        Jack
      </a-select-option>
      <a-select-option value="lucy">
        Lucy
      </a-select-option>
      <a-select-option value="disabled" disabled>
        Disabled
      </a-select-option>
      <a-select-option value="Yiminghe">
        yiminghe
      </a-select-option>
    </a-select>
  </div>
</template>

<script>

export default {
  name: 'Page1',
  data () {
    return {
    }
  },
  activated () {
  },
  methods: {
  }
}
</script>
