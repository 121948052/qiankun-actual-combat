<template>
  <section class="wh-container">
    <div class="wh-content-all">
      <div class="wh-top-changge wh-header" v-show="!hideHeader">
        <li @click="preMonth(myDate,false)">
          <Icon class="active-ele" type="icon-left-bracket" />
        </li>
        <li class="wh-content-li">{{dateTop}}</li>
        <li @click="nextMonth(myDate,false)">
          <Icon class="active-ele" type="icon-right-bracket" />
        </li>
      </div>
      <div class="wh-content wh-header">
        <div class="wh-content-item top-content" v-for="(tag, i) in textTop" :key="i">
          <div class="wh-top-tag">{{tag}}</div>
        </div>
      </div>
      <div class="wh-content">
        <div :class="['wh-content-item', 'has-border', {holiday: (index + 1) % 7 === 0 || (index + 2) % 7 === 0}]" v-for="(item,index) in list" :key="index" @click="clickDay(item)">
          <div
            :class="['wh-item-date', setClass(item)]">
            <span class="date">{{item.id}}</span>
            <p v-show="showHtml" v-html="item.html"></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import timeUtil from './calendar'
export default {
  name: 'DateMaker',
  props: {
    value: {
      type: [Date, String] // 2019/9/19 || 2019/09/19
    },
    hideHeader: {
      type: Boolean
    },
    // 复杂标记 [{date:'2018/4/1',className:"mark1", html: ''}] className可以外部自定
    markDateMore: {
      type: Array,
      default: () => []
    },
    textTop: {
      type: Array,
      default: () => ['一', '二', '三', '四', '五', '六', '日']
    },
    // 是否是周日开头
    sundayStart: {
      type: Boolean,
      default: () => false
    },
    agoDayHide: {
      type: String,
      default: `0`
    },
    futureDayHide: {
      type: String,
      default: `2554387200`
    },
    showHtml: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      myDate: [],
      list: [],
      historyChose: [],
      dateTop: ''
    }
  },
  watch: {
    value: {
      handler (newVal, oldVal) {
        this.myDate = newVal
        // if (oldVal.getTime() !== newVal.getTime()) {
        //   this.getList(this.myDate, false, false, true)
        // }
      },
      deep: true
    },
    markDateMore: {
      handler (val, oldVal) {
        this.getList(this.myDate)
      },
      deep: true
    },
    agoDayHide: {
      handler (val, oldVal) {
        this.getList(this.myDate)
      },
      deep: true
    },
    futureDayHide: {
      handler (val, oldVal) {
        this.getList(this.myDate)
      },
      deep: true
    },
    sundayStart: {
      handler (val, oldVal) {
        this.intStart()
        this.getList(this.myDate)
      },
      deep: true
    }
  },
  created () {
    this.intStart()
    let date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    this.myDate = this.value || date
  },
  mounted () {
    this.getList(this.myDate, false, false, true)
  },
  methods: {
    intStart () {
      timeUtil.sundayStart = this.sundayStart
    },
    setClass (item) {
      let obj = {
        'wh-other-dayhide': item.otherMonth !== 'nowMonth',
        'wh-want-dayhide': item.dayHide,
        'wh-isToday': item.isToday,
        'wh-chose-day': item.chooseDay
      }
      obj[item.markClassName] = item.markClassName
      return obj
    },
    clickDay (item) {
      this.$emit('choseDay', item)
      if (item.otherMonth === 'nowMonth' && !item.dayHide) {
        this.getList(this.myDate, item.date)
      }
      if (item.otherMonth !== 'nowMonth') {
        item.otherMonth === 'preMonth'
          ? this.preMonth(item.date)
          : this.nextMonth(item.date)
      }
    },
    choseMonth (date, isChosedDay = true) {
      date = timeUtil.dateFormat(date)
      this.myDate = new Date(date)
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate))
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay)
      } else {
        this.getList(this.myDate)
      }
    },
    preMonth (date, isChosedDay = true) {
      date = timeUtil.dateFormat(date)
      this.myDate = timeUtil.getOtherMonth(this.myDate, 'preMonth')
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate))
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay)
      } else {
        this.getList(this.myDate)
      }
    },
    nextMonth (date, isChosedDay = true) {
      date = timeUtil.dateFormat(date)
      this.myDate = timeUtil.getOtherMonth(this.myDate, 'nextMonth')
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate))
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay)
      } else {
        this.getList(this.myDate)
      }
    },
    forMatArgs () {
      let markDateMore = this.markDateMore
      markDateMore = markDateMore.map(k => {
        k.date = timeUtil.dateFormat(k.date)
        return k
      })
      return markDateMore
    },
    getList (date, chooseDay, isChosedDay = true, checkDate) {
      date = new Date(date)
      const markDateMore = this.forMatArgs()
      this.dateTop = this.$moment(date).format('YYYY MM')
      let arr = timeUtil.getMonthList(this.myDate)
      for (let i = 0; i < arr.length; i++) {
        let className = ''
        let html = ''
        let k = arr[i]
        k.chooseDay = false
        const nowTime = k.date
        const t = new Date(nowTime).getTime() / 1000
        // 看每一天的class
        for (const c of markDateMore) {
          if (c.date === nowTime) {
            className = c.className || ''
            html = c.html || ''
          }
        }
        // 标记选中某些天 设置class
        k.markClassName = className
        k.html = html
        // 无法选中某天
        k.dayHide = t < this.agoDayHide || t > this.futureDayHide
        // if (k.isToday) {
        //   this.$emit('isToday', nowTime)
        // }
        let flag = !k.dayHide && k.otherMonth === 'nowMonth'
        if ((chooseDay && chooseDay === nowTime && flag) || (nowTime === this.$moment(date).format('YYYY/M/D') && checkDate)) {
          let date = new Date(nowTime)
          this.$emit('input', date)
          this.historyChose.push(nowTime)
          k.chooseDay = true
        } else if (
          this.historyChose[this.historyChose.length - 1] === nowTime &&
          !chooseDay && flag && !checkDate
        ) {
          k.chooseDay = true
        }
      }
      this.list = arr
    }
  }
}
</script>
<style scoped>
.wh-container {
  font-family: 'schedule';
  margin: auto;
}

