/**
 * 厨房类
 * 负责管理厨房的设备和食物制作流程
 */

import Equipment from './Equipment'
import Food from './Food'
import { EQUIPMENT_TYPES, RECIPE_DATA } from './GameData'

export default class Kitchen {
  constructor(game) {
    this.game = game

    // 厨房区域
    this.x = 0
    this.y = this.game.height * 0.4
    this.width = this.game.width * 0.6
    this.height = this.game.height * 0.6

    // 取餐台区域
    this.counterX = this.width
    this.counterY = this.y
    this.counterWidth = this.game.width * 0.4
    this.counterHeight = this.height * 0.3

    // 设备列表
    this.equipment = []

    // 食物列表
    this.foods = []

    // 取餐台上的食物
    this.counterFoods = []

    // 当前拖拽的食物
    this.draggingFood = null

    // 初始化厨房
    this.init()
  }

  /**
   * 初始化厨房
   */
  init() {
    // 创建已解锁的设备
    this.createEquipment()

    console.log('厨房初始化完成')
  }

  /**
   * 创建设备
   */
  createEquipment() {
    // 清空设备列表
    this.equipment = []

    // 获取已解锁的设备
    const unlockedEquipment = this.game.player.unlockedEquipment

    // 设备位置计算
    const equipmentWidth = this.width / 3
    const equipmentHeight = this.height / 2

    // 创建设备
    unlockedEquipment.forEach((equipmentId, index) => {
      // 获取设备数据
      const equipmentData = EQUIPMENT_TYPES.find(e => e.id === equipmentId)

      if (equipmentData) {
        // 计算设备位置
        const row = Math.floor(index / 3)
        const col = index % 3
        const x = col * equipmentWidth + equipmentWidth / 2
        const y = this.y + row * equipmentHeight + equipmentHeight / 2

        // 创建设备
        const equipment = new Equipment(
          this.game,
          equipmentId,
          equipmentData.name,
          equipmentData.type,
          x,
          y,
          equipmentWidth * 0.8,
          equipmentHeight * 0.8,
          equipmentData.cookTime,
          equipmentData.recipes
        )

        this.equipment.push(equipment)
      }
    })
  }

  /**
   * 更新设备
   */
  updateEquipment() {
    // 重新创建设备
    this.createEquipment()
  }

  /**
   * 更新厨房状态
   */
  update() {
    // 更新设备状态
    this.equipment.forEach(equipment => {
      equipment.update()
    })

    // 更新食物状态
    this.foods.forEach(food => {
      food.update()
    })

    // 移除已完成的食物
    this.foods = this.foods.filter(food => !food.isRemoved)

    // 更新取餐台上的食物
    this.counterFoods.forEach(food => {
      food.update()
    })

    // 移除已完成的食物
    this.counterFoods = this.counterFoods.filter(food => !food.isRemoved)
  }

  /**
   * 渲染厨房
   */
  render(ctx) {
    // 绘制厨房背景
    this.renderKitchenBackground(ctx)

    // 绘制设备
    this.equipment.forEach(equipment => {
      equipment.render(ctx)
    })

    // 绘制食物
    this.foods.forEach(food => {
      food.render(ctx)
    })

    // 绘制取餐台
    this.renderCounter(ctx)

    // 绘制取餐台上的食物
    this.counterFoods.forEach(food => {
      food.render(ctx)
    })

    // 绘制正在拖拽的食物
    if (this.draggingFood) {
      this.draggingFood.render(ctx)
    }
  }

  /**
   * 绘制厨房背景
   */
  renderKitchenBackground(ctx) {
    // 绘制厨房区域
    ctx.fillStyle = '#e0e0e0'
    ctx.fillRect(this.x, this.y, this.width, this.height)

    // 绘制厨房边框
    ctx.strokeStyle = '#999'
    ctx.lineWidth = 2
    ctx.strokeRect(this.x, this.y, this.width, this.height)
  }

  /**
   * 绘制取餐台
   */
  renderCounter(ctx) {
    // 绘制取餐台区域
    ctx.fillStyle = '#d0d0d0'
    ctx.fillRect(this.counterX, this.counterY, this.counterWidth, this.counterHeight)

    // 绘制取餐台边框
    ctx.strokeStyle = '#999'
    ctx.lineWidth = 2
    ctx.strokeRect(this.counterX, this.counterY, this.counterWidth, this.counterHeight)

    // 绘制取餐台标签
    ctx.fillStyle = '#333'
    ctx.font = '20px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('取餐台', this.counterX + this.counterWidth / 2, this.counterY + 20)
  }

