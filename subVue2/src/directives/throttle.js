/***
*  @param {?Number|300} time - 间隔时间
*  @param {Function} func - 执行事件
*  @param {?String|"click"} event - 事件类型 例："click"
*  @param {Array} binding.value - [func,event,time]
*  例：<Button v-throttle="[save,`click`,300]">刷新</Button>
*  传递参数则：<Button v-throttle="[()=>save(param),`click`,300]">刷新</Button>
*/
export default {
  inserted: function (el, binding) {
    if (binding.value instanceof Array) {
      let [func, event = 'click', time = 300] = binding.value
      let timer, timerEnd
      el.addEventListener(event, () => {
        if (timer) {
          clearTimeout(timerEnd)
          timerEnd = setTimeout(() => { func() }, time)
          return timerEnd
        }
        func()
        timer = setTimeout(() => { timer = null }, time)
      })
    } else {
      console.error('参数必须是数组')
      return false
    }
  }
}
