/**
 * 顾客管理器类
 * 负责管理顾客的生成、行为和交互
 */

import Customer from './Customer'
import { CUSTOMER_TYPES } from './GameData'

export default class CustomerManager {
  constructor(game) {
    this.game = game

    // 顾客区域
    this.x = this.game.width * 0.6
    this.y = this.game.height * 0.4
    this.width = this.game.width * 0.4
    this.height = this.game.height * 0.7

    // 顾客列表
    this.customers = []

    // 顾客生成配置
    this.maxCustomers = 5 // 最大顾客数量
    this.spawnInterval = 15000 // 生成间隔（毫秒）
    this.lastSpawnTime = 0 // 上次生成时间

    // 顾客队列位置
    this.queuePositions = []

    // 初始化顾客管理器
    this.init()
  }

  /**
   * 初始化顾客管理器
   */
  init() {
    // 计算顾客队列位置
    this.calculateQueuePositions()

    console.log('顾客管理器初始化完成')
  }

  /**
   * 计算顾客队列位置
   */
  calculateQueuePositions() {
    // 清空队列位置
    this.queuePositions = []

    // 计算队列位置
    const customerWidth = 80
    const customerHeight = 120
    const spacing = 20

    // 计算可容纳的顾客数量
    const maxPerRow = Math.floor(this.width / (customerWidth + spacing))
    const maxRows = Math.floor(this.height / (customerHeight + spacing))
    const totalPositions = maxPerRow * maxRows

    // 生成队列位置
    for (let i = 0; i < totalPositions; i++) {
      const row = Math.floor(i / maxPerRow)
      const col = i % maxPerRow

      const x = this.x + col * (customerWidth + spacing) + customerWidth / 2 + spacing
      const y = this.y + row * (customerHeight + spacing) + customerHeight / 2 + spacing

      this.queuePositions.push({ x, y })
    }

    // 更新最大顾客数量
    this.maxCustomers = Math.min(this.maxCustomers, this.queuePositions.length)
  }

  /**
   * 更新顾客状态
   */
  update() {
    // 检查是否需要生成新顾客
    this.checkSpawnCustomer()

    // 更新所有顾客
    this.customers.forEach(customer => {
      customer.update()
    })

    // 移除已离开的顾客
    this.customers = this.customers.filter(customer => !customer.isRemoved)

    // 更新顾客队列位置
    this.updateCustomerPositions()
  }

  /**
   * 渲染顾客
   */
  render(ctx) {
    // 绘制顾客区域背景
    this.renderCustomerArea(ctx)

    // 绘制所有顾客
    this.customers.forEach(customer => {
      customer.render(ctx)
    })
  }

  /**
   * 绘制顾客区域背景
   */
  renderCustomerArea(ctx) {
    // 绘制顾客区域
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(this.x, this.y, this.width, this.height)

    // 绘制顾客区域边框
    ctx.strokeStyle = '#999'
    ctx.lineWidth = 2
    ctx.strokeRect(this.x, this.y, this.width, this.height)

    // 绘制顾客区域标签
    ctx.fillStyle = '#333'
    ctx.font = '20px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('顾客区域', this.x + this.width / 2, this.y + 20)
  }

  /**
   * 检查是否需要生成新顾客
   */
  checkSpawnCustomer() {
    // 检查是否达到最大顾客数量
    if (this.customers.length >= this.maxCustomers) return

    // 检查是否到达生成间隔
    const currentTime = this.game.timeManager.getCurrentTime()
    if (currentTime - this.lastSpawnTime < this.spawnInterval) return

    // 检查是否在营业时间
    if (!this.game.timeManager.isBusinessHours()) return

    // 生成新顾客
    this.spawnCustomer()

    // 更新上次生成时间
    this.lastSpawnTime = currentTime

    // 根据游戏进度和声誉调整生成间隔
    this.adjustSpawnInterval()
  }

  /**
   * 调整顾客生成间隔
   */
  adjustSpawnInterval() {
    // 基础间隔
    let baseInterval = 15000

    // 根据声誉调整
    const reputationFactor = Math.max(0.5, Math.min(2, 1 + this.game.player.reputation / 100))

    // 根据游戏天数调整
    const daysFactor = Math.max(0.5, Math.min(1.5, 1 - this.game.player.stats.totalDaysPlayed / 30))

    // 根据时间段调整
    const hourFactor = this.getHourFactor()

    // 计算最终间隔
    this.spawnInterval = baseInterval * daysFactor * reputationFactor * hourFactor

    // 限制最小和最大间隔
    this.spawnInterval = Math.max(5000, Math.min(30000, this.spawnInterval))
  }