  /**
   * 检查设备点击
   */
  checkTouchStart(x, y) {
    // 检查是否点击了设备
    for (const equipment of this.equipment) {
      if (equipment.containsPoint(x, y)) {
        equipment.onTap()
        return true
      }
    }

    return false
  }

  /**
   * 检查食物点击
   */
  checkFoodTouchStart(x, y) {
    // 检查是否点击了食物
    for (const food of this.foods) {
      if (food.containsPoint(x, y) && food.isCooked) {
        // 开始拖拽食物
        this.startDragFood(food)
        return true
      }
    }

    // 检查是否点击了取餐台上的食物
    for (const food of this.counterFoods) {
      if (food.containsPoint(x, y)) {
        // 开始拖拽食物
        this.startDragFood(food)
        return true
      }
    }

    return false
  }

  /**
   * 开始拖拽食物
   */
  startDragFood(food) {
    // 设置拖拽食物
    this.draggingFood = food

    // 从原列表中移除
    if (food.isOnCounter) {
      this.counterFoods = this.counterFoods.filter(f => f !== food)
    } else {
      this.foods = this.foods.filter(f => f !== food)
    }

    // 设置拖拽状态
    food.startDrag()
  }

  /**
   * 处理拖拽
   */
  handleDrag(x, y) {
    if (this.draggingFood) {
      // 更新拖拽食物位置
      this.draggingFood.setPosition(x, y)
    }
  }

  /**
   * 处理拖拽结束
   */
  handleDragEnd() {
    if (!this.draggingFood) return

    // 检查是否放在取餐台上
    if (this.isPointInCounter(this.draggingFood.x, this.draggingFood.y)) {
      // 放在取餐台上
      this.placeOnCounter(this.draggingFood)
    } else {
      // 放回原位置
      if (this.draggingFood.isOnCounter) {
        this.counterFoods.push(this.draggingFood)
      } else {
        this.foods.push(this.draggingFood)
      }
    }

    // 结束拖拽
    this.draggingFood.endDrag()
    this.draggingFood = null
  }

  /**
   * 检查点是否在取餐台上
   */
  isPointInCounter(x, y) {
    return x >= this.counterX &&
           x <= this.counterX + this.counterWidth &&
           y >= this.counterY &&
           y <= this.counterY + this.counterHeight
  }

  /**
   * 将食物放在取餐台上
   */
  placeOnCounter(food) {
    // 计算取餐台上的位置
    const counterFoodWidth = this.counterWidth / 4
    const counterFoodHeight = this.counterHeight / 2
    const row = Math.floor(this.counterFoods.length / 4)
    const col = this.counterFoods.length % 4
    const x = this.counterX + col * counterFoodWidth + counterFoodWidth / 2
    const y = this.counterY + row * counterFoodHeight + counterFoodHeight / 2 + 40

    // 设置食物位置
    food.setPosition(x, y)
    food.setOnCounter(true)

    // 添加到取餐台食物列表
    this.counterFoods.push(food)

    console.log(`食物 ${food.name} 放在取餐台上`)
  }

  /**
   * 创建食物
   */
  createFood(recipeId, equipment) {
    // 获取食谱数据
    const recipeData = RECIPE_DATA.find(r => r.id === recipeId)

    if (recipeData) {
      // 创建食物
      const food = new Food(
        this.game,
        recipeId,
        recipeData.name,
        recipeData.price,
        recipeData.cookTime,
        equipment.x,
        equipment.y,
        60,
        60
      )

      // 添加到食物列表
      this.foods.push(food)

      // 开始烹饪
      food.startCooking()

      console.log(`开始制作 ${recipeData.name}`)

      return food
    }

    return null
  }

  /**
   * 移除取餐台上的食物
   */
  removeCounterFood(food) {
    this.counterFoods = this.counterFoods.filter(f => f !== food)
  }

  /**
   * 获取取餐台上的食物
   */
  getCounterFoods() {
    return this.counterFoods
  }
}
