/**
 * 资源管理器
 * 负责加载和管理游戏资源（图片、音频等）
 */
export class ResourceManager {
  constructor() {
    // 资源存储
    this.images = {}
    this.audio = {}
    this.loadedCount = 0
    this.totalCount = 0
  }

  // 加载所有资源
  async loadAll() {
    try {
      // 加载图片资源
      await this.loadImages({
        // 顾客图片
        'customer_normal': 'images/customers/customer_normal.png',
        'customer_hurry': 'images/customers/customer_hurry.png',
        'customer_relax': 'images/customers/customer_relax.png',

        // 食物图片
        'fried_egg': 'images/foods/fried_egg.png',
        'toast': 'images/foods/toast.png',
        'coffee': 'images/foods/coffee.png',
        'bacon': 'images/foods/bacon.png',

        // UI元素
        'background': 'images/ui/background.png',
        'counter': 'images/ui/counter.png',
        'fryer': 'images/ui/fryer.png',
        'toaster': 'images/ui/toaster.png',
        'coffee_maker': 'images/ui/coffee_maker.png',
        'order_bubble': 'images/ui/order_bubble.png',
        'timer': 'images/ui/timer.png'
      })

      // 加载音频资源
      await this.loadAudio({
        'bgm': 'audio/bgm/restaurant_bgm.mp3',
        'order_complete': 'audio/sfx/order_complete.mp3',
        'order_fail': 'audio/sfx/order_fail.mp3',
        'cooking': 'audio/sfx/cooking.mp3',
        'customer_arrive': 'audio/sfx/customer_arrive.mp3'
      })

      return true
    } catch (error) {
      console.error('资源加载失败:', error)
      return false
    }
  }

  // 加载图片资源
  async loadImages(imageMap) {
    const promises = []
    this.totalCount += Object.keys(imageMap).length

    for (const [key, path] of Object.entries(imageMap)) {
      promises.push(
        new Promise((resolve, reject) => {
          const img = wx.createImage()
          img.onload = () => {
            this.images[key] = img
            this.loadedCount++
            resolve()
          }
          img.onerror = () => reject(new Error(`Failed to load image: ${path}`))
          img.src = path
        })
      )
    }

    return Promise.all(promises)
  }

  // 加载音频资源
  async loadAudio(audioMap) {
    const promises = []
    this.totalCount += Object.keys(audioMap).length

    for (const [key, path] of Object.entries(audioMap)) {
      promises.push(
        new Promise((resolve, reject) => {
          const audio = wx.createInnerAudioContext()
          audio.src = path
          audio.onCanplay(() => {
            this.audio[key] = audio
            this.loadedCount++
            resolve()
          })
          audio.onError(() => reject(new Error(`Failed to load audio: ${path}`)))
        })
      )
    }

    return Promise.all(promises)
  }

  // 获取图片资源
  getImage(key) {
    return this.images[key]
  }

  // 获取音频资源
  getAudio(key) {
    return this.audio[key]
  }

  // 播放音频
  playAudio(key, loop = false) {
    const audio = this.audio[key]
    if (audio) {
      audio.loop = loop
      audio.play()
    }
  }

  // 停止音频
  stopAudio(key) {
    const audio = this.audio[key]
    if (audio) {
      audio.stop()
    }
  }

  // 获取加载进度
  getLoadProgress() {
    return this.totalCount > 0 ? this.loadedCount / this.totalCount : 0
  }
}
