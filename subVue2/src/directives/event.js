/**
 * @param {event} 事件名称，默认为resize
 * @deprecated     window对象绑定事件监听
 */
export default {
  inserted: function (el, binding) {
    if (binding.value && typeof (binding.value) === 'function') {
      let event = 'resize'
      if (JSON.stringify(binding.modifiers) !== '{}') {
        event = Object.keys(binding.modifiers)[0]
      }
      window.addEventListener(event, binding.value)
    }
  },
  unbind: function (el, binding) {
    if (binding.value && typeof (binding.value) === 'function') {
      let event = 'resize'
      if (JSON.stringify(binding.modifiers) !== '{}') {
        event = Object.keys(binding.modifiers)[0]
      }
      window.removeEventListener(event, binding.value)
    }
  }
}
