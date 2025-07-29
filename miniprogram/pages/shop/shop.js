/**
 * 早餐店模拟器 - 商店页面逻辑
 */

// 获取应用实例
const app = getApp()

Page({
  data: {
    // 用户数据
    userInfo: {},
    gameData: null,
    
    // 界面状态
    currentTab: 'equipment', // 当前选中的标签: equipment, food, decoration
    isLoading: true,
    
    // 商店数据
    equipmentItems: [
      {
        id: 'fryer_upgrade_1',
        name: '炸锅升级 I',
        description: '提高炸锅效率20%，减少烹饪时间',
        price: 500,
        icon: '../../images/ui/fryer_upgrade_1.png',
        type: 'upgrade',
        target: 'fryer',
        level: 1,
        effect: {
          speedBoost: 0.2,
          qualityBoost: 0
        },
        owned: false,
        unlocked: true
      },
      {
        id: 'fryer_upgrade_2',
        name: '炸锅升级 II',
        description: '提高炸锅效率40%，减少烹饪时间',
        price: 1200,
        icon: '../../images/ui/fryer_upgrade_2.png',
        type: 'upgrade',
        target: 'fryer',
        level: 2,
        effect: {
          speedBoost: 0.4,
          qualityBoost: 0.1
        },
        owned: false,
        unlocked: false,
        requires: 'fryer_upgrade_1'
      },
      {
        id: 'toaster_upgrade_1',
        name: '烤面包机升级 I',
        description: '提高烤面包机效率20%，减少烹饪时间',
        price: 500,
        icon: '../../images/ui/toaster_upgrade_1.png',
        type: 'upgrade',
        target: 'toaster',
        level: 1,
        effect: {
          speedBoost: 0.2,
          qualityBoost: 0
        },
        owned: false,
        unlocked: true
      },
      {
        id: 'toaster_upgrade_2',
        name: '烤面包机升级 II',
        description: '提高烤面包机效率40%，减少烹饪时间',
        price: 1200,
        icon: '../../images/ui/toaster_upgrade_2.png',
        type: 'upgrade',
        target: 'toaster',
        level: 2,
        effect: {
          speedBoost: 0.4,
          qualityBoost: 0.1
        },
        owned: false,
        unlocked: false,
        requires: 'toaster_upgrade_1'
      },
      {
        id: 'coffee_maker_upgrade_1',
        name: '咖啡机升级 I',
        description: '提高咖啡机效率20%，减少烹饪时间',
        price: 500,
        icon: '../../images/ui/coffee_maker_upgrade_1.png',
        type: 'upgrade',
        target: 'coffeeMaker',
        level: 1,
        effect: {
          speedBoost: 0.2,
          qualityBoost: 0
        },
        owned: false,
        unlocked: true
      },
      {
        id: 'coffee_maker_upgrade_2',
        name: '咖啡机升级 II',
        description: '提高咖啡机效率40%，减少烹饪时间',
        price: 1200,
        icon: '../../images/ui/coffee_maker_upgrade_2.png',
        type: 'upgrade',
        target: 'coffeeMaker',
        level: 2,
        effect: {
          speedBoost: 0.4,
          qualityBoost: 0.1
        },
        owned: false,
        unlocked: false,
        requires: 'coffee_maker_upgrade_1'
      },
      {
        id: 'second_fryer',
        name: '第二个炸锅',
        description: '添加一个额外的炸锅，可以同时烹饪两种食物',
        price: 2000,
        icon: '../../images/ui/second_fryer.png',
        type: 'new_equipment',
        target: 'fryer2',
        level: 1,
        effect: {
          newEquipment: true
        },
        owned: false,
        unlocked: false,
        requires: 'fryer_upgrade_1'
      }
    ],
    
    foodItems: [
      {
        id: 'bacon',
        name: '培根',
        description: '美味的培根，可以用炸锅烹饪',
        price: 300,
        icon: '../../images/foods/bacon.png',
        type: 'food',
        cookingEquipment: 'fryer',
        cookingTime: 15,
        basePrice: 8,
        owned: false,
        unlocked: true
      },
      {
        id: 'pancake',
        name: '煎饼',
        description: '松软的煎饼，可以用炸锅烹饪',
        price: 500,
        icon: '../../images/foods/pancake.png',
        type: 'food',
        cookingEquipment: 'fryer',
        cookingTime: 20,
        basePrice: 12,
        owned: false,
        unlocked: false,
        requires: 'bacon'
      },
      {
        id: 'croissant',
        name: '牛角面包',
        description: '酥脆的牛角面包，可以用烤面包机烹饪',
        price: 400,
        icon: '../../images/foods/croissant.png',
        type: 'food',
        cookingEquipment: 'toaster',
        cookingTime: 25,
        basePrice: 10,
        owned: false,
        unlocked: false,
        requires: 'player_level_3'
      },
      {
        id: 'cappuccino',
        name: '卡布奇诺',
        description: '香浓的卡布奇诺咖啡',
        price: 600,
        icon: '../../images/foods/cappuccino.png',
        type: 'food',
        cookingEquipment: 'coffeeMaker',
        cookingTime: 18,
        basePrice: 15,
        owned: false,
        unlocked: false,
        requires: 'player_level_4'
      }
    ],
    
    decorationItems: [
      {
        id: 'wallpaper_1',
        name: '墙纸 - 经典',
        description: '为你的餐厅添加经典风格的墙纸',
        price: 200,
        icon: '../../images/ui/wallpaper_1.png',
        type: 'decoration',
        category: 'wallpaper',
        effect: {
          customerMoodBoost: 0.05
        },
        owned: false,
        unlocked: true
      },
      {
        id: 'wallpaper_2',
        name: '墙纸 - 现代',
        description: '为你的餐厅添加现代风格的墙纸',
        price: 300,
        icon: '../../images/ui/wallpaper_2.png',
        type: 'decoration',
        category: 'wallpaper',
        effect: {
          customerMoodBoost: 0.08
        },
        owned: false,
        unlocked: true
      },
      {
        id: 'floor_1',
        name: '地板 - 木质',
        description: '为你的餐厅添加木质地板',
        price: 250,
        icon: '../../images/ui/floor_1.png',
        type: 'decoration',
        category: 'floor',
        effect: {
          customerMoodBoost: 0.05
        },
        owned: false,
        unlocked: true
      },
      {
        id: 'plant_1',
        name: '装饰植物',
        description: '为你的餐厅添加绿色植物，提升顾客心情',
        price: 150,
        icon: '../../images/ui/plant_1.png',
        type: 'decoration',
        category: 'accessory',
        effect: {
          customerMoodBoost: 0.03
        },
        owned: false,
        unlocked: true
      }
    ]
  },

  // 页面加载时
  onLoad() {
    // 获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }

    // 获取游戏数据
    this.updateGameData()
  },

  // 页面显示时
  onShow() {
    // 播放背景音乐
    if (app.globalData.settings && app.globalData.settings.isMusicEnabled) {
      app.audioManager.playBGM('shop')
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

    // 更新商店物品状态
    this.updateShopItems(gameData)

    // 更新页面数据
    this.setData({
      gameData: gameData,
      isLoading: false
    })
  },

  // 更新商店物品状态
  updateShopItems(gameData) {
    if (!gameData.ownedItems) {
      gameData.ownedItems = []
    }

    // 更新设备状态
    const equipmentItems = this.data.equipmentItems.map(item => {
      // 检查是否拥有
      const owned = gameData.ownedItems.includes(item.id)
      
      // 检查是否解锁
      let unlocked = item.unlocked
      if (item.requires) {
        if (item.requires.startsWith('player_level_')) {
          // 检查玩家等级要求
          const requiredLevel = parseInt(item.requires.replace('player_level_', ''))
          unlocked = gameData.playerLevel >= requiredLevel
        } else {
          // 检查前置物品要求
          unlocked = gameData.ownedItems.includes(item.requires)
        }
      }
      
      return { ...item, owned, unlocked }
    })
    
    // 更新食物状态
    const foodItems = this.data.foodItems.map(item => {
      // 检查是否拥有
      const owned = gameData.ownedItems.includes(item.id)
      
      // 检查是否解锁
      let unlocked = item.unlocked
      if (item.requires) {
        if (item.requires.startsWith('player_level_')) {
          // 检查玩家等级要求
          const requiredLevel = parseInt(item.requires.replace('player_level_', ''))
          unlocked = gameData.playerLevel >= requiredLevel
        } else {
          // 检查前置物品要求
          unlocked = gameData.ownedItems.includes(item.requires)
        }
      }
      
      return { ...item, owned, unlocked }
    })
    
    // 更新装饰状态
    const decorationItems = this.data.decorationItems.map(item => {
      // 检查是否拥有
      const owned = gameData.ownedItems.includes(item.id)
      
      // 检查是否解锁
      let unlocked = item.unlocked
      if (item.requires) {
        if (item.requires.startsWith('player_level_')) {
          // 检查玩家等级要求
          const requiredLevel = parseInt(item.requires.replace('player_level_', ''))
          unlocked = gameData.playerLevel >= requiredLevel
        } else {
          // 检查前置物品要求
          unlocked = gameData.ownedItems.includes(item.requires)
        }
      }
      
      return { ...item, owned, unlocked }
    })
    
    this.setData({
      equipmentItems,
      foodItems,
      decorationItems
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

  // 购买物品
  buyItem(e) {
    const itemId = e.currentTarget.dataset.id
    const itemType = e.currentTarget.dataset.type
    
    // 播放点击音效
    if (app.globalData.settings && app.globalData.settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }
    
    // 获取物品信息
    let item
    switch (itemType) {
      case 'equipment':
        item = this.data.equipmentItems.find(i => i.id === itemId)
        break
      case 'food':
        item = this.data.foodItems.find(i => i.id === itemId)
        break
      case 'decoration':
        item = this.data.decorationItems.find(i => i.id === itemId)
        break
    }
    
    if (!item) {
      app.showToast('物品不存在')
      return
    }
    
    // 检查是否已拥有
    if (item.owned) {
      app.showToast('已拥有该物品')
      return
    }
    
    // 检查是否解锁
    if (!item.unlocked) {
      app.showToast('该物品尚未解锁')
      return
    }
    
    // 检查金币是否足够
    if (this.data.gameData.coins < item.price) {
      app.showToast('金币不足')
      return
    }
    
    // 更新游戏数据
    const gameData = { ...this.data.gameData }
    
    // 扣除金币
    gameData.coins -= item.price
    
    // 添加到已拥有物品列表
    if (!gameData.ownedItems) {
      gameData.ownedItems = []
    }
    gameData.ownedItems.push(item.id)
    
    // 保存游戏数据
    app.setGameData(gameData)
    
    // 更新商店物品状态
    this.updateShopItems(gameData)
    
    // 更新页面数据
    this.setData({
      gameData: gameData
    })
    
    // 播放购买成功音效
    if (app.globalData.settings && app.globalData.settings.isSoundEnabled) {
      app.audioManager.playSound('purchase')
    }
    
    // 显示购买成功提示
    app.showToast('购买成功')
  },

  // 查看物品详情
  viewItemDetail(e) {
    const itemId = e.currentTarget.dataset.id
    const itemType = e.currentTarget.dataset.type
    
    // 播放点击音效
    if (app.globalData.settings && app.globalData.settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }
    
    // 获取物品信息
    let item
    switch (itemType) {
      case 'equipment':
        item = this.data.equipmentItems.find(i => i.id === itemId)
        break
      case 'food':
        item = this.data.foodItems.find(i => i.id === itemId)
        break
      case 'decoration':
        item = this.data.decorationItems.find(i => i.id === itemId)
        break
    }
    
    if (!item) {
      return
    }
    
    // 显示物品详情
    wx.showModal({
      title: item.name,
      content: item.description,
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