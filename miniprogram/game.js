/**
 * 微信小程序游戏入口文件
 * 负责初始化云开发并启动游戏
 */

// 导入游戏主类
import { Game } from './js/main.js'

// 游戏全局变量
let game = null

// 初始化云开发
function initCloud() {
  if (!wx.cloud) {
    console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    return false
  }

  wx.cloud.init({
    env: 'breakfast-shop-xxxxx', // 云开发环境ID
    traceUser: true
  })

  console.log('云开发初始化成功')
  return true
}

// 初始化游戏
function initGame() {
  // 获取系统信息
  const systemInfo = wx.getSystemInfoSync()

  // 获取可用屏幕宽高
  const screenWidth = systemInfo.windowWidth
  const screenHeight = systemInfo.windowHeight

  // 创建画布
  const canvas = wx.createCanvas()
  canvas.width = screenWidth
  canvas.height = screenHeight

  // 获取2D渲染上下文
  const ctx = canvas.getContext('2d')

  // 创建游戏实例
  game = new Game(canvas, ctx)

  // 初始化游戏
  game.init().then(() => {
    // 启动游戏主循环
    game.start()

    console.log('游戏启动成功')
  }).catch(error => {
    console.error('游戏初始化失败:', error)
  })

  // 监听触摸事件
  wx.onTouchStart(event => {
    game.handleTouchStart(event)
  })

  wx.onTouchMove(event => {
    game.handleTouchMove(event)
  })

  wx.onTouchEnd(event => {
    game.handleTouchEnd(event)
  })

  // 监听小程序生命周期
  wx.onShow(() => {
    if (game) {
      game.resume()
    }
  })

  wx.onHide(() => {
    if (game) {
      game.pause()
    }
  })

  // 监听小程序内存警告
  wx.onMemoryWarning(() => {
    console.warn('内存警告')
    if (game) {
      game.handleMemoryWarning()
    }
  })
}

// 导出游戏模块
export default {
  // 初始化函数
  init: function() {
    // 初始化云开发
    const cloudInitSuccess = initCloud()

    // 初始化游戏
    initGame()

    return {
      game: game,
      cloudInitSuccess: cloudInitSuccess
    }
  },

  // 获取游戏实例
  getGame: function() {
    return game
  },

  // 创建游戏页面
  createPage: function(pageOptions) {
    return Page({
      data: {
        gameLoaded: false,
        gameStarted: false,
        gamePaused: false,
        money: 0,
        level: 1,
        exp: 0,
        stats: {
          ordersCompleted: 0,
          ordersFailed: 0,
          moneyEarned: 0
        },
        customers: [],
        orders: [],
        foods: [],
        equipment: {
          fryer: { level: 1, cooking: false },
          toaster: { level: 1, cooking: false },
          coffeeMaker: { level: 1, cooking: false }
        },
        isDragging: false,
        draggedFood: null
      },

      // 页面加载
      onLoad() {
        // 获取游戏实例
        this.game = game
        
        // 监听游戏状态变化
        this.updateGameState = () => {
          if (!this.game) return
          
          this.setData({
            gameLoaded: true,
            gameStarted: this.game.isRunning,
            gamePaused: this.game.isPaused,
            money: this.game.playerMoney,
            level: this.game.playerLevel,
            exp: this.game.playerExp,
            stats: this.game.stats,
            customers: this.game.customers,
            orders: this.game.orders,
            foods: this.game.foods,
            equipment: this.game.equipment
          })
          
          // 请求下一帧更新
          requestAnimationFrame(this.updateGameState)
        }
        
        // 启动状态更新
        this.updateGameState()
      },

      // 页面卸载
      onUnload() {
        this.updateGameState = null
      },

      // 使用设备
      useEquipment(e) {
        const type = e.currentTarget.dataset.type
        if (this.game && !this.data.equipment[type].cooking) {
          // 创建食物
          const foodType = this.getFoodTypeForEquipment(type)
          const food = this.game.createFood(foodType, type)
          
          // 更新状态
          this.setData({
            foods: this.game.foods,
            [`equipment.${type}.cooking`]: true
          })
        }
      },

      // 获取设备对应的食物类型
      getFoodTypeForEquipment(type) {
        switch (type) {
          case 'fryer': return 'fried_egg'
          case 'toaster': return 'toast'
          case 'coffeeMaker': return 'coffee'
          default: return 'fried_egg'
        }
      },

      // 触摸事件处理
      onTouchStart(e) {
        if (this.game) {
          this.game.handleTouchStart(e)
          this.setData({
            isDragging: this.game.touchState.isDragging,
            draggedFood: this.game.touchState.draggedItem
          })
        }
      },

      onTouchMove(e) {
        if (this.game && this.data.isDragging) {
          this.game.handleTouchMove(e)
          this.setData({
            draggedFood: this.game.touchState.draggedItem
          })
        }
      },

      onTouchEnd(e) {
        if (this.game && this.data.isDragging) {
          this.game.handleTouchEnd(e)
          this.setData({
            isDragging: false,
            draggedFood: null,
            foods: this.game.foods,
            orders: this.game.orders,
            customers: this.game.customers
          })
        }
      },

      // 合并自定义页面选项
      ...pageOptions
    })
  }
}