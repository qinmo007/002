/**
 * 食物类
 * 负责管理食物的状态和属性
 */

export default class Food {
  constructor(game, id, name, price, cookTime, x, y, width, height) {
    this.game = game
    this.id = id
    this.name = name
    this.price = price
    this.cookTime = cookTime
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    // 食物状态
    this.isCooking = false
    this.isCooked = false
    this.isServed = false
    this.isRemoved = false
    this.cookingProgress = 0
    this.freshness = 100 // 新鲜度，随时间降低
    this.qualityLevel = 0 // 品质等级，0-3

    // 拖拽状态
    this.isDragging = false
    this.isOnCounter = false

    // 食物图片
    this.image = this.game.resourceManager.getImage(`food_${this.id}`)

    // 食物动画帧
    this.frames = []
    this.currentFrame = 0
    this.frameTime = 0
    this.frameDuration = 200 // 毫秒

    // 加载食物动画帧
    this.loadFrames()

    // 创建时间
    this.createdTime = this.game.timeManager.getCurrentTime()

    // 过期时间（5分钟后）
    this.expiryTime = this.createdTime + 5 * 60 * 1000
  }

  /**
   * 加载食物动画帧
   */
  loadFrames() {
    // 加载食物的动画帧
    for (let i = 1; i <= 4; i++) {
      const frame = this.game.resourceManager.getImage(`food_${this.id}_${i}`)
      if (frame) {
        this.frames.push(frame)
      }
    }
  }

  /**
   * 更新食物状态
   */
  update() {
    if (this.isRemoved) return

    if (this.isCooking) {
      // 更新烹饪进度
      this.cookingProgress += this.game.timeManager.getDeltaTime()

      // 更新动画帧
      this.frameTime += this.game.timeManager.getDeltaTime()
      if (this.frameTime >= this.frameDuration) {
        this.frameTime = 0
        this.currentFrame = (this.currentFrame + 1) % Math.max(1, this.frames.length)
      }
    } else if (this.isCooked) {
      // 更新新鲜度
      const currentTime = this.game.timeManager.getCurrentTime()
      const elapsedTime = currentTime - this.createdTime
      const totalTime = this.expiryTime - this.createdTime

      this.freshness = Math.max(0, 100 - (elapsedTime / totalTime) * 100)

      // 检查是否过期
      if (currentTime > this.expiryTime) {
        this.remove()
      }
    }
  }

  /**
   * 渲染食物
   */
  render(ctx) {
    if (this.isRemoved) return

    // 绘制食物
    if (this.frames.length > 0 && this.isCooking) {
      // 绘制动画帧
      const frame = this.frames[this.currentFrame]
      ctx.drawImage(
        frame,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      )
    } else if (this.image) {
      // 绘制静态图片
      ctx.drawImage(
        this.image,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      )
    } else {
      // 绘制默认矩形
      ctx.fillStyle = '#fc8'
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      )
    }

    // 如果已烹饪完成，绘制品质标识
    if (this.isCooked) {
      this.renderQualityIndicator(ctx)
    }

