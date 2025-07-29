/**
 * 顾客类
 * 负责管理单个顾客的行为和状态
 */

import { FOOD_PREFERENCES, RECIPE_DATA } from './GameData'

export default class Customer {
  constructor(game, id, name, patience, spendingMultiplier, x, y) {
    this.game = game
    this.id = id
    this.name = name
    this.patience = patience // 耐心值，影响等待时间
    this.spendingMultiplier = spendingMultiplier // 消费倍率

    // 位置信息
    this.x = this.game.width + 100 // 从屏幕右侧进入
    this.y = y
    this.targetX = x
    this.targetY = y
    this.moveSpeed = 2

    // 顾客状态
    this.state = 'entering' // entering, waiting, ordering, eating, leaving, left
    this.isRemoved = false
    this.waitTime = 0 // 等待时间
    this.maxWaitTime = this.patience * 1000 // 最大等待时间（毫秒）
    this.satisfaction = 100 // 满意度

    // 顾客需求
    this.desiredFood = null
    this.desiredFoodQuality = 0

    // 顾客图片
    this.image = this.game.resourceManager.getImage(`customer_${this.id}`)

    // 表情图片
    this.expressionImage = null

    // 对话气泡
    this.bubble = {
      visible: false,
      text: '',
      time: 0,
      duration: 3000
    }

    // 初始化顾客
    this.init()
  }

  /**
   * 初始化顾客
   */
  init() {
    // 生成顾客需求
    this.generateDesiredFood()
  }

  /**
   * 生成顾客需求
   */
  generateDesiredFood() {
    // 获取已解锁的食谱
    const unlockedRecipes = this.game.player.unlockedRecipes

    // 获取顾客食物偏好
    const preferences = FOOD_PREFERENCES[this.id] || []

    // 优先选择顾客偏好的食物
    let possibleFoods = unlockedRecipes.filter(recipeId => preferences.includes(recipeId))

    // 如果没有偏好的食物，则随机选择
    if (possibleFoods.length === 0) {
      possibleFoods = unlockedRecipes
    }

    // 随机选择一种食物
    const randomIndex = Math.floor(Math.random() * possibleFoods.length)
    this.desiredFood = possibleFoods[randomIndex]

    // 根据顾客类型确定期望的食物品质
    if (this.id === 'vip' || this.id === 'critic') {
      // VIP和美食评论家期望更高品质
      this.desiredFoodQuality = Math.min(3, Math.floor(Math.random() * 3) + 1)
    } else {
      // 普通顾客和学生对品质要求较低
      this.desiredFoodQuality = Math.floor(Math.random() * 2)
    }

    console.log(`顾客 ${this.name} 想要: ${this.desiredFood}，期望品质: ${this.desiredFoodQuality}`)
  }

  /**
   * 更新顾客状态
   */
  update() {
    if (this.isRemoved) return

    // 根据状态更新
    switch (this.state) {
      case 'entering':
        this.updateEntering()
        break
      case 'waiting':
        this.updateWaiting()
        break
      case 'ordering':
        this.updateOrdering()
        break
      case 'eating':
        this.updateEating()
        break
      case 'leaving':
        this.updateLeaving()
        break
    }

    // 更新对话气泡
    this.updateBubble()
  }

  /**
   * 更新进入状态
   */
  updateEntering() {
    // 移动到目标位置
    this.moveToTarget()

    // 检查是否到达目标位置
    if (Math.abs(this.x - this.targetX) < 5 && Math.abs(this.y - this.targetY) < 5) {
      // 到达目标位置，切换到等待状态
      this.setState('waiting')

      // 显示需求气泡
      this.showBubble(`我想要${this.getDesiredFoodName()}`)
    }
  }

  /**
   * 更新等待状态
   */
  updateWaiting() {
    // 增加等待时间
    this.waitTime += this.game.timeManager.getDeltaTime()

    // 检查是否超过最大等待时间
    if (this.waitTime >= this.maxWaitTime) {
      // 等待时间过长，顾客离开
      this.setState('leaving')
      this.showBubble('等太久了，我走了！')

      // 降低声誉
      this.game.player.reduceReputation(5)

      return
    }

    // 检查取餐台上是否有符合需求的食物
    const counterFoods = this.game.kitchen.getCounterFoods()

    for (const food of counterFoods) {
      if (food.id === this.desiredFood && food.qualityLevel >= this.desiredFoodQuality) {
        // 找到符合需求的食物
        this.serveFood(food)
        break
      }
    }
  }

  /**
   * 更新点餐状态
   */
  updateOrdering() {
    // 点餐状态的逻辑
    // 在这个简化版本中，点餐状态很快就会转换到等待状态
    this.setState('waiting')
  }

  /**
   * 更新用餐状态
   */
  updateEating() {
    // 用餐时间
    this.waitTime += this.game.timeManager.getDeltaTime()

    // 用餐完成（3秒后）
    if (this.waitTime >= 3000) {
      // 用餐完成，准备离开
      this.setState('leaving')

      // 根据满意度显示不同的对话
      if (this.satisfaction >= 90) {
        this.showBubble('太美味了！下次还来！')
      } else if (this.satisfaction >= 70) {
        this.showBubble('味道不错，谢谢！')
      } else if (this.satisfaction >= 50) {
        this.showBubble('一般般吧...')
      } else {
        this.showBubble('不太满意...')
      }
    }
  }

