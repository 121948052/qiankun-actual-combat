<template>
  <div class="panel-day">
    <!-- <article class="left-time-bar"  v-if="detailList.length > 0">
      <time-line v-model="activeTime" :detailArr="detailList" :lineHeight="160" :lastLineHeight="160" />
    </article>
    <slot>
      <ul class="right-day-detail">
        <li class="item-details" v-for="(item, i) in detailList" :key="i" @click="clickDetail(item)">
          <h5>{{item.taskName}}</h5>
          <p class="detail">{{item.taskDetail}}</p>
          <p class="detail"><Icon type="icon-time" />{{$moment(item.waitExecuteTime).format('MM月DD日 dddd HH:mm:ss')}}</p>
          <p class="detail"><Icon type="icon-message1" />{{item.waitExecuteTime}}</p> -->
          <!-- <p class="detail"><Icon type="icon-user" />
            <span>已接受 {{item.peoples.accepted}}</span>
            <span>已拒绝 {{item.peoples.rejected}}</span>
            <span>未响应 {{item.peoples.unresponsive}}</span>
            <span>组织人 {{item.peoples.organizingPeople}}</span>
            <span>全部 {{item.peoples.allPeople}}</span>
          </p> -->
        <!-- </li> -->
        <!-- <li v-if="detailList.length < 1">暂无数据</li> -->
        <!-- <li class="no-data" v-if="detailList.length < 1">
            <img src="./../../assets/images/emptyBg.png" alt="" />
            <p>这里什么也没有呢</p>
          </li> -->
      <!-- </ul> -->
    <!-- </slot> -->
    <ul class="card-wrap">
      <li class="card-item" v-for="(o, i) in detailList" :key="i">
        <div class="card-item-left">{{o.startTime | formatDate}}</div>
        <div :class="['card-item-right', {'oneColor': o.type === 'VISIT', 'twoColor': o.type === 'ACTIVI', 'threeColor': o.type === 'MEETING'}]">
          <div>
            <Icon :type="iconStr(o.type, i)"  size="16" :color="iconColor(o.type)" />
            <p class="message-title">{{o.topic}}</p>
          </div>
          <div>
            <Icon type="icon-shijian"  size="16"  :color="iconColor(o.type)" />
            <p>{{formatDateStr(o)}}</p>
          </div>
          <div>
            <Icon type="icon-didian"  size="16"  :color="iconColor(o.type)" />
            <p>{{o.address}}</p>
          </div>
          <div>
            <Icon type="icon-ren"  size="16"  :color="iconColor(o.type)" />
            <p>{{o.executorNames}}</p>
          </div>
          <!-- <div>
            <Icon type="icon-xiangqing"  size="16"  :color="iconColor(o.type)" />
            <p></p>
          </div> -->
        </div>
        <div class="operate-box">
          <Icon type="icon-edit" color="#fff"  @click="editSchedule(o)" />
          <Icon type="icon-delete" color="#fff" @click="delSchedule(o)"/>
        </div>
      </li>
      <li class="no-data" v-if="detailList.length < 1">
        <img src="./../../assets/images/emptyBg.png" alt="" />
        <p>这里什么也没有呢</p>
      </li>
    </ul>

  </div>
</template>

