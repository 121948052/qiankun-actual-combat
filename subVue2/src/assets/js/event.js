export function addListener (element, event, fn) {
  element.addEventListener
    ? element.addEventListener(event, fn, false)
    : element.attachEvent('on' + event, fn)
}

export function removeListener (element, event, fn) {
  element.removeEventListener
    ? element.removeEventListener(event, fn, false)
    : element.detachEvent('on' + event, fn)
}

export function stopPrevent () {
  if (event.preventDefault) {
    event.preventDefault()
  } else {
    window.event.returnValue = false
  }
}