  /**
   * 更新离开状态
   */
  updateLeaving() {
    // 设置目标位置为屏幕右侧
    this.targetX = this.game.width + 100

    // 移动到目标位置
    this.moveToTarget()

    // 检查是否离开屏幕
    if (this.x > this.game.width + 50) {
      // 离开屏幕，移除顾客
      this.setState('left')
      this.isRemoved = true
    }
  }

  /**
   * 移动到目标位置
   */
  moveToTarget() {
    // 计算方向
    const dx = this.targetX - this.x
    const dy = this.targetY - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // 如果距离很小，直接到达目标位置
    if (distance < this.moveSpeed) {
      this.x = this.targetX
      this.y = this.targetY
      return
    }

    // 计算移动方向
    const dirX = dx / distance
    const dirY = dy / distance

    // 移动
    this.x += dirX * this.moveSpeed
    this.y += dirY * this.moveSpeed
  }

  /**
   * 设置目标位置
   */
  setTargetPosition(x, y) {
    this.targetX = x
    this.targetY = y
  }

  /**
   * 设置状态
   */
  setState(state) {
    this.state = state
    this.waitTime = 0

    // 根据状态更新表情
    this.updateExpression()
  }

  /**
   * 更新表情
   */
  updateExpression() {
    // 根据状态和满意度设置表情
    let expression = 'neutral'

    if (this.state === 'leaving') {
      if (this.satisfaction >= 90) {
        expression = 'happy'
      } else if (this.satisfaction >= 50) {
        expression = 'neutral'
      } else {
        expression = 'angry'
      }
    } else if (this.state === 'waiting') {
      // 等待时的表情随时间变化
      const waitRatio = this.waitTime / this.maxWaitTime

      if (waitRatio > 0.7) {
        expression = 'angry'
      } else if (waitRatio > 0.4) {
        expression = 'neutral'
      }
    }

    // 加载表情图片
    this.expressionImage = this.game.resourceManager.getImage(`expression_${expression}`)
  }

  /**
   * 显示对话气泡
   */
  showBubble(text) {
    this.bubble.visible = true
    this.bubble.text = text
    this.bubble.time = 0
  }

  /**
   * 更新对话气泡
   */
  updateBubble() {
    if (this.bubble.visible) {
      this.bubble.time += this.game.timeManager.getDeltaTime()

      // 检查是否超过显示时间
      if (this.bubble.time >= this.bubble.duration) {
        this.bubble.visible = false
      }
    }
  }

  /**
   * 渲染顾客
   */
  render(ctx) {
    // 绘制顾客
    if (this.image) {
      ctx.drawImage(
        this.image,
        this.x - 30,
        this.y - 50,
        60,
        100
      )
    } else {
      // 绘制默认矩形
      ctx.fillStyle = '#999'
      ctx.fillRect(this.x - 30, this.y - 50, 60, 100)
    }

    // 绘制表情
    if (this.expressionImage) {
      ctx.drawImage(
        this.expressionImage,
        this.x - 15,
        this.y - 40,
        30,
        30
      )
    }

    // 绘制顾客名称
    ctx.fillStyle = '#333'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(this.name, this.x, this.y + 55)

    // 绘制等待进度条
    if (this.state === 'waiting') {
      this.renderWaitingBar(ctx)
    }

    // 绘制对话气泡
    if (this.bubble.visible) {
      this.renderBubble(ctx)
    }
  }

  /**
   * 绘制等待进度条
   */
  renderWaitingBar(ctx) {
    const barWidth = 50
    const barHeight = 5
    const barX = this.x - barWidth / 2
    const barY = this.y + 70

    // 绘制进度条背景
    ctx.fillStyle = '#ddd'
    ctx.fillRect(barX, barY, barWidth, barHeight)

    // 计算等待进度
    const waitRatio = this.waitTime / this.maxWaitTime

    // 根据等待时间设置颜色
    let barColor = '#4caf50' // 绿色
    if (waitRatio > 0.7) {
      barColor = '#f44336' // 红色
    } else if (waitRatio > 0.4) {
      barColor = '#ff9800' // 橙色
    }

    // 绘制进度条
    ctx.fillStyle = barColor
    ctx.fillRect(barX, barY, barWidth * (1 - waitRatio), barHeight)
  }

  /**
   * 绘制对话气泡
   */
  renderBubble(ctx) {
    const bubbleWidth = 120
    const bubbleHeight = 40
    const bubbleX = this.x - bubbleWidth / 2
    const bubbleY = this.y - 90

    // 绘制气泡背景
    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#999'
    ctx.lineWidth = 1

    // 绘制圆角矩形
    ctx.beginPath()
    ctx.moveTo(bubbleX + 10, bubbleY)
    ctx.lineTo(bubbleX + bubbleWidth - 10, bubbleY)
    ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + 10)
    ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - 10)
    ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - 10, bubbleY + bubbleHeight)
    ctx.lineTo(bubbleX + 10, bubbleY + bubbleHeight)
    ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - 10)
    ctx.lineTo(bubbleX, bubbleY + 10)
    ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + 10, bubbleY)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()

    // 绘制小三角形
    ctx.beginPath()
    ctx.moveTo(this.x, bubbleY + bubbleHeight)
    ctx.lineTo(this.x - 10, bubbleY + bubbleHeight - 10)