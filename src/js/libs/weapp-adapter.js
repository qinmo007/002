/**
 * 微信小游戏适配器
 * 提供类似于浏览器环境的 API
 */

const { platform } = wx.getSystemInfoSync()

// 是否为开发者工具
const isDevtools = platform === 'devtools'

// 创建 Canvas
const canvas = wx.createCanvas()
const canvasWidth = canvas.width
const canvasHeight = canvas.height

// 创建 Context
const context = canvas.getContext('2d')

// 创建 Image 对象
class Image {
  constructor() {
    this.width = 0
    this.height = 0
    this.complete = false

    this._src = ''
    this._image = wx.createImage()

    this._image.onload = () => {
      this.complete = true
      this.width = this._image.width
      this.height = this._image.height

      if (typeof this.onload === 'function') {
        this.onload()
      }
    }

    this._image.onerror = () => {
      if (typeof this.onerror === 'function') {
        this.onerror()
      }
    }
  }

  get src() {
    return this._src
  }

  set src(value) {
    this._src = value
    this._image.src = value
  }
}

// 创建 Audio 对象
class Audio {
  constructor(url) {
    this.src = url
    this._audio = wx.createInnerAudioContext()
    this._audio.src = url

    this._audio.onPlay(() => {
      if (typeof this.onplay === 'function') {
        this.onplay()
      }
    })

    this._audio.onEnded(() => {
      if (typeof this.onended === 'function') {
        this.onended()
      }
    })

    this._audio.onError((err) => {
      if (typeof this.onerror === 'function') {
        this.onerror(err)
      }
    })
  }

  play() {
    this._audio.play()
  }

  pause() {
    this._audio.pause()
  }

  stop() {
    this._audio.stop()
  }

  get currentTime() {
    return this._audio.currentTime
  }

  set currentTime(value) {
    this._audio.seek(value)
  }

  get duration() {
    return this._audio.duration
  }

  get loop() {
    return this._audio.loop
  }

  set loop(value) {
    this._audio.loop = value
  }

  get volume() {
    return this._audio.volume
  }

  set volume(value) {
    this._audio.volume = value
  }
}

// 创建 TouchEvent 对象
class TouchEvent {
  constructor(type, touches) {
    this.type = type
    this.touches = touches
    this.targetTouches = touches
    this.changedTouches = touches
    this.timeStamp = Date.now()
  }
}

// 创建 MouseEvent 对象
class MouseEvent {
  constructor(type, x, y) {
    this.type = type
    this.clientX = x
    this.clientY = y
    this.timeStamp = Date.now()
  }
}

// 创建 document 对象
const document = {
  createElement(tagName) {
    if (tagName === 'canvas') {
      return canvas
    } else if (tagName === 'img') {
      return new Image()
    } else if (tagName === 'audio') {
      return new Audio()
    }
    return null
  },
  body: {
    appendChild: () => {},
    insertBefore: () => {}
  },
  createElementNS(nameSpace, tagName) {
    return this.createElement(tagName)
  },
  querySelector() {
    return null
  },
  addEventListener: () => {},
  removeEventListener: () => {}
}

// 创建 window 对象
const window = {
  innerWidth: canvasWidth,
  innerHeight: canvasHeight,
  devicePixelRatio: 1,
  document,
  canvas,
  Image,
  Audio,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  requestAnimationFrame: wx.requestAnimationFrame,
  cancelAnimationFrame: wx.cancelAnimationFrame,
  addEventListener: (type, listener) => {
    if (type === 'touchstart' || type === 'touchmove' || type === 'touchend') {
      wx.onTouchStart((e) => {
        if (type === 'touchstart') {
          listener(new TouchEvent('touchstart', e.touches))
        }
      })
      wx.onTouchMove((e) => {
        if (type === 'touchmove') {
          listener(new TouchEvent('touchmove', e.touches))
        }
      })
      wx.onTouchEnd((e) => {
        if (type === 'touchend') {
          listener(new TouchEvent('touchend', e.touches))
        }
      })
    }
  },
  removeEventListener: () => {}
}

// 导出对象
export { canvas, context, Image, Audio, document, window }
export default window
