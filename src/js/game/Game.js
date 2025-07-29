/**
 * 游戏主类
 * 负责初始化游戏、管理游戏状态和主循环
 */

import Player from './Player'
import Kitchen from './Kitchen'
import CustomerManager from './CustomerManager'
import UI from './UI'
import CloudManager from './CloudManager'
import TimeManager from './TimeManager'
import ResourceManager from './ResourceManager'
import SoundManager from './SoundManager'

export default class Game {
  constructor() {
    console.log('《我的早餐店》游戏初始化')

    // 游戏状态
    this.isRunning = false
    this.isPaused = false

    // 游戏画布和上下文
    this.canvas = wx.createCanvas()
    this.ctx = this.canvas.getContext('2d')
    this.width = this.canvas.width
    this.height = this.canvas.height

    // 初始化资源管理器
    this.resourceManager = new ResourceManager()

    // 初始化声音管理器
    this.soundManager = new SoundManager()

    // 初始化云开发
    this.cloudManager = new CloudManager()

    // 初始化游戏组件
    this.init()
  }

  /**
   * 初始化游戏
   */
  async init() {
    try {
      // 加载资源
      await this.resourceManager.loadResources()

      // 初始化玩家
      this.player = new Player(this)

      // 初始化时间管理器
      this.timeManager = new TimeManager(this)

      // 初始化厨房
      this.kitchen = new Kitchen(this)

      // 初始化顾客管理器
      this.customerManager = new CustomerManager(this)

      // 初始化UI
      this.ui = new UI(this)

      // 注册事件监听
      this.registerEventListeners()

      // 开始游戏
      this.start()

      console.log('游戏初始化完成')
    } catch (error) {
      console.error('游戏初始化失败:', error)
    }
  }

  /**
   * 注册事件监听
   */
  registerEventListeners() {
    // 触摸事件
    wx.onTouchStart(this.onTouchStart.bind(this))
    wx.onTouchMove(this.onTouchMove.bind(this))
    wx.onTouchEnd(this.onTouchEnd.bind(this))

    // 游戏状态事件
    wx.onShow(this.onGameShow.bind(this))
    wx.onHide(this.onGameHide.bind(this))
  }

  /**
   * 开始游戏
   */
  start() {
    if (this.isRunning) return

    this.isRunning = true
    this.isPaused = false

    // 开始游戏循环
    this.gameLoop()

    // 开始营业
    this.timeManager.startBusinessDay()

    console.log('游戏开始')
  }

  /**
   * 暂停游戏
   */
  pause() {
    this.isPaused = true
    console.log('游戏暂停')
  }

  /**
   * 恢复游戏
   */
  resume() {
    this.isPaused = false
    console.log('游戏恢复')
  }

  /**
   * 结束游戏
   */
  end() {
    this.isRunning = false
    console.log('游戏结束')
  }

  /**
   * 游戏主循环
   */
  gameLoop() {
    if (!this.isRunning) return

    // 清空画布
    this.ctx.clearRect(0, 0, this.width, this.height)

    if (!this.isPaused) {
      // 更新游戏状态
      this.update()
    }

    // 渲染游戏画面
    this.render()

    // 继续下一帧
    requestAnimationFrame(this.gameLoop.bind(this))
  }

  /**
   * 更新游戏状态
   */
  update() {
    // 更新时间
    this.timeManager.update()

    // 更新厨房
    this.kitchen.update()

    // 更新顾客
    this.customerManager.update()

    // 更新UI
    this.ui.update()
  }

  /**
   * 渲染游戏画面
   */
  render() {
    // 渲染背景
    this.renderBackground()

    // 渲染厨房
    this.kitchen.render(this.ctx)

    // 渲染顾客
    this.customerManager.render(this.ctx)

    // 渲染UI
    this.ui.render(this.ctx)
  }

  /**
   * 渲染背景
   */
  renderBackground() {
    // 绘制背景色
    this.ctx.fillStyle = '#f5f5f5'
    this.ctx.fillRect(0, 0, this.width, this.height)

    // 绘制背景图
    const bgImage = this.resourceManager.getImage('background')
    if (bgImage) {
      this.ctx.drawImage(bgImage, 0, 0, this.width, this.height)
    }
  }

  /**
   * 触摸开始事件处理
   */
  onTouchStart(e) {
    if (!this.isRunning || this.isPaused) return

    const touch = e.touches[0]
    const x = touch.clientX
    const y = touch.clientY

    // 检查UI元素点击
    if (this.ui.checkTouchStart(x, y)) return

    // 检查厨房设备点击
    if (this.kitchen.checkTouchStart(x, y)) return

    // 检查食材点击
    if (this.kitchen.checkFoodTouchStart(x, y)) return
  }

  /**
   * 触摸移动事件处理
   */
  onTouchMove(e) {
    if (!this.isRunning || this.isPaused) return

    const touch = e.touches[0]
    const x = touch.clientX
    const y = touch.clientY

    // 处理拖拽事件
    this.kitchen.handleDrag(x, y)
  }

  /**
   * 触摸结束事件处理
   */
  onTouchEnd(e) {
    if (!this.isRunning || this.isPaused) return

    // 处理拖拽结束
    this.kitchen.handleDragEnd()
  }

  /**
   * 游戏显示事件处理
   */
  onGameShow() {
    if (this.isRunning && this.isPaused) {
      this.resume()
    }
  }

  /**
   * 游戏隐藏事件处理
   */
  onGameHide() {
    if (this.isRunning && !this.isPaused) {
      this.pause()
    }
  }
}
