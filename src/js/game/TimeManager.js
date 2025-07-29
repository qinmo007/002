/**
 * 时间管理器类
 * 负责管理游戏中的时间系统，包括游戏内时间、营业时间等
 */

export default class TimeManager {
  constructor(game) {
    this.game = game

    // 游戏时间
    this.gameTime = 0 // 游戏运行总时间（毫秒）
    this.deltaTime = 0 // 帧间隔时间（毫秒）
    this.lastFrameTime = 0 // 上一帧时间

    // 游戏内时间
    this.day = 1 // 游戏天数
    this.hour = 6 // 当前小时（24小时制）
    this.minute = 0 // 当前分钟

    // 时间流逝速度
    this.timeScale = 60 // 游戏内1分钟 = 现实1秒

    // 营业时间
    this.openingHour = 7 // 开店时间
    this.closingHour = 21 // 关店时间

    // 营业状态
    this.isOpen = false

    // 日收入统计
    this.dayEarnings = 0
    this.dayCustomers = 0

    // 初始化时间
    this.init()
  }

  /**
   * 初始化时间
   */
  init() {
    // 设置初始时间
    this.lastFrameTime = Date.now()

    console.log('时间管理器初始化完成')
  }

  /**
   * 更新时间
   */
  update() {
    // 计算帧间隔时间
    const currentTime = Date.now()
    this.deltaTime = currentTime - this.lastFrameTime
    this.lastFrameTime = currentTime

    // 更新游戏总时间
    this.gameTime += this.deltaTime

    // 更新游戏内时间
    this.updateGameTime()

    // 检查营业状态
    this.checkBusinessHours()
  }

  /**
   * 更新游戏内时间
   */
  updateGameTime() {
    // 计算游戏内时间流逝
    const minutesElapsed = (this.deltaTime / 1000) * this.timeScale

    // 更新分钟
    this.minute += minutesElapsed

    // 处理分钟溢出
    if (this.minute >= 60) {
      this.hour += Math.floor(this.minute / 60)
      this.minute %= 60

      // 每小时触发事件
      this.onHourChanged()
    }

    // 处理小时溢出
    if (this.hour >= 24) {
      this.day += Math.floor(this.hour / 24)
      this.hour %= 24

      // 每天触发事件
      this.onDayChanged()
    }
  }

  /**
   * 检查营业状态
   */
  checkBusinessHours() {
    const wasOpen = this.isOpen

    // 检查是否在营业时间
    this.isOpen = this.hour >= this.openingHour && this.hour < this.closingHour

    // 状态变化时触发事件
    if (wasOpen !== this.isOpen) {
      if (this.isOpen) {
        this.onBusinessOpen()
      } else {
        this.onBusinessClose()
      }
    }
  }

  /**
   * 小时变化事件
   */
  onHourChanged() {
    console.log(`当前时间: ${this.day}天 ${this.hour}:${Math.floor(this.minute).toString().padStart(2, '0')}`)

    // 根据时间触发特殊事件
    this.checkTimeEvents()
  }

  /**
   * 天数变化事件
   */
  onDayChanged() {
    console.log(`新的一天开始了！当前是第 ${this.day} 天`)

    // 结算前一天的收益
    this.endBusinessDay()

    // 开始新的一天
    this.startBusinessDay()

    // 更新玩家统计数据
    this.game.player.updateStats('totalDaysPlayed', 1)
  }

  /**
   * 开店事件
   */
  onBusinessOpen() {
    console.log('早餐店开始营业！')

    // 播放开店音效
    this.game.soundManager.playSound('store_open')

    // 显示开店提示
    this.game.ui.showNotification('早餐店开始营业！')
  }

  /**
   * 关店事件
   */
  onBusinessClose() {
    console.log('早餐店结束营业！')

    // 播放关店音效
    this.game.soundManager.playSound('store_close')

    // 显示关店提示
    this.game.ui.showNotification('早餐店结束营业！')

    // 清空顾客队列
    this.clearCustomers()
  }

  /**
   * 检查时间特殊事件
   */
  checkTimeEvents() {
    // 早高峰提示（7点）
    if (this.hour === 7 && this.minute < 1) {
      this.game.ui.showNotification('早高峰即将到来，准备好迎接顾客吧！')
    }

    // 午高峰提示（12点）
    if (this.hour === 12 && this.minute < 1) {
      this.game.ui.showNotification('午高峰即将到来，准备好迎接顾客吧！')
    }

    // 关店前提示（20点）
    if (this.hour === 20 && this.minute < 1) {
      this.game.ui.showNotification('还有1小时就要关店了！')
    }
  }

  /**
   * 开始营业日
   */
  startBusinessDay() {
    // 重置日收入统计
    this.dayEarnings = 0
    this.dayCustomers = 0

    console.log('开始新的营业日')
  }

  /**
   * 结束营业日
   */
  endBusinessDay() {
    console.log(`营业日结束！今日收入: ${this.dayEarnings}，接待顾客: ${this.dayCustomers}`)

    // 更新最佳日收入记录
    if (this.dayEarnings > this.game.player.stats.bestDayEarnings) {
      this.game.player.stats.bestDayEarnings = this.dayEarnings
    }

    // 更新最佳日顾客数记录
    if (this.dayCustomers > this.game.player.stats.bestDayCustomers) {
      this.game.player.stats.bestDayCustomers = this.dayCustomers
    }

    // 显示日结算界面
    this.game.ui.showDaySummary(this.day, this.dayEarnings, this.dayCustomers)

    // 保存游戏数据
    this.game.player.savePlayerData()
  }

  /**
   * 清空顾客队列
   */
  clearCustomers() {
    // 让所有顾客离开
    const customers = this.game.customerManager.getCustomers()
    customers.forEach(customer => {
      if (customer.state !== 'leaving' && customer.state !== 'left') {
        customer.setState('leaving')
        customer.showBubble('店铺关门了，我要回家了')
      }
    })
  }

  /**
   * 添加日收入
   */
  addDayEarnings(amount) {
    this.dayEarnings += amount
  }

  /**
   * 添加日顾客数
   */
  addDayCustomers(count) {
    this.dayCustomers += count
  }

  /**
   * 获取当前时间字符串
   */
  getTimeString() {
    const hourStr = this.hour.toString().padStart(2, '0')
    const minuteStr = Math.floor(this.minute).toString().padStart(2, '0')
    return `${hourStr}:${minuteStr}`
  }

  /**
   * 获取当前日期字符串
   */
  getDateString() {
    return `第 ${this.day} 天`
  }

  /**
   * 获取帧间隔时间
   */
  getDeltaTime() {
    return this.deltaTime
  }

  /**
   * 获取当前时间（毫秒）
   */
  getCurrentTime() {
    return this.gameTime
  }

  /**
   * 获取当前小时
   */
  getCurrentHour() {
    return this.hour
  }

  /**
   * 获取当前分钟
   */
  getCurrentMinute() {
    return this.minute
  }

  /**
   * 获取当前天数
   */
  getCurrentDay() {
    return this.day
  }

  /**
   * 检查是否在营业时间
   */
  isBusinessHours() {
    return this.isOpen
  }

  /**
   * 获取日收入
   */
  getDayEarnings() {
    return this.dayEarnings
  }

  /**
   * 获取日顾客数
   */
  getDayCustomers() {
    return this.dayCustomers
  }

  /**
   * 设置时间流逝速度
   */
  setTimeScale(scale) {
    this.timeScale = Math.max(1, Math.min(120, scale))
    console.log(`时间流逝速度设置为: ${this.timeScale}`)
  }
}
/**