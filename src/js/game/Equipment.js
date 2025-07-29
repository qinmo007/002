/**
 * 设备类
 * 负责管理厨房设备的状态和功能
 */

export default class Equipment {
  constructor(game, id, name, type, x, y, width, height, cookTime, recipes) {
    this.game = game
    this.id = id
    this.name = name
    this.type = type
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.cookTime = cookTime
    this.recipes = recipes

    // 设备状态
    this.isCooking = false
    this.cookingProgress = 0
    this.currentRecipe = null
    this.currentFood = null

    // 设备等级
    this.level = 1

    // 设备升级价格
    this.upgradePrice = 200 * this.level

    // 设备图片
    this.image = this.game.resourceManager.getImage(`equipment_${this.id}`)

    // 设备动画帧
    this.frames = []
    this.currentFrame = 0
    this.frameTime = 0
    this.frameDuration = 200 // 毫秒

    // 加载设备动画帧
    this.loadFrames()
  }

  /**
   * 加载设备动画帧
   */
  loadFrames() {
    // 加载设备的动画帧
    for (let i = 1; i <= 4; i++) {
      const frame = this.game.resourceManager.getImage(`equipment_${this.id}_${i}`)
      if (frame) {
        this.frames.push(frame)
      }
    }
  }

  /**
   * 更新设备状态
   */
  update() {
    if (this.isCooking) {
      // 更新烹饪进度
      this.cookingProgress += this.game.timeManager.getDeltaTime()

      // 更新动画帧
      this.frameTime += this.game.timeManager.getDeltaTime()
      if (this.frameTime >= this.frameDuration) {
        this.frameTime = 0
        this.currentFrame = (this.currentFrame + 1) % this.frames.length
      }

      // 检查是否烹饪完成
      if (this.cookingProgress >= this.cookTime / this.level) {
        this.finishCooking()
      }
    }
  }

  /**
   * 渲染设备
   */
  render(ctx) {
    // 绘制设备
    if (this.isCooking && this.frames.length > 0) {
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
      ctx.fillStyle = '#aaa'
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      )
    }

    // 绘制设备名称
    ctx.fillStyle = '#333'
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(this.name, this.x, this.y + this.height / 2 + 5)

    // 如果正在烹饪，绘制进度条
if (this.isCooking) {
      this.renderProgressBar(ctx)
    }
  }

  /**
   * 绘制进度条
   */
  renderProgressBar(ctx) {
    const progressWidth = this.width * 0.8
    const progressHeight = 10
    const progressX = this.x - progressWidth / 2
    const progressY = this.y - this.height / 2 - 20

    // 绘制进度条背景
    ctx.fillStyle = '#ddd'
    ctx.fillRect(progressX, progressY, progressWidth, progressHeight)

    // 计算进度
    const progress = this.cookingProgress / (this.cookTime / this.level)

    // 绘制进度条
    ctx.fillStyle = '#4caf50'
    ctx.fillRect(progressX, progressY, progressWidth * progress, progressHeight)

    // 绘制进度条边框
    ctx.strokeStyle = '#999'
    ctx.lineWidth = 1
    ctx.strokeRect(progressX, progressY, progressWidth, progressHeight)
  }

  /**
   * 检查点是否在设备内
   */
  containsPoint(x, y) {
    return x >= this.x - this.width / 2 &&
           x <= this.x + this.width / 2 &&
           y >= this.y - this.height / 2 &&
           y <= this.y + this.height / 2
  }

  /**
   * 点击设备
   */
  onTap() {
    if (this.isCooking) {
      // 如果正在烹饪，显示烹饪信息
      console.log(`${this.name} 正在烹饪: ${this.currentRecipe}，进度: ${Math.floor(this.cookingProgress / (this.cookTime / this.level) * 100)}%`)
    } else {
      // 如果没有烹饪，显示食谱选择菜单
      this.game.ui.showRecipeMenu(this)
    }
  }

  /**
   * 开始烹饪
   */
  startCooking(recipeId) {
    if (this.isCooking) return false

    // 检查是否支持该食谱
    if (!this.recipes.includes(recipeId)) {
      console.log(`${this.name} 不支持烹饪 ${recipeId}`)
      return false
    }

    // 检查玩家是否解锁该食谱
    if (!this.game.player.unlockedRecipes.includes(recipeId)) {
      console.log(`玩家未解锁食谱: ${recipeId}`)
      return false
    }

    // 设置烹饪状态
    this.isCooking = true
    this.cookingProgress = 0
    this.currentRecipe = recipeId

    // 创建食物
    this.currentFood = this.game.kitchen.createFood(recipeId, this)

    // 播放烹饪音效
    this.game.soundManager.playSound(`cooking_${this.type}`)

    console.log(`${this.name} 开始烹饪: ${recipeId}`)

    return true
  }

  /**
   * 完成烹饪
   */
  finishCooking() {
    if (!this.isCooking) return

    // 重置烹饪状态
    this.isCooking = false
    this.cookingProgress = 0

    // 完成食物烹饪
    if (this.currentFood) {
      this.currentFood.finishCooking()
    }

    // 播放完成音效
    this.game.soundManager.playSound('cooking_complete')

    console.log(`${this.name} 完成烹饪: ${this.currentRecipe}`)

    // 重置当前食谱
    this.currentRecipe = null
    this.currentFood = null
  }

  /**
   * 取消烹饪
   */
  cancelCooking() {
    if (!this.isCooking) return

    // 重置烹饪状态
    this.isCooking = false
    this.cookingProgress = 0

    // 移除食物
    if (this.currentFood) {
      this.currentFood.remove()
      this.currentFood = null
    }

    // 重置当前食谱
    this.currentRecipe = null

    console.log(`${this.name} 取消烹饪`)
  }

  /**
   * 升级设备
   */
  upgrade() {
    // 检查玩家金钱是否足够
    if (this.game.player.money < this.upgradePrice) {
      console.log(`金钱不足，无法升级 ${this.name}`)
      return false
    }

    // 扣除金钱
    this.game.player.spendMoney(this.upgradePrice)

    // 升级设备
    this.level++

    // 更新升级价格
    this.upgradePrice = 200 * this.level

    console.log(`${this.name} 升级到 ${this.level} 级`)

    return true
  }

  /**
   * 获取设备信息
   */
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      level: this.level,
      cookTime: this.cookTime / this.level,
      recipes: this.recipes,
      upgradePrice: this.upgradePrice
    }
  }
}
