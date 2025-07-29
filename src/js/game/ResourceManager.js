/**
 * 资源管理器类
 * 负责加载和管理游戏资源，如图片和音频
 */

export default class ResourceManager {
  constructor(game) {
    this.game = game

    // 资源缓存
    this.images = {}
    this.sounds = {}
    this.fonts = {}

    // 加载状态
    this.totalResources = 0
    this.loadedResources = 0
    this.isLoading = false

    // 加载完成回调
    this.onLoadComplete = null

    // 资源基础路径
    this.basePath = 'assets/'

    // 初始化资源管理器
    this.init()
  }

  /**
   * 初始化资源管理器
   */
  init() {
    console.log('资源管理器初始化完成')
  }

  /**
   * 预加载所有游戏资源
   */
  preloadAll(callback) {
    this.onLoadComplete = callback
    this.isLoading = true

    // 加载图片资源
    this.preloadImages()

    // 加载音频资源
    this.preloadSounds()

    // 加载字体资源
    this.preloadFonts()

    // 如果没有资源需要加载，直接调用回调
    if (this.totalResources === 0) {
      this.isLoading = false
      if (this.onLoadComplete) {
        this.onLoadComplete()
      }
    }
  }

  /**
   * 预加载图片资源
   */
  preloadImages() {
    // 设备图片
    const equipmentImages = [
      'stove', 'grill', 'coffee_machine', 'juicer', 'steamer', 'fryer', 'oven', 'blender'
    ]

    // 食物图片
    const foodImages = [
      'fried_egg', 'scrambled_egg', 'bacon', 'sausage', 'toast', 'pancake',
      'grilled_sausage', 'grilled_sandwich', 'coffee', 'latte', 'cappuccino',
      'americano', 'orange_juice', 'apple_juice', 'mixed_juice', 'smoothie',
      'steamed_bun', 'dumpling', 'rice_roll', 'steamed_rice'
    ]

    // 顾客图片
    const customerImages = [
      'normal', 'student', 'businessman', 'vip', 'critic'
    ]

    // 表情图片
    const expressionImages = [
      'happy', 'neutral', 'angry', 'surprised'
    ]

    // UI图片
    const uiImages = [
      'button', 'panel', 'coin', 'exp', 'clock', 'heart',
      'menu_bg', 'game_bg', 'shop_bg', 'counter'
    ]

    // 加载设备图片
    equipmentImages.forEach(id => {
      this.loadImage(`equipment_${id}`, `${this.basePath}images/equipment/${id}.png`)

      // 加载设备动画帧
      for (let i = 1; i <= 4; i++) {
        this.loadImage(`equipment_${id}_${i}`, `${this.basePath}images/equipment/${id}_${i}.png`)
      }
    })

    // 加载食物图片
    foodImages.forEach(id => {
      this.loadImage(`food_${id}`, `${this.basePath}images/food/${id}.png`)

      // 加载食物动画帧
      for (let i = 1; i <= 4; i++) {
        this.loadImage(`food_${id}_${i}`, `${this.basePath}images/food/${id}_${i}.png`)
      }
    })

    // 加载顾客图片
    customerImages.forEach(id => {
      this.loadImage(`customer_${id}`, `${this.basePath}images/customer/${id}.png`)
    })

    // 加载表情图片
    expressionImages.forEach(id => {
      this.loadImage(`expression_${id}`, `${this.basePath}images/expression/${id}.png`)
    })

    // 加载UI图片
    uiImages.forEach(id => {
      this.loadImage(`ui_${id}`, `${this.basePath}images/ui/${id}.png`)
    })
  }

  /**
   * 预加载音频资源
   */
  preloadSounds() {
    // 音效列表
    const soundEffects = [
      'click', 'coin', 'cooking_start', 'cooking_complete',
      'customer_arrive', 'customer_leave', 'level_up',
      'sell_food', 'store_open', 'store_close',
      'cooking_stove', 'cooking_grill', 'cooking_coffee',
      'cooking_juicer', 'cooking_steamer', 'cooking_fryer',
      'cooking_oven', 'cooking_blender', 'food_ready'
    ]

    // 背景音乐
    const backgroundMusic = [
      'main_theme', 'cooking', 'shop'
    ]

    // 加载音效
    soundEffects.forEach(id => {
      this.loadSound(id, `${this.basePath}sounds/effects/${id}.mp3`)
    })

    // 加载背景音乐
    backgroundMusic.forEach(id => {
      this.loadSound(`bgm_${id}`, `${this.basePath}sounds/music/${id}.mp3`)
    })
  }

  /**
   * 预加载字体资源
   */
  preloadFonts() {
    // 字体列表
    const fonts = [
      'game_font'
    ]

    // 加载字体
    fonts.forEach(id => {
      this.loadFont(id, `${this.basePath}fonts/${id}.ttf`)
    })
  }

  /**
   * 加载图片资源
   */
  loadImage(id, src) {
    this.totalResources++

    const image = new Image()
    image.onload = () => {
      this.images[id] = image
      this.resourceLoaded()
    }
    image.onerror = () => {
      console.error(`Failed to load image: ${src}`)
      this.resourceLoaded()
    }
    image.src = src
  }

  /**
   * 加载音频资源
   */
  loadSound(id, src) {
    this.totalResources++

    const sound = new Audio()
    sound.oncanplaythrough = () => {
      this.sounds[id] = sound
      this.resourceLoaded()
    }
    sound.onerror = () => {
      console.error(`Failed to load sound: ${src}`)
      this.resourceLoaded()
    }
    sound.src = src
  }

  /**
   * 加载字体资源
   */
  loadFont(id, src) {
    this.totalResources++

    const fontFace = new FontFace(id, `url(${src})`)
    fontFace.load().then(
      loadedFont => {
        document.fonts.add(loadedFont)
        this.fonts[id] = loadedFont
        this.resourceLoaded()
      },
      error => {
        console.error(`Failed to load font: ${src}`, error)
        this.resourceLoaded()
      }
    )
  }

  /**
   * 资源加载完成回调
   */
  resourceLoaded() {
    this.loadedResources++

    // 更新加载进度
    const progress = this.loadedResources / this.totalResources

    // 检查是否所有资源都已加载完成
    if (this.loadedResources >= this.totalResources) {
      this.isLoading = false
      console.log('所有资源加载完成')

      // 调用加载完成回调
      if (this.onLoadComplete) {
        this.onLoadComplete()
      }
    }
  }

  /**
   * 获取图片资源
   */
  getImage(id) {
    return this.images[id]
  }

  /**
   * 获取音频资源
   */
  getSound(id) {
    return this.sounds[id]
  }

  /**
   * 获取字体资源
   */
  getFont(id) {
    return this.fonts[id]
  }

  /**
   * 获取加载进度
   */
  getLoadingProgress() {
    if (this.totalResources === 0) return 1
    return this.loadedResources / this.totalResources
  }

  /**
   * 检查是否正在加载
   */
  isResourceLoading() {
    return this.isLoading
  }

  /**
   * 设置资源基础路径
   */
  setBasePath(path) {
    this.basePath = path
  }
}
