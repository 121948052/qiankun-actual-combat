<template>
  <div class="panel-month">
    <slot>
      <date-maker showHtml v-model="monthDate" hideHeader :textTop="makerTop" :markDateMore="detailList" @choseDay="clickDay" />
    </slot>
  </div>
</template>

<script>
import DateMaker from './DateMaker'
export default {
  name: 'Month',
  components: {
    DateMaker
  },
  props: {
    nowDate: {
      type: [String, Date] // 2019/9/19
    },
    detailList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      monthDate: this.nowDate,
      makerTop: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    }
  },
  computed: {

  },
  watch: {
    nowDate (val) {
      this.monthDate = val
    }
  },
  methods: {
    clickDay (obj) {
      this.$emit('choseDay', obj)
    }
  }
}
</script>

<style scoped lang="less">
.panel-month {
  margin-top: 30px;
  /deep/ .has-border{
    min-height: 105px;
    .wh-item-date {
      flex-direction: column;
      justify-content: left;
      align-items: start;
      font-size: 12px;
      .date {
        font-size: 25px;
        font-weight:400;
      }
    }
    .wh-chose-day {
        border-bottom: 1px solid #F05656;
      }
    .active-day {
      color: #3377FF;
    }
  }
}
</style>
