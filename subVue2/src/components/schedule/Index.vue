<template>
  <Layout class="schedule-wrap">
    <Article class="left-panel">
      <!-- <Header class="left-header" style="height: auto">
        <div class="headerCreate">
          <h5 class="header-title">我的日程</h5>
          <Button type="primary" @click="createPlan" icon="icon-Launch" v-if="showCreate">新建拜访计划</Button>
        </div>
        <Button type="primary" @click="goTask" class="icon-btn" icon="icon-Launch">新建任务</Button>
        <Button type="primary" @click="goMail" class="mail-btn">通讯录</Button>
      </Header> -->
      <Content class="left-main">
        <date-maker  v-model="nowDate" :markDateMore="monthList" @choseDay="choseDay"  />
      </Content>
      <div class="btn-box">
        <Button @click="newTask('S')" icon="icon-add">我的日程</Button>
        <Button @click="newTask('O')" icon="icon-add" v-has="{path: $route.path, target: 'otherSchedule'}">他人日程</Button>
        <Button @click="goMail" icon="icon-tongxunlu">通讯录</Button>
      </div>
      <!-- 日程类型 4期取消 -->
      <!-- <Footer class="left-footer">
        <h5>日程类型</h5>
        <ul class="source-type chose-box">
          <li>
            <CheckboxGroup v-model="sourceType" @on-change="sourceTypeChange">
              <Checkbox label="VISIT">拜访</Checkbox>
              <Checkbox label="ACTIVI">活动</Checkbox>
              <Checkbox label="MEETING">会议</Checkbox>
            </CheckboxGroup>
          </li>
        </ul>
      </Footer> -->
      <Footer class="left-footer">
        <h5>日程来源</h5>
        <ul class="source-wrap chose-box">
          <li>
            <RadioGroup v-model="sourceFrom" vertical @on-change="soureFromChange">
              <Radio label="myself">自己</Radio>
              <Radio label="other">他人</Radio>
            </RadioGroup>
          </li>
        </ul>
      </Footer>
    </Article>
    <Layout class="right-panel">
      <Header class="right-header">
        <div class="current-date">
          <Icon type="icon-date" size="20" />
          <span>{{currentDate}}</span>
        </div>
        <!-- <div class="current-date" v-if="activePanel === 'Week'">
          {{currentWeek}}
        </div>
        <div class="current-date" v-if="activePanel === 'Month'">
          {{currentDate}}
        </div>
        <ul class="date-list">
          <li v-for="(panel, i) in panelList" :key="i" :class="{active: panel.value === activePanel}" @click="changePanel(panel)">
            {{panel.title}}
          </li>
        </ul> -->
      </Header>
      <Content>
        <!-- compoent模式仅支持一种slot -->
        <!-- <component :is="activePanel">
          <slot name="day-detail"></slot>
        </component> -->
        <!-- 后续考虑使用v-for，对比时间变化再去请求接口 -->
        <Day v-if="activePanel === 'Day'" :detailList="dayList" @on-edit="editDay" @on-del="delSchedules">
          <slot name="day-detail"></slot>
        </Day>
        <!-- <Week v-else-if="activePanel === 'Week'" :detailList="weekList">
          <slot name="week-detail" :detailList="monthList"></slot>
        </Week>
        <Month v-else :detailList="monthList" :nowDate="nowDate" @choseDay="changeDate" >
          <slot name="month-detail"></slot>
        </Month> -->
        <Loading size="30" class="loading-wrap"  v-model="isLoading" />
      </Content>
    </Layout>

    <!-- Model 日程新建和编辑 -->
    <Model :title="`${title}日程`"
      width="700px"
      v-model="isModelSchedule">
      <Form :model="scheduleForm"
            ref="scheduleForm"
            :rules="scheduleFormRules"
            :labelWidth="100">
        <form-item label="日程所属人：" prop="executors" v-if="isOther">
          <Select v-model="scheduleForm.executors"
              filterable
              label-in-value
              style="width:300px;"
              @on-change="executorChange">
            <Option v-for="(o, i) in nominatorData"
              :key="i"
              :value="o.emplId"
              :label="o.emplId+' / '+o.lastName"/>
          </Select>
        </form-item>
        <form-item label="日程类型：" prop="type">
          <RadioGroup v-model="scheduleForm.type">
            <Radio label="ACTIVI" >活动</Radio>
            <!-- 目前只能新建活动,后期添加会议和拜访 -->
            <!-- <Radio label="MEETING" >会议</Radio>
            <Radio label="VISIT" >拜访</Radio> -->
          </RadioGroup>
        </form-item>

        <form-item label="主题：" prop="topic">
          <Input v-model="scheduleForm.topic"
                placeholder="请选择主题"/>
        </form-item>
        <form-item label="时间：" prop="timeDate">
           <DatePicker
            class="margin-right-10"
            type="date"
            style="width:120px"
            v-model="scheduleForm.startDate"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            @on-change="joinTime"
          ></DatePicker>-
          <TimePicker
            class="margin-right-10 margin-left-10"
            type="time"
            style="width:80px"
            v-model="scheduleForm.startTime"
            placeholder="时间"
            format="HH:mm"
            @on-change="joinTime"
          ></TimePicker>~
          <DatePicker
            class="margin-right-10 margin-left-10"
            type="date"
            style="width:120px"
            v-model="scheduleForm.endDate"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            @on-change="joinTime"
          ></DatePicker>-
          <TimePicker
            class="margin-left-10"
            type="time"
            style="width:80px"
            v-model="scheduleForm.endTime"
            placeholder="时间"
            format="HH:mm"
            @on-change="joinTime"
          ></TimePicker>
        </form-item>
        <form-item label="地点：" prop="address">
          <Input v-model="scheduleForm.address"
                placeholder="请输入地点"/>
        </form-item>
        <form-item label="参与人：" prop="executors" v-if="scheduleForm.type === 'MEETING'">
          <Select v-model="scheduleForm.executors"
              filterable
              multiple
              label-in-value
              style="width:300px;"
              @on-change="executorChange">
            <Option v-for="(o, i) in nominatorData"
              :key="i"
              :value="o.emplId"
              :label="o.emplId+' / '+o.lastName"/>
          </Select>
        </form-item>
        <form-item label="抄送人：" prop="invitees" v-if="scheduleForm.type === 'MEETING'">
          <Select v-model="scheduleForm.invitees"
              filterable
              multiple
              label-in-value
              style="width:300px;"
              @on-change="executorChange">
            <Option v-for="(o, i) in nominatorData"
              :key="i"
              :value="o.emplId"
              :label="o.emplId+' / '+o.lastName"/>
          </Select>
        </form-item>
        <form-item label="提醒：" prop="remindTime">
          <RadioGroup class="mb-15" type="button" v-model="scheduleForm.remindTime">
            <Radio label="0">无</Radio>
            <Radio label="15">15分钟前</Radio>
            <Radio label="30">30分钟前</Radio>
            <Radio label="60">1小时前</Radio>
            <Radio label="1440">24小时前</Radio>
          </RadioGroup>
        </form-item>
        <form-item label="提醒方式：" prop="method">
          <CheckboxGroup v-model="scheduleForm.method">
            <Checkbox label="ORDINARYSEND" >消息</Checkbox>
            <Checkbox label="EMAIL" >邮件</Checkbox>
          </CheckboxGroup>
        </form-item>
        <form-item label="重复：" prop="rate" v-if="scheduleForm.type !== 'MEETING'">
          <RadioGroup v-model="scheduleForm.rate">
            <Radio label="1" >从不重复</Radio>
            <Radio label="2" >工作日（周一至周五）</Radio>
            <Radio label="3" >每天</Radio>
          </RadioGroup>
        </form-item>
      </Form>
      <template v-slot:footer>
        <div class="form-footer">
          <Button @click="scheduleOK" type="primary" style="margin:10px">确定</Button>
          <Button @click="scheduleNO" style="margin:10px">取消</Button>
        </div>
      </template>
    </Model>

    <!-- Model 删除日程 -->
    <Model title="删除日程" v-model="isDelSchedule">
      <div>确定要删除日程吗？</div>
      <template v-slot:footer>
        <div class="form-footer">
          <Button @click="delOK" type="primary" style="margin:10px">确定</Button>
          <Button @click="delNO" style="margin:10px">取消</Button>
        </div>
      </template>
    </Model>
  </Layout>