    // 如果正在拖拽，绘制名称
    if (this.isDragging) {
      ctx.fillStyle = '#333'
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(this.name, this.x, this.y + this.height / 2 + 5)
    }
  }

  /**
   * 绘制品质指示器
   */
  renderQualityIndicator(ctx) {
    // 品质颜色
    const qualityColors = ['#999', '#5c5', '#55f', '#f5f']
    const qualityNames = ['普通', '优质', '精品', '极品']

    // 绘制品质背景
    ctx.fillStyle = qualityColors[this.qualityLevel]
    ctx.beginPath()
    ctx.arc(
      this.x + this.width / 2 - 10,
      this.y - this.height / 2 + 10,
      12,
      0,
      Math.PI * 2
    )
    ctx.fill()

    // 绘制品质文字
    ctx.fillStyle = '#fff'
    ctx.font = '10px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      qualityNames[this.qualityLevel],
      this.x + this.width / 2 - 10,
      this.y - this.height / 2 + 10
    )

    // 绘制新鲜度指示器
    const freshnessWidth = this.width * 0.8
    const freshnessHeight = 4
    const freshnessX = this.x - freshnessWidth / 2
    const freshnessY = this.y + this.height / 2 + 2

    // 绘制新鲜度背景
    ctx.fillStyle = '#ddd'
    ctx.fillRect(freshnessX, freshnessY, freshnessWidth, freshnessHeight)

    // 绘制新鲜度条
    let freshnessColor = '#4caf50' // 绿色
    if (this.freshness < 30) {
      freshnessColor = '#f44336' // 红色
    } else if (this.freshness < 70) {
      freshnessColor = '#ff9800' // 橙色
    }

    ctx.fillStyle = freshnessColor
    ctx.fillRect(freshnessX, freshnessY, freshnessWidth * (this.freshness / 100), freshnessHeight)
  }

  /**
   * 检查点是否在食物内
   */
  containsPoint(x, y) {
    return x >= this.x - this.width / 2 &&
           x <= this.x + this.width / 2 &&
           y >= this.y - this.height / 2 &&
           y <= this.y + this.height / 2
  }

  /**
   * 开始烹饪
   */
  startCooking() {
    this.isCooking = true
    this.isCooked = false
    this.cookingProgress = 0
  }

  /**
   * 完成烹饪
   */
  finishCooking() {
    this.isCooking = false
    this.isCooked = true

    // 计算品质等级
    this.calculateQuality()

    // 播放完成音效
    this.game.soundManager.playSound('food_ready')
  }

  /**
   * 计算食物品质
   */
  calculateQuality() {
    // 基于烹饪时间和玩家等级计算品质
    const perfectTime = this.cookTime
    const actualTime = this.cookingProgress
    const timeDifference = Math.abs(perfectTime - actualTime)
    const timeAccuracy = Math.max(0, 1 - timeDifference / perfectTime)

    // 玩家等级加成
    const levelBonus = this.game.player.level * 0.05

    // 随机因素
    const randomFactor = Math.random() * 0.2

    // 计算最终品质分数 (0-1)
    const qualityScore = timeAccuracy * 0.7 + levelBonus + randomFactor

    // 确定品质等级
    if (qualityScore >= 0.9) {
      this.qualityLevel = 3 // 极品
    } else if (qualityScore >= 0.7) {
      this.qualityLevel = 2 // 精品
    } else if (qualityScore >= 0.5) {
      this.qualityLevel = 1 // 优质
    } else {
      this.qualityLevel = 0 // 普通
    }

    // 根据品质调整价格
    const qualityMultiplier = [1, 1.2, 1.5, 2][this.qualityLevel]
    this.price = Math.floor(this.price * qualityMultiplier)

    console.log(`${this.name} 烹饪完成，品质：${['普通', '优质', '精品', '极品'][this.qualityLevel]}，价格：${this.price}`)
  }

  /**
   * 开始拖拽
   */
  startDrag() {
    this.isDragging = true
  }

  /**
   * 结束拖拽
   */
  endDrag() {
    this.isDragging = false
  }

  /**
   * 设置位置
   */
  setPosition(x, y) {
    this.x = x
    this.y = y
  }

  /**
   * 设置是否在取餐台上
   */
  setOnCounter(isOnCounter) {
    this.isOnCounter = isOnCounter
  }

  /**
   * 出售食物
   */
  sell() {
    if (this.isRemoved || this.isServed) return 0

    // 设置状态
    this.isServed = true
    this.isRemoved = true

    // 计算实际售价（考虑新鲜度）
    const freshnessMultiplier = this.freshness / 100
    const actualPrice = Math.floor(this.price * freshnessMultiplier)

    // 更新玩家统计数据
    this.game.player.updateStats('totalDishesServed', 1)

    // 播放售卖音效
    this.game.soundManager.playSound('sell_food')

    console.log(`售出 ${this.name}，价格：${actualPrice}`)

    return actualPrice
  }

  /**
   * 移除食物
   */
  remove() {
    this.isRemoved = true
  }

  /**
   * 获取食物信息
   */
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      qualityLevel: this.qualityLevel,
      freshness: this.freshness
    }
  }
}
/**