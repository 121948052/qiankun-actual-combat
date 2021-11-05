<template>
  <div>
    <a-tag v-for="(t) in tags" :key="t.name" @click="tagChange(t)" closable @close="closeTag(t)">
      {{ t.name }}
    </a-tag>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  name: 'TagsMenu',
  props: {
    tags: {
      type: Array
    }
  },
  methods: {
    ...mapMutations([
      'SET_CURRENT_TAB'
    ]),
    tagChange (e) {
      e.preventDefault()
      this.SET_CURRENT_TAB(e)
    },
    closeTag (e) {
      e.preventDefault()
      this.$emit('on-close', { e })
    }
  }
}
</script>