li {
  list-style-type: none;
}
.wh-top-changge {
  display: flex;
  padding: 10px 0;
}

.wh-top-changge li {
  cursor: pointer;
  display: flex;
  color: #303133;
  font-size: 14px;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 47px;
}

.wh-top-changge .wh-content-li {
  cursor: auto;
  flex: 4;
  color: #2C3135;
  font-size: 20px;
  font-weight: bold;
}

.wh-content-all {
  width: 100%;
  overflow: hidden;
  padding-bottom: 8px;
}

.wh-content {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.wh-content:first-child .wh-content-item-tag,
.wh-content:first-child .wh-content-item {
  color: #ddd;
  font-size: 16px;
}

.wh-content-item,
.wh-content-item-tag {
  cursor: pointer;
  width: 14.28%;
  height: 36px;
  color: #303133;
}

.has-border {
  border-top: 1px solid #fff;
  border-right: 1px solid #fff;
}

.top-content {
  height: 40px;
}

.wh-top-tag {
  line-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wh-item-date {
  /* padding: 5px 10px 0 10px; */
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: #F5F5F5; */
}
.wh-item-date p {
  width: 100%;
  word-break: keep-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}

.active-ele {
  font-size: 18px;
  color: #C0C4CC;
}

.active-ele:hover{
  color: #3377FF;
}

.wh-content-item .wh-other-dayhide, .wh-content-item .wh-want-dayhide {
  color: #909399;
  opacity: .5;
}

/* .holiday .wh-item-date{
  background: #E6F7DD;
} */

.holiday .wh-other-dayhide, .holiday .wh-want-dayhide {
  /* background: #E6F7DD; */
  opacity: .5;
}

/* .wh-header {
  background: #F5F5F5;
} */

.wh-content-item .wh-chose-day {
  background:#E5F2FF;
  color: #3377FF;
}
.active-day {
  position: relative;
}
.active-day::before {
  position: absolute;
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #3377ff;
  top: 5px;
  left: 5px;
}
.wh-content-item .wh-isToday::before {
  background:#FF5340;
}
</style>
