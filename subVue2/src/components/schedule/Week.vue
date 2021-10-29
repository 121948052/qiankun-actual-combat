<template>
  <div class="panel-week">
    <article class="left-time-bar">
      <time-line  v-if="detailList.length > 0" v-model="activeTime" :detailArr="detailList" :lineHeight="112" :firstLineHieght="152" />
    </article>
    <slot>
      <div class="right-week-detail">
        <ul class="detail">
          <li class="header has-line" v-if="detailList.length > 0">
            <span v-for="(item, i) in weekList" :key="i" :class="['item', {holiday: i > 4}]">{{item}}</span>
          </li>
          <li :class="['main', 'has-line', {active: activeTime === moment(detail.startTime)}]" v-for="(detail, index) in detailList" :key="index">
            <span
              v-html="countInner(detail, i)"
              v-for="i in 7" :key="i"
              :class="['item', {'holiday': i > 5, 'has-inner': countInner(detail, i) !== '', 'now-day': i === nowDay}]"
              @click="clickDetail(detail, $event)">
            </span>
          </li>
          <!-- <li class="no-data" v-if="detailList.length < 1">暂无数据</li> -->
          <li class="no-data" v-if="detailList.length < 1">
            <img src="./../../assets/images/emptyBg.png" alt="" />
            <p>这里什么也没有呢</p>
          </li>

        </ul>
      </div>
    </slot>
    <Model class="model" v-model="showDetail" title="任务详情">
      <h5 class="title">{{detailModel.taskName}}</h5>
      <ul class="wrap">
        <li class="item">
          <div>
            开始时间：
          </div>
          <div>{{detailModel.taskStartTime}}</div>
        </li>
        <!-- <li class="item">
          <div>
            任务地址：
          </div>
          <div>{{detailModel.taskName}}</div>
        </li> -->
        <li class="item">
          <div>
            任务描述：
          </div>
          <div>{{detailModel.taskDetail}}</div>
        </li>
        <!--<li class="item to-detail" @click="toDetail">查看详情</li>-->
        <!-- <li class="item">
          <div>
            参与人员：
          </div>
          <div>{{detailModel.taskName}}</div>
        </li> -->
      </ul>
    </Model>
  </div>
</template>

<script>
import TimeLine from './TimeLine'
// import { mapState } from 'vuex'
export default {
  /**
   * 1. 对返回数据做处理,计算max min
   * 2. 从min开始渲染数据
   * 3. min每一格对应该时间段（代表固定时间间隔，如2小时一格），周几（1 - 7）有无行程。
   * 4. 每一格可带参进行跳转行程详情页面
   */
  name: 'Week',
  components: {
    TimeLine
  },
  props: {
    detailList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      showDetail: false,
      activeTime: '', // 活跃数据轴
      weekList: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
      detailModel: {
        taskName: '',
        taskStartTime: '',
        taskDetail: ''
      }
    }
  },
  computed: {
    pageTableHeight () {
      return this.$GAIA_STORE.GAIA_STATE.pageTableHeight
    },
    modelTableHeight () {
      return this.$GAIA_STORE.GAIA_STATE.modelTableHeight
    },
    tabList () {
      return this.$GAIA_STORE.GAIA_STATE.tabList
    },
    nowDay () {
      return new Date().getDay()
    }
  },
  watch: {
    detailList: {
      deep: true,
      handler: function (val) {
        if (this.activeTime === '' && val.length > 0) {
          this.activeTime = this.moment(val[0].startTime)
        }
      }
    }
  },
  methods: {
    SET_TAB_LIST (results) {
      this.GAIA_COM_MUTATIONS.SET_TAB_LIST(results)
    },
    PUSH_TAB_LIST (results) {
      this.GAIA_COM_MUTATIONS.PUSH_TAB_LIST(results)
    },
    countInner (obj, index) {
      let result = ''
      for (let i = 0; i < obj.task.length; i++) {
        if (new Date(obj.task[i].waitExecuteTime).getDay() === index) {
          result += `<p index="${i}">${this.$moment(obj.task[i].waitExecuteTime).format('HH:mm')} ${obj.task[i].taskDetail}</p>`
        }
      }
      return result
    },
    moment (date) {
      return this.$moment(date).format('HH:mm')
    },
    clickDetail (obj, event) {
      this.showDetail = true
      const index = event.target.getAttribute('index')
      this.detailModel = obj.task[index]
    },
    toDetail () {
      const path = `/oa/platform/personal/missionDetail?groupId=${this.detailModel.taskId}`
      this.activeTime = this.moment(this.detailModel.startTime)
      const result = this.tabList.some(tab => tab.name === path)
      if (!result) {
        this.PUSH_TAB_LIST({
          label: '任务详情',
          name: path,
          path: path,
          closed: true
        })
      }
      this.$router.push({
        path: path,
        query: {
          groupId: this.detailModel.taskId
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.panel-week {
  margin-top: 30px;
  display: flex;
  .left-time-bar {
    width: 100px;
  }
  .right-week-detail {
    flex: 1;
    .detail {
      .has-line {
        display: flex;
        border-bottom: 1px solid #EBEEF5;
      }
      .has-line::before {
        content: '';
        position: absolute;
        left: -20px;
        bottom: -1px;
        width: 20px;
        height: 1px;
        background: #EBEEF5;
      }
      .active {
        border-color: #3399FF;
      }
      .active::before {
        background: #3377FF;
      }
      .item {
        border-top: 1px solid #fff;
        border-right: 1px solid #fff;
      }
      .header {
        .item {
          width: 14.28%;
          padding: 14px 0;
          text-align: center;
          background: #F8F8F8;
        }
        .holiday {
          background: #E6F7DD;
        }
      }
      .main {
        position: relative;
        cursor: pointer;
        .item {
          width: 14.28%;
          height: 90px;
          padding: 10px;
          overflow-y: auto;
          p {
            white-space: nowrap;
            width: 100%;
            text-overflow: ellipsis;
            word-break: keep-all;
            overflow: hidden;
          }
        }
        .now-day {
          background: #F8F8F8;
        }
        .holiday {
          background: #E6F7DD;
        }
        .has-inner {
          color: #3377FF;
          background:rgba(217,236,255,1);
          opacity:0.5;
        }
      }
      .no-data {
        width: 100%;
        height: 200px;
        // padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-top: 100px;
        & > img {
          width: 200px;
        }
        & > p {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }
      }
    }
  }
  .model {
    .title {
      margin-left: 20px;
      font-size: 16px;
    }
    .item {
      display: flex;
      padding: 10px 0;
      max-height: 150px;
      overflow-y: auto;
    }
    .to-detail {
      cursor: pointer;
      color: #3377FF;
    }
  }
}
</style>
