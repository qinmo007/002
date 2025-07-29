/**
 * 早餐店模拟器 - 个人资料页面逻辑
 */

// 获取应用实例
const app = getApp()

Page({
  data: {
    // 用户数据
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl'),

    // 游戏数据
    gameData: null,

    // 界面状态
    currentTab: 'stats', // 当前选中的标签: stats, achievements, history
    isLoading: true,

    // 成就数据
    achievements: [
      {
        id: 'first_day',
        name: '第一天',
        description: '完成你的第一天营业',
        icon: '../../images/achievements/first_day.png',
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'money_maker',
        name: '赚钱高手',
        description: '累计赚取1000金币',
        icon: '../../images/achievements/money_maker.png',
        unlocked: false,
        progress: 0,
        maxProgress: 1000
      },
      {
        id: 'customer_service',
        name: '顾客服务',
        description: '服务50位顾客',
        icon: '../../images/achievements/customer_service.png',
        unlocked: false,
        progress: 0,
        maxProgress: 50
      },
      {
        id: 'perfect_dish',
        name: '完美料理',
        description: '制作10道完美料理',
        icon: '../../images/achievements/perfect_dish.png',
        unlocked: false,
        progress: 0,
        maxProgress: 10
      },
      {
        id: 'shop_owner',
        name: '店铺老板',
        description: '购买5件店铺升级',
        icon: '../../images/achievements/shop_owner.png',
        unlocked: false,
        progress: 0,
        maxProgress: 5
      },
      {
        id: 'food_master',
        name: '食物大师',
        description: '解锁所有食物',
        icon: '../../images/achievements/food_master.png',
        unlocked: false,
        progress: 0,
        maxProgress: 4
      },
      {
        id: 'decoration_lover',
        name: '装饰爱好者',
        description: '购买3件装饰品',
        icon: '../../images/achievements/decoration_lover.png',
        unlocked: false,
        progress: 0,
        maxProgress: 3
      },
      {
        id: 'regular_player',
        name: '常客',
        description: '连续7天登录游戏',
        icon: '../../images/achievements/regular_player.png',
        unlocked: false,
        progress: 0,
        maxProgress: 7
      }
    ],

    // 游戏历史记录
    gameHistory: []
  },

  // 页面加载时
  onLoad() {
    // 检查是否可以使用 getUserProfile
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    // 获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }

    // 获取游戏数据
    this.updateGameData()
  },

  // 页面显示时
  onShow() {
    // 播放背景音乐
    if (app.globalData.settings && app.globalData.settings.isMusicEnabled) {
      app.audioManager.playBGM('profile')
    }
  },

  // 更新游戏数据
  updateGameData() {
    // 如果全局已有游戏数据
    if (app.globalData.gameData) {
      this.processGameData(app.globalData.gameData)
    } else {
      // 否则获取游戏数据
      app.getGameData()

      // 设置回调
      app.gameDataReadyCallback = res => {
        this.processGameData(res)
      }
    }
  },

  // 处理游戏数据
  processGameData(gameData) {
    if (!gameData) {
      this.setData({ isLoading: false })
      return
    }

    // 更新成就状态
    this.updateAchievements(gameData)

    // 获取游戏历史记录
    this.getGameHistory()

    // 更新页面数据
    this.setData({
      gameData: gameData,
      isLoading: false
    })
  },

  // 更新成就状态
  updateAchievements(gameData) {
    const achievements = [...this.data.achievements]

    // 第一天
    if (gameData.daysPlayed > 0) {
      achievements[0].unlocked = true
      achievements[0].progress = 1
    } else {
      achievements[0].progress = 0
    }

    // 赚钱高手
    achievements[1].progress = Math.min(gameData.totalEarnings || 0, 1000)
    achievements[1].unlocked = achievements[1].progress >= 1000

    // 顾客服务
    achievements[2].progress = Math.min(gameData.totalCustomers || 0, 50)
    achievements[2].unlocked = achievements[2].progress >= 50

    // 完美料理
    achievements[3].progress = Math.min(gameData.perfectDishes || 0, 10)
    achievements[3].unlocked = achievements[3].progress >= 10

    // 店铺老板
    const ownedUpgrades = (gameData.ownedItems || []).filter(item =>
      item.includes('upgrade') || item.includes('equipment')
    ).length
    achievements[4].progress = Math.min(ownedUpgrades, 5)
    achievements[4].unlocked = achievements[4].progress >= 5

    // 食物大师
    const ownedFoods = (gameData.ownedItems || []).filter(item =>
      ['bacon', 'pancake', 'croissant', 'cappuccino'].includes(item)
    ).length
    achievements[5].progress = ownedFoods
    achievements[5].unlocked = ownedFoods >= 4

    // 装饰爱好者
    const ownedDecorations = (gameData.ownedItems || []).filter(item =>
      item.includes('wallpaper') || item.includes('floor') || item.includes('plant')
    ).length
    achievements[6].progress = Math.min(ownedDecorations, 3)
    achievements[6].unlocked = achievements[6].progress >= 3

    // 常客
    achievements[7].progress = Math.min(gameData.consecutiveLoginDays || 0, 7)
    achievements[7].unlocked = achievements[7].progress >= 7

    this.setData({ achievements })
  },

  // 获取游戏历史记录
  getGameHistory() {
    // 模拟获取游戏历史记录
    // 实际应用中，这里应该从本地存储或云端获取真实的历史记录

    const gameHistory = [
      {
        date: '2023-05-01',
        earnings: 520,
        customers: 12,
        rating: 4.5
      },
      {
        date: '2023-05-02',
        earnings: 680,
        customers: 15,
        rating: 4.7
      },
      {
        date: '2023-05-03',
        earnings: 450,
        customers: 10,
        rating: 4.2
      },
      {
        date: '2023-05-04',
        earnings: 720,
        customers: 18,
        rating: 4.8
      },
      {
        date: '2023-05-05',
        earnings: 600,
        customers: 14,
        rating: 4.6
      }
    ]

    this.setData({ gameHistory })
  },

  // 获取用户信息（旧版本）
  getUserInfo(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  },

  // 获取用户信息（新版本）
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  // 切换标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab

    // 播放点击音效
    if (app.globalData.settings && app.globalData.settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }

    this.setData({
      currentTab: tab
    })
  },

  // 查看成就详情
  viewAchievementDetail(e) {
    const id = e.currentTarget.dataset.id
    const achievement = this.data.achievements.find(a => a.id === id)

    if (!achievement) return

    // 播放点击音效
    if (app.globalData.settings && app.globalData.settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }

    // 显示成就详情
    wx.showModal({
      title: achievement.name,
      content: `${achievement.description}\n\n进度: ${achievement.progress}/${achievement.maxProgress}`,
      showCancel: false,
      confirmText: '关闭'
    })
  },

  // 返回首页
  goBack() {
    // 播放点击音效
    if (app.globalData.settings && app.globalData.settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }

    wx.navigateBack()
  }
})
