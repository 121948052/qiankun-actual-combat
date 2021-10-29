<template>
  <ul class="line-wrap">
    <li :style="{height: firstLineHieght + 'px'}"></li>
    <li
      v-for="(line, i) in detailArr" :key="i"
      :style="{height: i !== detailArr.length - 1 ? lineHeight + 'px' : lastLineHeight + 'px'}"
      :class="['line', {'active-line': moment(line.startTime) === activeLine}]"
      @click="clickLine(line)">
     {{moment(line.startTime)}}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TimeLine',
  props: {
    value: {
      type: String
    },
    detailArr: {
      type: Array
    },
    lineHeight: {
      type: Number
    },
    firstLineHieght: {
      type: Number,
      default: 120
    },
    lastLineHeight: {
      type: Number
    }
  },
  data () {
    return {
      activeLine: this.value
    }
  },
  watch: {
    value (val) {
      this.activeLine = val
    }
  },
  methods: {
    clickLine (line) {
      this.activeLine = this.moment(line.startTime)
      this.$emit('input', this.activeLine)
    },
    moment (date) {
      return this.$moment(date).format('HH:mm')
    }
  }
}
</script>

<style scoped lang="less">
.line-wrap {
  border-right: 1px solid #8F9BB3;
  margin-right: 30px;
  .line {
    cursor: pointer;
    color: #8F9BB3;
    position: relative;
  }
  .line::before {
    content: '';
    position: absolute;
    right: -11px;
    width: 9px;
    height: 9px;
    border: 6px solid #8F9BB3;
    border-radius: 50%;
    background: #fff;
    box-shadow:0px 0px 8px 2px rgba(51,153,255,0.5);
  }
  .active-line {
    color: #3377FF;
  }
  .active-line::before {
    border-color: #3377FF;
  }
}
</style>
