<template>
  <div class="weather">
    <Icon class="icon_small" :type="reflect(today.codeDay)" size="20" />
    <div class="weather_temp">
      <div class="title">{{ today.textDay }}</div>
      <div>
        <span>{{ today.low }}</span>
        <!-- <span style="color: #59bb62">{{ today.low }}</span> -->
        <span> ~ </span>
        <span>{{ today.high }}</span>
        <!-- <span style="color: red">{{ today.high }}</span> -->
        <span> ℃</span>
      </div>
    </div>
  </div>
</template>

<script>

import { mapActions } from 'vuex'

const json = [
  { name: 'icon-qingtian', code: '0' },
  { name: 'icon-qingtian', code: '1' },
  { name: 'icon-qingtian', code: '2' },
  { name: 'icon-qingtian', code: '3' },
  { name: 'icon-qingzhuanduoyun', code: '4' },
  { name: 'icon-duoyunzhuanqing', code: '5' },
  { name: 'icon-duoyunzhuanqing', code: '6' },
  { name: 'icon-duoyunzhuanqing', code: '7' },
  { name: 'icon-duoyunzhuanqing', code: '8' },
  { name: 'icon-yintian', code: '9' },
  { name: 'icon-zhenyu', code: '10' },
  { name: 'icon-leizhenyu', code: '11' },
  { name: 'icon-bingbao', code: '12' },
  { name: 'icon-xiaoyu', code: '13' },
  { name: 'icon-zhongyu', code: '14' },
  { name: 'icon-dayu', code: '15' },
  { name: 'icon-baoyu', code: '16' },
  { name: 'icon-baoyu', code: '17' },
  { name: 'icon-baoyu', code: '18' },
  { name: 'icon-bingbao', code: '19' },
  { name: 'icon-yujiaxue', code: '20' },
  { name: 'icon-xiaoxue', code: '21' },
  { name: 'icon-xiaoxue', code: '22' },
  { name: 'icon-zhongxue', code: '23' },
  { name: 'icon-daxue', code: '24' },
  { name: 'icon-baoxue', code: '25' },
  { name: 'shachengbao1', code: '26' },
  { name: 'shachengbao1', code: '27' },
  { name: 'shachengbao1', code: '28' },
  { name: 'shachengbao1', code: '29' },
  { name: 'icon-youwu', code: '30' },
  { name: 'icon-youwu', code: '31' },
  { name: 'icon-feng', code: '32' },
  { name: 'icon-feng', code: '33' },
  { name: 'shachengbao', code: '34' },
  { name: 'shachengbao', code: '35' },
  { name: 'shachengbao', code: '36' },
  { name: 'icon-feng', code: '37' },
  { name: 'icon-qingtian', code: '38' },
  { name: 'icon-qingtian', code: '99' }

]

export default {
  name: 'Weather',
  data () {
    return {
      weather: [{
        codeDay: '',
        textDay: '',
        low: '',
        high: ''
      }],
      today: {
        codeDay: '',
        textDay: '',
        low: '',
        high: ''
      },
      days: 7
    }
  },
  computed: {

  },
  watch: {

  },
  mounted () {
    setTimeout(() => {
      this.queryWeather()
    }, 1000)
  },
  methods: {
    ...mapActions(['getWeatherInfo']),
    queryWeather () {
      let returnCity = window.returnCitySN
      if (!returnCity || !returnCity.cip) return
      this.getWeatherInfo({ 'location': returnCity.cip, days: this.days }).then(resp => {
        this.weather = resp.data
        if (this.weather && this.weather.length > 0) {
          this.today = this.weather[0]
        }
      })
    },
    reflect (index) {
      if (!index) return
      let rt = ''
      for (let i of json) {
        if (i.code === index) {
          rt = i.name
          break
        }
      }
      return rt
    }
  }
}
</script>

<style scoped lang="less">
@deep:~ '>>>';
.weather {
  color: #fff;
  width: 120px;
  display: flex;
  line-height: 40px;
  height: 40px;
  .icon_small {
    line-height: 40px;
    @{deep}svg {
      margin-top: 5px;
      width: 30px;
      height: 30px;
    }
  }
  .icon_jin {
    @{deep}svg {
      width: 20px;
      height: 20px;
    }
  }
  .weather_temp {
    display: inline-flex;
    .title {
      padding: 0 4px;
    }
  }
}
</style>
