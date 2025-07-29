/**
 * 游戏主逻辑类
 * 负责游戏核心机制、状态管理和渲染
 */

// 游戏配置
const CONFIG = {
  MAX_CUSTOMERS: 5,
  CUSTOMER_SPAWN_INTERVAL: 10, // 秒
  INITIAL_MONEY: 100,
  FOOD_TYPES: ['fried_egg', 'toast', 'coffee', 'bacon'],
  CUSTOMER_PATIENCE: {
    normal: 20,
    hurry: 15,
    relax: 30
  }
}

// 游戏主类
export class Game {
  constructor(canvas, ctx) {
    // 画布和上下文
    this.canvas = canvas
    this.ctx = ctx
    
    // 游戏状态
    this.isRunning = false
    this.isPaused = false
    this.gameTime = 0
    this.lastTimestamp = 0
    
    // 游戏数据
    this.customers = []
    this.orders = []
    this.foods = []
    this.playerMoney = CONFIG.INITIAL_MONEY
    this.playerLevel = 1
    this.playerExp = 0
    
    // 设备状态
    this.equipment = {
      fryer: { level: 1, cooking: false, cookTime: 5000 },
      toaster: { level: 1, cooking: false, cookTime: 4000 },
      coffeeMaker: { level: 1, cooking: false, cookTime: 3000 }
    }
    
    // 游戏统计
    this.stats = {
      ordersCompleted: 0,
      ordersFailed: 0,
      moneyEarned: 0
    }
    
    // 触摸状态
    this.touchState = {
      isDragging: false,
      draggedItem: null,
      startPos: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 }
    }
  }
  
  // 初始化游戏
  async init() {
    // 初始化游戏状态
    this.reset()
    return true
  }
  
  // 重置游戏状态
  reset() {
    this.customers = []
    this.orders = []
    this.foods = []
    this.playerMoney = CONFIG.INITIAL_MONEY
    this.gameTime = 0
    this.stats = {
      ordersCompleted: 0,
      ordersFailed: 0,
      moneyEarned: 0
    }
  }
  
  // 启动游戏
  start() {
    if (!this.isRunning) {
      this.isRunning = true
      this.isPaused = false
      this.lastTimestamp = Date.now()
      this.gameLoop()
    }
  }
  
  // 暂停游戏
  pause() {
    this.isPaused = true
  }
  
  // 恢复游戏
  resume() {
    if (this.isRunning && this.isPaused) {
      this.isPaused = false
      this.lastTimestamp = Date.now()
      this.gameLoop()
    }
  }
  
  // 游戏主循环
  gameLoop() {
    if (!this.isRunning || this.isPaused) {
      return
    }
    
    // 计算时间增量
    const now = Date.now()
    const deltaTime = (now - this.lastTimestamp) / 1000 // 转换为秒
    this.lastTimestamp = now
    
    // 更新游戏状态
    this.update(deltaTime)
    
    // 渲染游戏
    this.render()
    
    // 请求下一帧
    requestAnimationFrame(() => this.gameLoop())
  }
  
  // 更新游戏状态
  update(deltaTime) {
    // 更新游戏时间
    this.gameTime += deltaTime
    
    // 生成顾客
    this.updateCustomerSpawn(deltaTime)
    
    // 更新订单状态
    this.updateOrders(deltaTime)
    
    // 更新食物状态
    this.updateFoods(deltaTime)
  }
  
  // 生成顾客
  updateCustomerSpawn(deltaTime) {
    // 每隔一段时间生成一个顾客
    if (this.gameTime % CONFIG.CUSTOMER_SPAWN_INTERVAL < deltaTime && 
        this.customers.length < CONFIG.MAX_CUSTOMERS) {
      const newCustomer = this.createCustomer()
      this.customers.push(newCustomer)
      
      // 创建对应的订单
      const newOrder = this.generateOrder(newCustomer)
      this.orders.push(newOrder)
    }
  }
  
  // 创建顾客
  createCustomer() {
    // 随机顾客类型
    const types = ['normal', 'hurry', 'relax']
    const type = types[Math.floor(Math.random() * types.length)]
    
    // 计算顾客位置
    const position = this.getAvailableCustomerPosition()
    
    return {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      type: type,
      mood: 100, // 心情值，100为最好
      position: position,
      arrivalTime: this.gameTime
    }
  }
  
  // 获取可用的顾客位置
  getAvailableCustomerPosition() {
    // 简单实现：固定几个位置，选择一个没有被占用的
    const positions = [
      { x: 50, y: this.canvas.height - 150 },
      { x: 150, y: this.canvas.height - 150 },
      { x: 250, y: this.canvas.height - 150 },
      { x: 350, y: this.canvas.height - 150 },
      { x: 450, y: this.canvas.height - 150 }
    ]
    
    // 过滤掉已被占用的位置
    const availablePositions = positions.filter(pos => {
      return !this.customers.some(customer => 
        customer.position.x === pos.x && customer.position.y === pos.y)
    })
    
    // 如果有可用位置，随机选择一个
    if (availablePositions.length > 0) {
      return availablePositions[Math.floor(Math.random() * availablePositions.length)]
    }
    
    // 如果没有可用位置，返回默认位置
    return { x: 0, y: this.canvas.height - 150 }
  }
  
  // 生成订单
  generateOrder(customer) {
    // 随机选择食物类型
    const foodType = CONFIG.FOOD_TYPES[Math.floor(Math.random() * CONFIG.FOOD_TYPES.length)]
    
    // 根据顾客类型设置时间限制
    const timeLimit = CONFIG.CUSTOMER_PATIENCE[customer.type]
    
    return {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      customerId: customer.id,
      type: foodType,
      timeLimit: timeLimit,
      timeLeft: timeLimit,
      status: 'waiting', // waiting, completed, failed
      reward: this.calculateOrderReward(foodType, customer.type)
    }
  }
  
  // 计算订单奖励
  calculateOrderReward(foodType, customerType) {
    // 基础奖励
    let baseReward = 0
    
    switch (foodType) {
      case 'fried_egg':
        baseReward = 5
        break
      case 'toast':
        baseReward = 4
        break
      case 'coffee':
        baseReward = 3
        break
      case 'bacon':
        baseReward = 6
        break
      default:
        baseReward = 5
    }
    
    // 根据顾客类型调整奖励
    let multiplier = 1.0
    
    switch (customerType) {
      case 'hurry':
        multiplier = 1.5 // 急匆匆的顾客给更多小费
        break
      case 'relax':
        multiplier = 0.8 // 悠闲的顾客给较少小费
        break
    }
    
    return Math.floor(baseReward * multiplier)
  }
  
  // 更新订单状态
  updateOrders(deltaTime) {
    this.orders.forEach(order => {
      if (order.status === 'waiting') {
        // 减少剩余时间
        order.timeLeft -= deltaTime
        
        // 检查是否超时
        if (order.timeLeft <= 0) {
          this.handleOrderTimeout(order)
        }
      }
    })
  }
  
  // 处理订单超时
  handleOrderTimeout(order) {
    // 更新订单状态
    order.status = 'failed'
    
    // 更新统计数据
    this.stats.ordersFailed++
    
    // 更新顾客状态
    const customer = this.customers.find(c => c.id === order.customerId)
    if (customer) {
      customer.mood = 0 // 心情变差
      
      // 顾客离开
      setTimeout(() => {
        this.removeCustomer(customer.id)
      }, 2000)
    }
  }
  
  // 处理订单完成
  handleOrderComplete(orderId, foodId) {
    const order = this.orders.find(o => o.id === orderId)
    if (!order || order.status !== 'waiting') return
    
    // 更新订单状态
    order.status = 'completed'
    
    // 更新统计数据
    this.stats.ordersCompleted++
    this.stats.moneyEarned += order.reward
    
    // 增加玩家金钱
    this.playerMoney += order.reward
    
    // 更新顾客状态
    const customer = this.customers.find(c => c.id === order.customerId)
    if (customer) {
      customer.mood = 100 // 心情变好
      
      // 顾客离开
      setTimeout(() => {
        this.removeCustomer(customer.id)
      }, 2000)
    }
    
    // 移除使用过的食物
    if (foodId) {
      this.removeFood(foodId)
    }
  }
  
  // 移除顾客
  removeCustomer(customerId) {
    this.customers = this.customers.filter(c => c.id !== customerId)
  }
  
  // 移除食物
  removeFood(foodId) {
    this.foods = this.foods.filter(f => f.id !== foodId)
  }
  
  // 更新食物状态
  updateFoods(deltaTime) {
    this.foods.forEach(food => {
      if (food.status === 'cooking') {
        // 更新烹饪进度
        food.cookProgress += deltaTime * 1000 / food.cookTime * 100
        
        // 检查是否烹饪完成
        if (food.cookProgress >= 100) {
          food.status = 'ready'
          food.cookProgress = 100
        }
      }
    })
  }
  
  // 创建食物
  createFood(type, equipmentType) {
    const equipment = this.equipment[equipmentType]
    
    const food = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      type: type,
      status: 'cooking', // cooking, ready, spoiled
      cookProgress: 0,
      cookTime: equipment.cookTime / equipment.level, // 设备等级越高，烹饪越快
      position: { x: 0, y: 0 } // 位置将在渲染时设置
    }
    
    this.foods.push(food)
    
    // 设置设备状态
    equipment.cooking = true
    
    // 烹饪完成后重置设备状态
    setTimeout(() => {
      equipment.cooking = false
    }, food.cookTime)
    
    return food
  }
  
  // 处理触摸开始事件
  handleTouchStart(event) {
    const touch = event.touches[0]
    const touchPos = { x: touch.clientX, y: touch.clientY }
    
    // 检查是否点击了食物
    const touchedFood = this.foods.find(food => 
      food.status === 'ready' && this.isPointInRect(touchPos, food.position, 50, 50)
    )
    
    if (touchedFood) {
      this.touchState.isDragging = true
      this.touchState.draggedItem = touchedFood
      this.touchState.startPos = touchPos
      this.touchState.currentPos = touchPos
    }
  }
  
  // 处理触摸移动事件
  handleTouchMove(event) {
    if (!this.touchState.isDragging) return
    
    const touch = event.touches[0]
    this.touchState.currentPos = { x: touch.clientX, y: touch.clientY }
    
    // 更新被拖拽食物的位置
    if (this.touchState.draggedItem) {
      this.touchState.draggedItem.position = this.touchState.currentPos
    }
  }
  
  // 处理触摸结束事件
  handleTouchEnd(event) {
    if (!this.touchState.isDragging) return
    
    const touch = event.changedTouches[0]
    const touchPos = { x: touch.clientX, y: touch.clientY }
    
    // 检查是否放在了顾客上
    if (this.touchState.draggedItem) {
      const food = this.touchState.draggedItem
      
      // 检查每个顾客
      for (const customer of this.customers) {
        if (this.isPointInRect(touchPos, customer.position, 100, 150)) {
          // 检查该顾客的订单
          const order = this.orders.find(o => 
            o.customerId === customer.id && o.status === 'waiting'
          )
          
          if (order && order.type === food.type) {
            // 订单匹配，完成订单
            this.handleOrderComplete(order.id, food.id)
            break
          }
        }
      }
    }
    
    // 重置触摸状态
    this.touchState.isDragging = false
    this.touchState.draggedItem = null
  }
  
  // 检查点是否在矩形内
  isPointInRect(point, rectPos, rectWidth, rectHeight) {
    return (
      point.x >= rectPos.x - rectWidth / 2 &&
      point.x <= rectPos.x + rectWidth / 2 &&
      point.y >= rectPos.y - rectHeight / 2 &&
      point.y <= rectPos.y + rectHeight / 2
    )
  }
  
  // 增加经验值
  addExperience(amount) {
    this.playerExp += amount
    
    // 检查是否升级
    const expNeeded = this.playerLevel * 100
    if (this.playerExp >= expNeeded) {
      this.playerExp -= expNeeded
      this.playerLevel++
      
      // 升级奖励
      this.playerMoney += this.playerLevel * 10
    }
  }
  
  // 渲染游戏
  render() {
    if (!this.ctx) return
    
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // 绘制背景
    this.renderBackground()
    
    // 绘制厨房设备
    this.renderEquipment()
    
    // 绘制食物
    this.renderFoods()
    
    // 绘制顾客
    this.renderCustomers()
    
    // 绘制订单
    this.renderOrders()
    
    // 绘制UI
    this.renderUI()
  }
  
  // 渲染背景
  renderBackground() {
    if (!this.ctx) return
    
    // 绘制背景色
    this.ctx.fillStyle = '#f5f5f5'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    // 绘制柜台
    this.ctx.fillStyle = '#8d6e63'
    this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50)
  }
  
  // 渲染厨房设备
  renderEquipment() {
    if (!this.ctx) return
    
    // 设备位置
    const equipmentPositions = {
      fryer: { x: this.canvas.width * 0.2, y: this.canvas.height - 80 },
      toaster: { x: this.canvas.width * 0.5, y: this.canvas.height - 80 },
      coffeeMaker: { x: this.canvas.width * 0.8, y: this.canvas.height - 80 }
    }
    
    // 绘制炸锅
    this.ctx.fillStyle = this.equipment.fryer.cooking ? '#ffeb3b' : '#ffffff'
    this.ctx.fillRect(
      equipmentPositions.fryer.x - 30,
      equipmentPositions.fryer.y - 30,
      60, 60
    )
    
    // 绘制烤面包机
    this.ctx.fillStyle = this.equipment.toaster.cooking ? '#ffeb3b' : '#ffffff'
    this.ctx.fillRect(
      equipmentPositions.toaster.x - 30,
      equipmentPositions.toaster.y - 30,
      60, 60
    )
    
    // 绘制咖啡机
    this.ctx.fillStyle = this.equipment.coffeeMaker.cooking ? '#ffeb3b' : '#ffffff'
    this.ctx.fillRect(
      equipmentPositions.coffeeMaker.x - 30,
      equipmentPositions.coffeeMaker.y - 30,
      60, 60
    )
  }
  
  // 渲染食物
  renderFoods() {
    if (!this.ctx) return
    
    this.foods.forEach(food => {
      // 根据状态设置样式
      switch (food.status) {
        case 'cooking':
          this.ctx.globalAlpha = 0.7
          break
        case 'ready':
          this.ctx.globalAlpha = 1.0
          break
        case 'spoiled':
          this.ctx.globalAlpha = 0.5
          break
      }
      
      // 绘制食物
      this.ctx.fillStyle = '#ffffff'
      this.ctx.beginPath()
      this.ctx.arc(food.position.x, food.position.y, 20, 0, Math.PI * 2)
      this.ctx.fill()
      
      // 绘制食物类型标识
      this.ctx.fillStyle = this.getFoodColor(food.type)
      this.ctx.beginPath()
      this.ctx.arc(food.position.x, food.position.y, 15, 0, Math.PI * 2)
      this.ctx.fill()
      
      // 如果正在烹饪，绘制进度条
      if (food.status === 'cooking') {
        this.ctx.fillStyle = '#ff9800'
        this.ctx.fillRect(
          food.position.x - 15,
          food.position.y + 25,
          30 * (food.cookProgress / 100),
          5
        )
      }
      
      // 重置透明度
      this.ctx.globalAlpha = 1.0
    })
  }
  
  // 获取食物颜色
  getFoodColor(type) {
    switch (type) {
      case 'fried_egg': return '#ffeb3b'
      case 'toast': return '#8d6e63'
      case 'coffee': return '#3e2723'
      case 'bacon': return '#ff5722'
      default: return '#ffffff'
    }
  }
  
  // 渲染顾客
  renderCustomers() {
    if (!this.ctx) return
    
    this.customers.forEach(customer => {
      // 绘制顾客
      this.ctx.fillStyle = this.getCustomerColor(customer.type)
      this.ctx.fillRect(
        customer.position.x - 30,
        customer.position.y - 75,
        60, 75
      )
      
      // 绘制心情指示器
      this.ctx.fillStyle = this.getMoodColor(customer.mood)
      this.ctx.fillRect(
        customer.position.x - 30,
        customer.position.y + 5,
        60 * (customer.mood / 100),
        5
      )
    })
  }
  
  // 获取顾客颜色
  getCustomerColor(type) {
    switch (type) {
      case 'normal': return '#2196f3'
      case 'hurry': return '#f44336'
      case 'relax': return '#4caf50'
      default: return '#2196f3'
    }
  }
  
  // 获取心情颜色
  getMoodColor(mood) {
    if (mood > 70) return '#4caf50'
    if (mood > 30) return '#ff9800'
    return '#f44336'
  }
  
  // 渲染订单
  renderOrders() {
    if (!this.ctx) return
    
    this.orders.forEach(order => {
      // 找到对应的顾客
      const customer = this.customers.find(c => c.id === order.customerId)
      if (!customer) return
      
      // 绘制订单气泡
      this.ctx.fillStyle = '#ffffff'
      this.ctx.beginPath()
      this.ctx.arc(customer.position.x, customer.position.y - 100, 25, 0, Math.PI * 2)
      this.ctx.fill()
      
      // 绘制订单内容
      this.ctx.fillStyle = this.getFoodColor(order.type)
      this.ctx.beginPath()
      this.ctx.arc(customer.position.x, customer.position.y - 100, 15, 0, Math.PI * 2)
      this.ctx.fill()
      
      // 绘制订单计时器
      this.ctx.fillStyle = this.getTimerColor(order.timeLeft / order.timeLimit)
      this.ctx.fillRect(
        customer.position.x - 20,
        customer.position.y - 70,
        40 * (order.timeLeft / order.timeLimit),
        5
      )
    })
  }
  
  // 获取计时器颜色
  getTimerColor(timeRatio) {
    if (timeRatio > 0.6) return '#4caf50'
    if (timeRatio > 0.3) return '#ff9800'
    return '#f44336'
  }
  
  // 渲染UI
  renderUI() {
    if (!this.ctx) return
    
    // 绘制顶部状态栏背景
    this.ctx.fillStyle = '#333333'
    this.ctx.fillRect(0, 0, this.canvas.width, 60)
    
    // 绘制金钱
    this.ctx.fillStyle = '#ffeb3b'
    this.ctx.font = '18px Arial'
    this.ctx.textAlign = 'left'
    this.ctx.fillText(`$${this.playerMoney}`, 20, 30)
    
    // 绘制等级
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '14px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(`等级 ${this.playerLevel}`, this.canvas.width / 2, 20)
    
    // 绘制经验条
    this.ctx.fillStyle = '#555555'
    this.ctx.fillRect(this.canvas.width / 2 - 50, 30, 100, 6)
    this.ctx.fillStyle = '#2196f3'
    this.ctx.fillRect(
      this.canvas.width / 2 - 50,
      30,
      100 * (this.playerExp / (this.playerLevel * 100)),
      6
    )
    
    // 绘制统计信息
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '12px Arial'
    this.ctx.textAlign = 'right'
    this.ctx.fillText(`完成: ${this.stats.ordersCompleted}`, this.canvas.width - 20, 20)
    this.ctx.fillText(`失败: ${this.stats.ordersFailed}`, this.canvas.width - 20, 40)
  }