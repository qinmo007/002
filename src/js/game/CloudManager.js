/**
 * 云开发管理器类
 * 负责处理云存储和数据同步
 */

export default class CloudManager {
  constructor(game) {
    this.game = game

    // 云开发实例
    this.cloud = null

    // 用户信息
    this.userInfo = null

    // 数据同步状态
    this.isSyncing = false
    this.lastSyncTime = 0

    // 离线模式
    this.isOfflineMode = false

    // 初始化云开发管理器
    this.init()
  }

  /**
   * 初始化云开发管理器
   */
  init() {
    // 检查是否在微信小程序环境中
    if (typeof wx !== 'undefined' && wx.cloud) {
      // 初始化云开发
      try {
        wx.cloud.init({
          env: 'breakfast-shop-xxxxx', // 云开发环境ID
          traceUser: true
        })

        this.cloud = wx.cloud
        console.log('云开发初始化成功')

        // 获取用户信息
        this.getUserInfo()
      } catch (error) {
        console.error('云开发初始化失败:', error)
        this.enableOfflineMode()
      }
    } else {
      console.log('不在微信小程序环境中，启用离线模式')
      this.enableOfflineMode()
    }
  }

  /**
   * 获取用户信息
   */
  getUserInfo() {
    if (!this.cloud || this.isOfflineMode) return

    // 获取用户OpenID
    this.cloud.callFunction({
      name: 'getUserInfo',
      success: res => {
        this.userInfo = res.result
        console.log('获取用户信息成功:', this.userInfo)

        // 加载用户游戏数据
        this.loadGameData()
      },
      fail: err => {
        console.error('获取用户信息失败:', err)
        this.enableOfflineMode()
      }
    })
  }

  /**
   * 启用离线模式
   */
  enableOfflineMode() {
    this.isOfflineMode = true
    console.log('启用离线模式')

    // 从本地存储加载游戏数据
    this.loadLocalGameData()
  }

  /**
   * 加载游戏数据
   */
  loadGameData() {
    if (this.isOfflineMode) {
      this.loadLocalGameData()
      return
    }

    if (!this.cloud || !this.userInfo) {
      console.warn('云开发未初始化或用户信息未获取，无法加载游戏数据')
      this.enableOfflineMode()
      return
    }

    // 调用云函数获取游戏数据
    this.cloud.callFunction({
      name: 'getGameData',
      success: res => {
        const gameData = res.result
        console.log('获取游戏数据成功:', gameData)

        // 更新玩家数据
        this.game.player.loadPlayerData(gameData)

        // 更新最后同步时间
        this.lastSyncTime = Date.now()
      },
      fail: err => {
        console.error('获取游戏数据失败:', err)

        // 失败时尝试从本地加载
        this.loadLocalGameData()
      }
    })
  }

  /**
   * 从本地存储加载游戏数据
   */
  loadLocalGameData() {
    try {
      const localData = localStorage.getItem('breakfastShopGameData')

      if (localData) {
        const gameData = JSON.parse(localData)
        console.log('从本地存储加载游戏数据:', gameData)

        // 更新玩家数据
        this.game.player.loadPlayerData(gameData)
      } else {
        console.log('本地存储中没有游戏数据，使用默认数据')
      }
    } catch (error) {
      console.error('从本地存储加载游戏数据失败:', error)
    }
  }

  /**
   * 保存游戏数据
   */
  saveGameData() {
    // 获取玩家数据
    const playerData = this.game.player.getPlayerData()

    // 保存到本地存储
    this.saveLocalGameData(playerData)

    // 如果在离线模式或者距离上次同步时间不足5分钟，不进行云同步
    if (this.isOfflineMode || Date.now() - this.lastSyncTime < 5 * 60 * 1000) {
      return
    }

    // 同步到云端
    this.syncToCloud(playerData)
  }

  /**
   * 保存游戏数据到本地存储
   */
  saveLocalGameData(playerData) {
    try {
      localStorage.setItem('breakfastShopGameData', JSON.stringify(playerData))
      console.log('游戏数据已保存到本地存储')
    } catch (error) {
      console.error('保存游戏数据到本地存储失败:', error)
    }
  }

  /**
   * 同步游戏数据到云端
   */
  syncToCloud(playerData) {
    if (this.isOfflineMode || !this.cloud || !this.userInfo) {
      return
    }

    // 防止重复同步
    if (this.isSyncing) {
      return
    }

    this.isSyncing = true

    // 调用云函数更新游戏数据
    this.cloud.callFunction({
      name: 'updateGameData',
      data: {
        playerData: playerData
      },
      success: res => {
        console.log('同步游戏数据到云端成功:', res)

        // 更新最后同步时间
        this.lastSyncTime = Date.now()

        // 显示同步成功提示
        this.game.ui.showNotification('数据同步成功')
      },
      fail: err => {
        console.error('同步游戏数据到云端失败:', err)

        // 显示同步失败提示
        this.game.ui.showNotification('数据同步失败')
      },
      complete: () => {
        this.isSyncing = false
      }
    })
  }

  /**
   * 强制同步游戏数据
   */
  forceSyncGameData() {
    // 获取玩家数据
    const playerData = this.game.player.getPlayerData()

    // 保存到本地存储
    this.saveLocalGameData(playerData)

    // 同步到云端
    if (!this.isOfflineMode) {
      this.syncToCloud(playerData)
    }
  }

  /**
   * 检查是否在离线模式
   */
  isInOfflineMode() {
    return this.isOfflineMode
  }

  /**
   * 获取用户OpenID
   */
  getUserOpenId() {
    return this.userInfo ? this.userInfo.openid : null
  }

  /**
   * 获取最后同步时间
   */
  getLastSyncTime() {
    return this.lastSyncTime
  }

  /**
   * 检查是否正在同步
   */
  isSyncingData() {
    return this.isSyncing
  }
}
