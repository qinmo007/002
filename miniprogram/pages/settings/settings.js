/**
 * 早餐店模拟器 - 设置页面逻辑
 */

// 获取应用实例
const app = getApp()

Page({
  data: {
    // 用户数据
    userInfo: {},

    // 设置数据
    settings: {
      isSoundEnabled: true,
      isMusicEnabled: true,
      isNotificationEnabled: true,
      isVibrationEnabled: true,
      language: 'zh_CN',
      theme: 'default'
    },

    // 界面状态
    isLoading: true,

    // 语言选项
    languageOptions: [
      { value: 'zh_CN', label: '简体中文' },
      { value: 'en_US', label: 'English' }
    ],

    // 主题选项
    themeOptions: [
      { value: 'default', label: '默认主题' },
      { value: 'dark', label: '暗黑主题' },
      { value: 'light', label: '明亮主题' }
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

    // 获取设置数据
    this.loadSettings()
  },

  // 页面显示时
  onShow() {
    // 播放背景音乐
    if (app.globalData.settings && app.globalData.settings.isMusicEnabled) {
      app.audioManager.playBGM('settings')
    }
  },

  // 加载设置
  loadSettings() {
    // 如果全局已有设置数据
    if (app.globalData.settings) {
      this.setData({
        settings: app.globalData.settings,
        isLoading: false
      })
    } else {
      // 否则获取设置数据
      wx.getStorage({
        key: 'settings',
        success: res => {
          const settings = res.data

          // 更新全局设置
          app.globalData.settings = settings

          // 更新页面数据
          this.setData({
            settings: settings,
            isLoading: false
          })
        },
        fail: () => {
          // 使用默认设置
          const defaultSettings = this.data.settings

          // 保存默认设置
          wx.setStorage({
            key: 'settings',
            data: defaultSettings
          })

          // 更新全局设置
          app.globalData.settings = defaultSettings

          // 更新页面数据
          this.setData({
            isLoading: false
          })
        }
      })
    }
  },

  // 保存设置
  saveSettings() {
    // 保存到本地存储
    wx.setStorage({
      key: 'settings',
      data: this.data.settings
    })

    // 更新全局设置
    app.globalData.settings = this.data.settings

    // 播放点击音效
    if (this.data.settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }

    // 显示保存成功提示
    wx.showToast({
      title: '设置已保存',
      icon: 'success',
      duration: 2000
    })
  },

  // 切换声音设置
  toggleSound() {
    const settings = { ...this.data.settings }
    settings.isSoundEnabled = !settings.isSoundEnabled

    this.setData({ settings })
    this.saveSettings()

    // 播放点击音效
    if (settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }
  },

  // 切换音乐设置
  toggleMusic() {
    const settings = { ...this.data.settings }
    settings.isMusicEnabled = !settings.isMusicEnabled

    this.setData({ settings })
    this.saveSettings()

    // 播放点击音效
    if (settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }

    // 控制背景音乐
    if (settings.isMusicEnabled) {
      app.audioManager.playBGM('settings')
    } else {
      app.audioManager.stopBGM()
    }
  },

  // 切换通知设置
  toggleNotification() {
    const settings = { ...this.data.settings }
    settings.isNotificationEnabled = !settings.isNotificationEnabled

    this.setData({ settings })
    this.saveSettings()

    // 播放点击音效
    if (settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }
  },

  // 切换振动设置
  toggleVibration() {
    const settings = { ...this.data.settings }
    settings.isVibrationEnabled = !settings.isVibrationEnabled

    this.setData({ settings })
    this.saveSettings()

    // 播放点击音效
    if (settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }

    // 如果开启振动，则触发一次振动
    if (settings.isVibrationEnabled) {
      wx.vibrateShort()
    }
  },

  // 切换语言
  changeLanguage(e) {
    const language = e.detail.value
    const settings = { ...this.data.settings }
    settings.language = language

    this.setData({ settings })
    this.saveSettings()

    // 播放点击音效
    if (settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }

    // 提示需要重启应用
    wx.showModal({
      title: '提示',
      content: '语言设置已更改，重启应用后生效',
      showCancel: false,
      confirmText: '确定'
    })
  },

  // 切换主题
  changeTheme(e) {
    const theme = e.detail.value
    const settings = { ...this.data.settings }
    settings.theme = theme

    this.setData({ settings })
    this.saveSettings()

    // 播放点击音效
    if (settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }

    // 应用主题
    app.applyTheme(theme)
  },

  // 清除缓存
  clearCache() {
    // 播放点击音效
    if (this.data.settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }

    // 显示确认对话框
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存数据吗？这将重置游戏进度。',
      success: res => {
        if (res.confirm) {
          // 清除所有缓存
          wx.clearStorage({
            success: () => {
              // 保留设置
              wx.setStorage({
                key: 'settings',
                data: this.data.settings
              })

              // 显示成功提示
              wx.showToast({
                title: '缓存已清除',
                icon: 'success',
                duration: 2000
              })

              // 重置游戏数据
              app.resetGameData()
            }
          })
        }
      }
    })
  },

  // 关于游戏
  showAbout() {
    // 播放点击音效
    if (this.data.settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }

    // 显示关于信息
    wx.showModal({
      title: '关于早餐店模拟器',
      content: '版本: 1.0.0\n开发者: 早餐店模拟器团队\n\n感谢您的支持！',
      showCancel: false,
      confirmText: '确定'
    })
  },

  // 返回首页
  goBack() {
    // 播放点击音效
    if (this.data.settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }

    wx.navigateBack()
  }
})