  /**
   * 获取时间段因子
   */
  getHourFactor() {
    const currentHour = this.game.timeManager.getCurrentHour()

    // 早高峰 (7-9点)
    if (currentHour >= 7 && currentHour < 9) {
      return 0.6 // 更频繁的顾客
    }

    // 午高峰 (12-13点)
    if (currentHour >= 12 && currentHour < 13) {
      return 0.7
    }

    // 非高峰时段
    return 1.2
  }

  /**
   * 生成新顾客
   */
  spawnCustomer() {
    // 获取可用的队列位置
    const availablePosition = this.getAvailablePosition()
    if (!availablePosition) return

    // 随机选择顾客类型
    const customerType = this.getRandomCustomerType()

    // 创建新顾客
    const customer = new Customer(
      this.game,
      customerType.id,
      customerType.name,
      customerType.patience,
      customerType.spendingMultiplier,
      availablePosition.x,
      availablePosition.y
    )

    // 添加到顾客列表
    this.customers.push(customer)

    // 更新玩家统计数据
    this.game.player.updateStats('totalCustomers', 1)

    // 播放顾客到达音效
    this.game.soundManager.playSound('customer_arrive')

    console.log(`新顾客到达: ${customerType.name}`)
  }

  /**
   * 获取随机顾客类型
   */
  getRandomCustomerType() {
    // 根据玩家声誉和等级调整顾客类型概率
    const reputation = this.game.player.reputation
    const level = this.game.player.level

    // 计算各类型顾客的权重
    const weights = CUSTOMER_TYPES.map(type => {
      let weight = type.baseWeight

      // 根据声誉调整
      if (type.id === 'vip' || type.id === 'critic') {
        weight *= (1 + reputation / 200)
      }

      // 根据等级调整
      if (type.id === 'vip') {
        weight *= (1 + level / 20)
      }

      return weight
    })

    // 计算总权重
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

    // 随机选择
    let random = Math.random() * totalWeight
    let cumulativeWeight = 0

    for (let i = 0; i < CUSTOMER_TYPES.length; i++) {
      cumulativeWeight += weights[i]
      if (random < cumulativeWeight) {
        return CUSTOMER_TYPES[i]
      }
    }

    // 默认返回普通顾客
    return CUSTOMER_TYPES[0]
  }

  /**
   * 获取可用的队列位置
   */
  getAvailablePosition() {
    // 检查是否有空闲位置
    for (const position of this.queuePositions) {
      // 检查该位置是否已被占用
      const isOccupied = this.customers.some(customer =>
        customer.targetX === position.x && customer.targetY === position.y
      )

      if (!isOccupied) {
        return position
      }
    }

    return null
  }

  /**
   * 更新顾客队列位置
   */
  updateCustomerPositions() {
    // 按照队列位置索引排序顾客
    this.customers.sort((a, b) => {
      const aIndex = this.getPositionIndex(a.targetX, a.targetY)
      const bIndex = this.getPositionIndex(b.targetX, b.targetY)
      return aIndex - bIndex
    })

    // 重新分配队列位置
    this.customers.forEach((customer, index) => {
      if (index < this.queuePositions.length) {
        const position = this.queuePositions[index]
        customer.setTargetPosition(position.x, position.y)
      }
    })
  }

  /**
   * 获取位置在队列中的索引
   */
  getPositionIndex(x, y) {
    for (let i = 0; i < this.queuePositions.length; i++) {
      const position = this.queuePositions[i]
      if (position.x === x && position.y === y) {
        return i
      }
    }
    return -1
  }

  /**
   * 移除顾客
   */
  removeCustomer(customer) {
    this.customers = this.customers.filter(c => c !== customer)

    // 更新顾客队列位置
    this.updateCustomerPositions()
  }

  /**
   * 获取顾客列表
   */
  getCustomers() {
    return this.customers
  }

  /**
   * 获取等待中的顾客数量
   */
  getWaitingCustomerCount() {
    return this.customers.filter(customer => customer.isWaiting()).length
  }

  /**
   * 获取最前面的等待顾客
   */
  getFirstWaitingCustomer() {
    // 按照队列位置索引排序顾客
    const waitingCustomers = this.customers.filter(customer => customer.isWaiting())

    if (waitingCustomers.length > 0) {
      return waitingCustomers[0]
    }

    return null
  }
}
