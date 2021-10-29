// 打印类属性、方法定义
/**
 * @param {Number} num 打印次数
 * @param {String} col 打印方向，默认为row
 * @param {String} noPrit 不打印类名，默认为no-print
 * @deprecated 打印服务
 */

const Print = function (dom, options) {
  if (!(this instanceof Print)) return new Print(dom, options)

  this.options = this.extend({
    noPrint: '.no-print'
  }, options)

  if ((typeof dom) === 'string') {
    this.dom = document.querySelector(dom)
  } else {
    this.isDOM(dom)
    this.dom = this.isDOM(dom) ? dom : dom.$el
  }

  this.init()
}
Print.prototype = {
  init: function () {
    const content = this.getStyle() + this.getHtml()
    this.writeIframe(content)
  },
  extend: function (obj, obj2) {
    for (const k in obj2) {
      obj[k] = obj2[k]
    }
    return obj
  },

  getStyle: function () {
    let str = ''
    const styles = document.querySelectorAll('style,link')
    for (let i = 0; i < styles.length; i++) {
      str += styles[i].outerHTML
    }
    str += '<style>' + (this.options.noPrint ? this.options.noPrint : '.no-print') + '{display:none;}</style>'

    return str
  },

  getHtml: function () {
    var inputs = document.querySelectorAll('input')
    var textareas = document.querySelectorAll('textarea')
    var selects = document.querySelectorAll('select')

    for (var k = 0; k < inputs.length; k++) {
      if (inputs[k].type === 'checkbox' || inputs[k].type === 'radio') {
        if (inputs[k].checked === true) {
          inputs[k].setAttribute('checked', 'checked')
        } else {
          inputs[k].removeAttribute('checked')
        }
      } else if (inputs[k].type === 'text') {
        inputs[k].setAttribute('value', inputs[k].value)
      } else {
        inputs[k].setAttribute('value', inputs[k].value)
      }
    }

    for (var k2 = 0; k2 < textareas.length; k2++) {
      if (textareas[k2].type === 'textarea') {
        textareas[k2].innerHTML = textareas[k2].value
      }
    }

    for (var k3 = 0; k3 < selects.length; k3++) {
      if (selects[k3].type === 'select-one') {
        var child = selects[k3].children
        for (var i in child) {
          if (child[i].tagName === 'OPTION') {
            if (child[i].selected === true) {
              child[i].setAttribute('selected', 'selected')
            } else {
              child[i].removeAttribute('selected')
            }
          }
        }
      }
    }

    return this.dom.outerHTML
  },

  writeIframe: function (content) {
    let w = ''
    let doc = ''
    const iframe = document.createElement('iframe')
    const f = document.body.appendChild(iframe)
    console.log(this.options)
    const direction = this.options.direction !== 'row' && this.options.direction
      ? 'landscape'
      : 'portrait'
    iframe.id = 'myIframe'
    iframe.setAttribute('style', `position: absolute; width: 0; height: 0; top:-10px; left: -10px ;@page{size: A4 ${direction};}`)
    w = f.contentWindow || f.contentDocument
    doc = f.contentDocument || f.contentWindow.document
    doc.open()
    doc.write(content)
    doc.close()
    iframe.onload = () => {
      this.toPrint(w)
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 100)
    }
  },

  toPrint: function (frameWindow) {
    try {
      setTimeout(function () {
        frameWindow.focus()
        try {
          if (!frameWindow.document.execCommand('print', false, null)) {
            frameWindow.print()
          }
        } catch (e) {
          frameWindow.print()
        }
        frameWindow.close()
      }, 10)
    } catch (err) {
      console.log('err', err)
    }
  },
  isDOM: (typeof HTMLElement === 'object')
    ? function (obj) {
      return obj instanceof HTMLElement
    }
    : function (obj) {
      return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'
    }
}

function isPrint (el, binding) {
  const num = binding.value.num
  if (num && num > 0) {
    for (let i = 0; i < num; i++) {
      Print(el, binding.value)
    }
  }
}

export default {
  bind (el, binding) {
    isPrint(el, binding)
  },
  componentUpdated (el, binding) {
    isPrint(el, binding)
  },
  unbind (el) {
  }
}