</template>

<script>
/**
 * 日程组件
 * 1. 可新建日程
 * 2. 日、月、年查看日程详情
 * 3. 定义数据格式,根据时间查日、周、月日程
 */
import Day from './Day'
// import Week from './Week'
// import Month from './Month'
import DateMaker from './DateMaker'
import { mapActions } from 'vuex'

function bubbleSort (arr) {
  if (Array.isArray(arr)) {
    for (let i = arr.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (new Date(arr[j].startTime).getTime() > new Date(arr[j + 1].startTime).getTime()) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        }
      }
    }
    return arr
  }
}
export default {
  name: 'Schedule',
  components: {
    Day,
    // Week,
    // Month,
    DateMaker
  },
  props: {
    // 选中日期
    curentDate: {
      type: Date,
      default: function () {
        let date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)
        return date
      }
    },
    goTask: {
      type: Function,
      default: function () {
        console.log('别点我 go task')
        // this.$router.push({
        //   path: '/platform/operation/mission',
        //   query: {}
        // })
      }
    },
    createPlan: {
      type: Function,
      default: function () {}
    },
    showCreate: {
      type: Boolean,
      default: false
    },
    goMail: {
      type: Function,
      default: function () {
        // console.log('别点我 to mail')
        this.$router.push({
          path: '/oa/platform/operation/addressBook',
          query: {}
        })
      }
    },
    getDayDetail: {
      required: true,
      type: Function
    },
    getWeekDetail: {
      required: true,
      type: Function
    },
    getMonthDetail: {
      required: true,
      type: Function
    }
  },
  data () {
    let _this = this
    const validatorTimeDate = (rule, value, callback) => {
      let t1 = new Date(_this.scheduleForm.timeDate.split(',')[0]).getTime()
      let t2 = new Date(_this.scheduleForm.timeDate.split(',')[1]).getTime()
      let t3 = new Date().getTime()
      if (_this.scheduleForm.timeDate === '' || _this.scheduleForm.timeDate.length < 33) {
        callback(new Error('请输入开始或者结束时间'))
        return
      }
      if (t1 < t3) {
        callback(new Error('开始时间不能小于当前时间'))
        return
      }
      if (t2 < t3) {
        callback(new Error('结束时间不能小于当前时间'))
        return
      }
      if (t1 > t2) {
        callback(new Error('结束时间不能小于开始时间'))
        return
      }
      callback()
    }
    return {
      nowDate: this.curentDate,
      sourceType: ['ACTIVI', 'MEETING', 'VISIT'],
      sourceFrom: 'myself',
      title: '新建',
      isOther: false,
      isModelSchedule: false,
      nominatorData: [],
      scheduleForm: {
        executors: '',
        type: 'ACTIVI',
        topic: '',
        timeDate: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        address: '',
        remindTime: '0',
        method: ['ORDINARYSEND'],
        rate: '1',
        invitees: []
      },
      executorNames: '',
      scheduleFormRules: {
        executors: [
          { required: true, message: '请选择指定参与人' }
        ],
        type: [
          { required: true, message: '请选择日程类型' }
        ],
        topic: [
          { required: true, message: '请输入主题' }
        ],
        timeDate: [
          { required: true, validator: validatorTimeDate, trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入地点' }
        ],
        remindTime: [
          { required: true, message: '请选择提醒周期' }
        ],
        method: [{ required: true, message: '请选择提醒方式' }],
        rate: [{ required: true, message: '请选择重复方式' }]
      },
      currentRow: {},
      isDelSchedule: false,
      // -------------------
      isLoading: true,
      panelList: [
        //  智慧办公4期，取消，后续可能还会需要
        // {
        //   title: '今天',
        //   value: 'Day'
        // },
        // {
        //   title: '本周',
        //   value: 'Week'
        // },
        // {
        //   title: '本月',
        //   value: 'Month'
        // }
      ],
      schedule: {
        source: [
          // {
          //   state: 'now', // now 、 before、after
          //   description: '拜访计划'
          // },
          {
            state: 'now', // now 、 before、after
            description: '标准任务'
          }
        ] // 来源
      },
      activePanel: 'Day',
      dayList: [],
      weekList: [],
      monthList: [],
      isEdit: false,
      textTop: ['日', '一', '二', '三', '四', '五', '六']
    }
  },
  computed: {
    currentWeek () {
      return `${this.$moment(this.nowDate).format('YYYY年MM月')} 第${this.getMonthWeek(this.nowDate)}周`
    },
    currentDate () {
      return this.$moment(this.nowDate).format('YYYY-MM-DD')
    }
  },
  watch: {
    curentDate (val) {
      this.nowDate = val
    },
    nowDate (newVal, oldVal) {
      if (oldVal !== newVal) {
        let result = new Date(newVal).getMonth() === oldVal.getMonth()
        this.getData({ isNowMonth: result })
      }
    }
  },
  created () {
    this.getMonthDetail({ date: this.nowDate, createType: 'myself' }).then(res => {
      this.getFormatMonthList(res)
    })
    this.getNominatorList()
  },
  methods: {
    ...mapActions(['getEmployeeLists', 'saveSchedules', 'updateSchedules', 'deleteSchedules']),
    getMonthWeek (_date) {
      const date = new Date(_date.getFullYear(), _date.getMonth() - 1, _date.getDate())
      let day = date.getDay()
      let time = date.getDate()
      return Math.ceil((time + 6 - day) / 7)
    },
    changeDate (date) {
      this.$emit('check-day', date)
    },
    changePanel (panel) {
      this.activePanel = panel.value
      this.getData({})
    },
    // 格式化月份格式
    getFormatMonthList (item) {
      item.data.forEach(d => {
        let date = this.$moment(d.waitExecuteTime).format('YYYY/MM/DD')
        let index = -1
        for (let i = 0; i < this.monthList.length; i++) {
          if (this.monthList[i].date === date) {
            index = i
            break
          }
        }
        if (index < 0) {
          this.monthList.push({
            date: date,
            className: 'active-day',
            html: `${this.$moment(d.waitExecuteTime).format('HH:mm')} ${d.taskDetail}`,
            num: 0
          })
        } else {
          let obj = this.monthList[index]
          obj.num = obj.num + 1
          obj.html = `${obj.num + 1}条待办事项`
        }
      })
      // this.monthList = item.data.map(d => {
      //   return {
      //     date: this.$moment(d.waitExecuteTime).format('YYYY/MM/DD'),
      //     className: 'active-day',
      //     html: this.$moment(d.waitExecuteTime).format('HH:mm') + ' ' + d.taskDetail
      //   }
      // })
    },
    getData ({ isNowMonth = true, date = this.nowDate, createType = this.sourceFrom }) {
      console.log('getDetails-------------', this.sourceFrom)
      // 如果改变时间是在一个月的之内，就不去重复请求月数据接口
      if (this.activePanel === 'Day') {
        this.isLoading = true
        // createType: 'myself' -> 自己  'other'-> 他人
        this.getDayDetail({ date, createType })
          .then(res => {
            // this.dayList = res.data
            this.dayList = res.data.filter(k => this.sourceType.includes(k.type))

            // this.dayList = res.data.map(d => {
            //   return {
            //     ...d,
            //     startTime: d.waitExecuteTime
            //   }
            // })
          })
          .finally(() => {
            this.isLoading = false
          })
        // if (!isNowMonth) {
        //   this.getMonthDetail(this.nowDate)
        //     .then(res => {
        //       this.getFormatMonthList(res)
        //     })
        //     .finally(() => {
        //       this.isLoading = false
        //     })
        // }
      } else if (this.activePanel === 'Week') {
        this.isLoading = true
        this.getWeekDetail(this.nowDate)
          .then(res => {
            res.data.forEach(d => {})
            let result = bubbleSort(res.data)
            this.weekList = result
          })
          .finally(() => {
            this.isLoading = false
          })
        // if (!isNowMonth) {
        //   this.getMonthDetail(this.nowDate)
        //     .then(res => {
        //       this.getFormatMonthList(res)
        //     })
        //     .finally(() => {
        //       this.isLoading = false
        //     })
        // }
      }
      // else if (!isNowMonth) {
      //   this.isLoading = true
      //   this.getMonthDetail(this.nowDate)
      //     .then(res => {
      //       this.getFormatMonthList(res)
      //     })
      //     .finally(() => {
      //       this.isLoading = false
      //     })
      // }
    },
    // ---------------------------------------
    // 获取指定人列表
    getNominatorList () {
      this.getEmployeeLists({ haveAccount: true }).then(resp => {
        console.log('指定人----》', resp)
        this.nominatorData = resp.data
      })
    },
    executorChange (val) {
      console.log(val)
      // let list = []
      // val.forEach(o => {
      //   list.push(o.label.split(' / ')[1])
      // })
      // this.executorNames = list.join(',')
      this.executorNames = val.label.split(' / ')[1]
    },
    // 选择日程对应日期
    choseDay (item) {
      console.log('index-->', item.date)
      this.nowDate = item.date
    },
    // 日程类型切换
    sourceTypeChange (val) {
      console.log(val)
      this.getData({})
    },
    // 日程来源切换
    soureFromChange (val) {
      console.log(val)
      this.getData({ createType: val })
    },
    // 新建日程
    newTask (type) {
      if (type === 'S') {
        this.isOther = false
      } else {
        this.isOther = true
      }
      this.title = '新建'
      this.isEdit = false
      this.isModelSchedule = true
    },
    // 编辑日程
    editDay (item) {
      this.currentRow = item
      this.scheduleForm = {
        executors: item.executors.split(','),
        type: item.type,
        topic: item.topic,
        timeDate: `${item.startTime},${item.endTime}`,
        startDate: item.startTime.split(' ')[0],
        endDate: item.endTime.split(' ')[0],
        startTime: item.startTime.split(' ')[1],
        endTime: item.endTime.split(' ')[1],
        address: item.address,
        remindTime: item.remindTime,
        method: item.method.split(','),
        rate: '' + item.rate
      }
      console.log('编辑---->', item)
      this.title = '编辑'
      this.isEdit = true
      this.isModelSchedule = true
    },
    // 编辑和新建日程 确定
    scheduleOK () {
      this.$refs.scheduleForm.validate(val => {
        if (!val) { return }
        let opts = {
          address: this.scheduleForm.address,
          startTime: this.scheduleForm.timeDate.split(',')[0],
          endTime: this.scheduleForm.timeDate.split(',')[1],
          executorNames: this.executorNames,
          executors: this.scheduleForm.executors,
          method: this.scheduleForm.method.join(','),
          rate: this.scheduleForm.rate,
          remindTime: this.scheduleForm.remindTime,
          topic: this.scheduleForm.topic
        }
        if (this.isEdit) {
          // opts.invitees = ''
          opts.id = this.currentRow.id
          this.updateSchedules(opts).then(res => {
            this.$refs.scheduleForm.resetFields()
            //  清空时间输入框
            this.scheduleForm = { ...this.scheduleForm,
              ...{ timeDate: '',
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '' } }
            this.isModelSchedule = false
            this.$message({ type: 'success', message: '操作成功' })
            this.getData({})
          })
        } else {
          opts.type = this.scheduleForm.type
          this.saveSchedules({ ...opts }).then(res => {
            this.$refs.scheduleForm.resetFields()
            //  清空时间输入框
            this.scheduleForm = { ...this.scheduleForm,
              ...{ timeDate: '',
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '' } }
            this.isModelSchedule = false
            this.$message({ type: 'success', message: '操作成功' })
            this.getMonthDetail({ date: this.nowDate, createType: 'myself' }).then(res => {
              this.getFormatMonthList(res)
            })
            this.getData({})
          })
        }
      })
    },
    scheduleNO () {
      this.isModelSchedule = false
      this.$refs.scheduleForm.resetFields()
      this.scheduleForm = {
        ...this.scheduleForm,
        ...{ timeDate: '',
          startDate: '',
          endDate: '',
          startTime: '',
          endTime: '' }
      }
    },
    // 删除日程
    delSchedules (item) {
      this.currentRow = item
      this.isDelSchedule = true
    },
    delOK () {
      this.deleteSchedules({ ids: [this.currentRow.id] }).then(res => {
        this.isDelSchedule = false
        this.$message({ type: 'success', message: this.$t('home.deleteSuccessfully') })
        this.getMonthDetail({ date: this.nowDate, createType: 'myself' }).then(res => {
          this.getFormatMonthList(res)
        })
        this.getData({})
      })
    },
    delNO () {
      this.isDelSchedule = false
    },
    formatTime (sd, st) {
      let str = sd ? this.$moment(sd).format('YYYY-MM-DD') : ''
      return str + ' ' + st
    },
    joinTime () {
      let start = this.formatTime(this.scheduleForm.startDate, this.scheduleForm.startTime)
      let end = this.formatTime(this.scheduleForm.endDate, this.scheduleForm.endTime)
      this.scheduleForm.timeDate = start + ',' + end
    }
  }
}
</script>

