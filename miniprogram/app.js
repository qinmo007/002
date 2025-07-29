/**
 * 早餐店模拟器 - 微信小程序入口文件
 */

// 导入游戏模块
import gameModule from './game.js'

// 全局音频管理器
const audioManager = {
  bgmAudio: null,
  soundEffects: {},

  // 初始化音频
  init: function() {
    // 创建背景音乐实例
    this.bgmAudio = wx.createInnerAudioContext()
    this.bgmAudio.loop = true

    // 预加载常用音效
    this.loadSoundEffect('click', 'assets/audio/click.mp3')
    this.loadSoundEffect('coin', 'assets/audio/coin.mp3')
    this.loadSoundEffect('cooking', 'assets/audio/cooking.mp3')
    this.loadSoundEffect('customer', 'assets/audio/customer.mp3')
    this.loadSoundEffect('levelup', 'assets/audio/levelup.mp3')
  },

  // 加载音效
  loadSoundEffect: function(name, src) {
    const audio = wx.createInnerAudioContext()
    audio.src = src
    this.soundEffects[name] = audio
  },

  // 播放背景音乐
  playBGM: function(src) {
    if (!this.bgmAudio) return

    // 如果已经在播放相同的音乐，不做任何操作
    if (this.bgmAudio.src === src && !this.bgmAudio.paused) return

    this.bgmAudio.stop()
    this.bgmAudio.src = src
    this.bgmAudio.play()
  },

  // 停止背景音乐
  stopBGM: function() {
    if (!this.bgmAudio) return
    this.bgmAudio.stop()
  },

  // 暂停背景音乐
  pauseBGM: function() {
    if (!this.bgmAudio) return
    this.bgmAudio.pause()
  },

  // 恢复背景音乐
  resumeBGM: function() {
    if (!this.bgmAudio) return
    this.bgmAudio.play()
  },

  // 播放音效
  playSound: function(name) {
    const sound = this.soundEffects[name]
    if (!sound) return

    // 重置音效并播放
    sound.stop()
    sound.play()
  },

  // 设置音量
  setVolume: function(type, volume) {
    if (type === 'bgm' && this.bgmAudio) {
      this.bgmAudio.volume = volume
    } else if (type === 'sound') {
      // 设置所有音效的音量
      Object.values(this.soundEffects).forEach(sound => {
        sound.volume = volume
      })
    }
  }
}

// App实例
App({
  // 全局数据
  globalData: {
    userInfo: null,
    gameData: null,
    settings: {
      musicVolume: 0.5,
      soundVolume: 0.8,
      isMusicEnabled: true,
      isSoundEnabled: true
    },
    isNewUser: false,
    isLoggedIn: false,
    systemInfo: null
  },

  // 音频管理器
  audioManager: audioManager,

  // 游戏模块
  gameModule: gameModule,

  // 小程序启动时
  onLaunch: function() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'breakfast-shop-xxxxx', // 云开发环境ID
        traceUser: true
      })
    }

    // 获取系统信息
    this.globalData.systemInfo = wx.getSystemInfoSync()

    // 初始化音频管理器
    this.audioManager.init()

    // 加载用户设置
    this.loadUserSettings()

    // 检查用户登录状态
    this.checkLoginStatus()
  },

  // 小程序显示时
  onShow: function() {
    // 恢复背景音乐
    if (this.globalData.settings.isMusicEnabled) {
      this.audioManager.resumeBGM()
    }
  },

  // 小程序隐藏时
  onHide: function() {
    // 暂停背景音乐
    this.audioManager.pauseBGM()
  },

  // 加载用户设置
  loadUserSettings: function() {
    const settings = wx.getStorageSync('userSettings')
    if (settings) {
      this.globalData.settings = settings

      // 应用音频设置
      this.audioManager.setVolume('bgm', settings.musicVolume)
      this.audioManager.setVolume('sound', settings.soundVolume)
    }
  },

  // 保存用户设置
  saveUserSettings: function() {
    wx.setStorageSync('userSettings', this.globalData.settings)
  },

  // 检查用户登录状态
  checkLoginStatus: function() {
    // 获取用户信息
    wx.cloud.callFunction({
      name: 'getUserInfo',
      success: res => {
        if (res.result && res.result.success) {
          this.globalData.userInfo = res.result.userInfo
          this.globalData.isLoggedIn = true
          this.globalData.isNewUser = res.result.isNewUser || false

          // 获取游戏数据
          this.getGameData()
        } else {
          console.error('获取用户信息失败:', res.result.error)
        }
      },
      fail: err => {
        console.error('调用云函数失败:', err)
      }
    })
  },

  // 获取游戏数据
  getGameData: function() {
    wx.cloud.callFunction({
      name: 'getGameData',
      success: res => {
        if (res.result && res.result.success) {
          this.globalData.gameData = res.result.data

          // 如果是新用户，显示教程
          if (res.result.isNewUser) {
            wx.navigateTo({
              url: '/pages/tutorial/tutorial'
            })
          }
        } else {
          console.error('获取游戏数据失败:', res.result.error)
        }
      },
      fail: err => {
        console.error('调用云函数失败:', err)
      }
    })
  },

  // 更新游戏数据
  updateGameData: function(data, callback) {
    wx.cloud.callFunction({
      name: 'updateGameData',
      data: {
        playerData: data
      },
      success: res => {
        if (res.result && res.result.success) {
          // 更新本地缓存的游戏数据
          Object.assign(this.globalData.gameData, data)

          if (callback && typeof callback === 'function') {
            callback(true)
          }
        } else {
          console.error('更新游戏数据失败:', res.result.error)

          if (callback && typeof callback === 'function') {
            callback(false, res.result.error)
          }
        }
      },
      fail: err => {
        console.error('调用云函数失败:', err)

        if (callback && typeof callback === 'function') {
          callback(false, err)
        }
      }
    })
  },

  // 显示提示信息
  showToast: function(title, icon = 'none', duration = 2000) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    })
  },

  // 显示加载提示
  showLoading: function(title = '加载中...') {
    wx.showLoading({
      title: title,
      mask: true
    })
  },

  // 隐藏加载提示
  hideLoading: function() {
    wx.hideLoading()
  }
})