<script>
// import TimeLine from './TimeLine'
import { mapState } from 'vuex'
export default {
  name: 'Day',
  components: {
    // TimeLine
  },
  props: {
    detailList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      activeTime: '',
      list: [
        // {
        //   id: 'a24559a29a194b6a9b190a91dfc1498b',
        //   taskId: '4819dce21139404092dec16bb2c50281',
        //   taskName: '北体时代',
        //   taskDetail: '商谈合同',
        //   userId: '10108182',
        //   waitExecuteTime: '2019-12-16 09:00:00',
        //   scheduleType: '1',
        //   scheduleName: '拜访计划',
        //   executeCycleDay: 9,
        //   startTime: '2019-12-16 09:00:00'
        // },
        // {
        //   id: 'a24559a29a194b6a9b190a91dfc1498b',
        //   taskId: '4819dce21139404092dec16bb2c50281',
        //   taskName: '北体时代',
        //   taskDetail: '商谈合同',
        //   userId: '10108182',
        //   waitExecuteTime: '2019-12-16 09:00:00',
        //   scheduleType: '2',
        //   scheduleName: '拜访计划',
        //   executeCycleDay: 9,
        //   startTime: '2019-12-16 09:00:00'
        // },
        // {
        //   id: 'a24559a29a194b6a9b190a91dfc1498b',
        //   taskId: '4819dce21139404092dec16bb2c50281',
        //   taskName: '北体时代',
        //   taskDetail: '商谈合同',
        //   userId: '10108182',
        //   waitExecuteTime: '2019-12-16 09:00:00',
        //   scheduleType: '3',
        //   scheduleName: '拜访计划',
        //   executeCycleDay: 9,
        //   startTime: '2019-12-16 09:00:00'
        // }
      ]
    }
  },
  filters: {
    formatDate (val) {
      return val.split(' ')[1]
    }
  },
  computed: {
    ...mapState({
      tabList: ({ common }) => common.tabList
    })
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
  mounted () {
    console.log('detailList------------>', this.detailList)
  },
  methods: {
    PUSH_TAB_LIST (results) {
      this.GAIA_COM_MUTATIONS.PUSH_TAB_LIST(results)
    },
    iconColor (type) {
      let map = new Map([
        ['VISIT', '#EF9A21'],
        ['ACTIVI', '#8589FF'],
        ['MEETING', '#24ABE8']
      ])
      return map.get(type)
    },
    iconStr (type, index) {
      console.log(type)
      let strIcon = {
        VISIT: ['icon-baifang', 'icon-shijian', 'icon-didian', 'icon-ren', 'icon-xiangqing'],
        ACTIVI: ['icon-huodong', '', '', '', ''],
        MEETING: ['', '', '', '', '']
      }
      return strIcon[type][index]
    },
    clickDetail (item) {
      /* 如果是任务-> 跳转任务详情 */
      if (item.scheduleType === 'OFFICE_TASK') {
        this.activeTime = this.moment(item.startTime)
        this.$router.push({
          path: `/oa/platform/personal/missionDetail?groupId=${item.taskId}`,
          query: {
            groupId: item.taskId
          }
        })
        window.sessionStorage.setItem('currentTabName', '任务详情')
      /* 跳转-->拜访计划详情 */
      } else {
      }
      // const path = `/platform/personal/missionDetail?groupId=${item.taskId}`
    },
    moment (date) {
      return this.$moment(date).format('HH:mm')
    },
    // 编辑日程
    editSchedule (item) {
      this.$emit('on-edit', item)
    },
    // 删除日程
    delSchedule (item) {
      this.$emit('on-del', item)
    },
    // 格式日期
    formatDateStr (obj) {
      let weekList = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      let str1 = obj.startTime.split(' ')[0]
      let str2 = weekList[new Date(obj.startTime).getDay()]
      let str3 = obj.startTime.split(' ')[1]
      let str4 = obj.endTime.split(' ')[1]
      return `${str1} ${str2} ${str3} - ${str4}`
    }
  }
}
</script>

<style scoped lang="less">

.card-wrap {
  width: 100%;
  .card-item:hover .operate-box{
    animation: btn-box 0.5s forwards;
    // animation-fill-mode: forwards;
  }
  .card-item {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    margin-bottom: 24px;
    position: relative;
    &-left {
      width: 40px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      color: #B2C3D8;
      padding-top: 4px;
      font-weight: bold;
    }
    .oneColor  {
      border-left: solid 2px #EFD38C;
      background-color: #F9F5EB;
    }
    .oneColor:hover {
      background-color: #f7efde;
    }
    .twoColor  {
      border-left: solid 2px #9B9EF9;
      background-color: #f1f2fe;
    }
    .twoColor:hover  {
      background-color: #EBECFA;
    }
    .threeColor  {
      border-left: solid 2px #58B2DB;
      background-color: #EDF5F7;
    }
    .threeColor:hover  {
      background-color: #e5f3f8;
    }
    &-right {
      margin-left: 10px;
      padding: 0 30px 0 16px;
      flex: 1 1;
      padding-left: 18px;
      div {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        margin: 10px 0;
        & > i {
          margin-right: 10px;
        }
        p {
          font-size: 12px;
          color: #404040;
        }
        .message-title {
          font-size: 14px;
          color: #444444;
        }
      }
    }
    .operate-box {
      position: absolute;
      top: 16px;
      right: 16px;
      display: flex;
      justify-content: flex-start;
      opacity:  0;
      i {
        display: block;
        width: 34px;
        height: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius:4px;
      }
      i:nth-child(1) {
        background-color: #3377ff;
      }
      i:nth-child(2) {
        background-color: #E75F66;
        margin-left: 10px;
      }
    }
  }
  .no-data {
    width: 100%;
    height: 400px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    img {
      width: 200px;
      margin-bottom: 20px;
    }
  }
}

.form-footer {
  display: flex;
  justify-content: center;
}

@keyframes btn-box {
  0% {
      opacity: 0;
  }
  100% {
      opacity: 1;
  }
}
</style>