<style scoped lang="less">
// checkbox 样式
.label-box (@num, @color) {
  & > label:nth-child(@{num}) {
      color: @color;
    .sh-checkbox {
      .sh-checkbox-inner {
        border-color: @color;
      }
    }
    .sh-checkbox-checked {
      .sh-checkbox-inner {
        background-color: @color;
      }
    }
  }
}

.schedule-wrap {
  height: 100%;
  display: flex;
  justify-content: flex-end;
  /deep/.left-panel {
    // height: 100%;
    border-right: solid 1px #E9F1FC;
    background: #fff;
    padding: 20px;
    flex: 0 0 350px;
    // width: 350px;
    // box-shadow: 0px 0px 15px rgba(0,0,0,.1);
    .btn-box {
      display: flex;
      justify-content: space-around;
      .sh-btn {
        flex: 1 1;
        margin-right: 10px;
        color: #88949F;
        border-color: #D3DBEB;
      }
      .sh-btn:last-child {
        margin-right: 0;
      }
    }
    .left-header {
      height: auto;
      text-align: center;
      margin-bottom: 38px;
      .header-title {
        border-left: 2px solid #3377ff;
        padding-left: 6px;
        text-align: left;
        margin-bottom: 20px;
      }
      .icon-btn {
        margin-right:20px;
        .iconfont {
          font-size: 14px;
        }
      }
      .mail-btn {
        background:rgba(51,153,255,0.12);
        color: #3377ff;
        border-color: rgba(51,153,255,0.12);
      }
      .headerCreate {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
    }
    .left-main {
      // height: 322px;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: solid 1px #E9F1FC;
      .sh-date-picker-editor {
        width: 100%;
      }
      // 日历样式调整
      /deep/.wh-container {
        font-family: 'Microsoft YaHei';
        .wh-header {
          padding: 0;
        }
        .wh-content {
          display: flex;
          flex-flow: row wrap;
          justify-content: space-between;
          .wh-content-item {
            width: 14.28%;
            height: 42px;
            padding: 4px;
            .wh-isToday {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background-color: #3377ff;
              color: #F7FBFF;
              border: solid 4px #cedfff;
            }
          }
          .wh-item-date.active-day::before {
            width: 6px;
            height: 6px;
            top: 32px;
            left: 12px;
          }
          .wh-isToday.wh-chose-day:before {
            width: 0;
            top: 34px;
            left: 10px;
          }
        }
      }
    }
    .left-footer {
        // height: calc(100% - 540px);
        height: auto;
        margin-top: 20px;
      .chose-box {
        margin-top: 10px;
        height: 100%;
        // overflow-y: auto;
        // checkBox 样式调整
        & div {
          & > label {
            display: flex;
            align-items: center;
            margin: 10px 0;
            & > span {
              margin-right: 10px;
              span {
                width: 14px;
                height: 14px;
              }
              .sh-checkbox-inner:after {
                width: 3px;
                height: 6px;
                top: 2px;
                left: 5px;
              }
              .sh-checkbox-inner {
                border-radius: 50%;
              }
              // .sh-radio-inner {

              // }
              .sh-radio-inner:after {
                width: 8px;
                height: 8px;
              }

            }
          }

        }
      }
      .source-type {
        & div {
          .label-box(1, #ef9a21);
          .label-box(2, #8D91F8);
          .label-box(3, #58B2DB);
        }
      }
    }
  }
  .right-panel {
    // background: #fff;
    flex: 1 1;
    padding: 0 18px;
    margin-left: 10px;
    position: relative;
    .right-header {
      margin-top: 30px;
      margin-bottom: 20px;
      height: auto;
      line-height: 34px;
      .current-date {
        float: left;
        & > span {
          font-size: 18px;
          color: #2C3135;
          font-weight: bold;
          margin-left: 10px;
        }
      }
      .date-list {
        float: right;
        cursor: pointer;
        li {
          height: 34px;
          width: 50px;
          text-align: center;
          display: inline-block;
          background: #F5F5F5;
          margin-right: 10px;
          border-radius: 4px;
        }
        li:last-child {
          margin-right: 0;
        }
        .active {
          background: #3377FF;
          color: #fff;
        }
      }
    }
    .loading-wrap {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      background: hsla(0,0%,100%,.9);
    }
  }
}

.form-footer {
  display: flex;
  justify-content: center;
}
</style>
