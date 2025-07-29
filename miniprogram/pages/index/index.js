/**
 * 早餐店模拟器 - 主页面
 */

// 导入工具类
const DataManager = require('../../utils/dataManager');
const AudioManager = require('../../utils/audioManager');
const util = require('../../utils/util');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 加载状态
    isLoading: true,

    // 用户信息
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: false,

    // 游戏数据
    gameData: null,

    // 设置
    settings: null,

    // 每日登录
    showLoginReward: false,
    loginReward: {
      coins: 0,
      consecutiveDays: 0,
      isBonus: false
    },

    // 公告
    announcement: {
      title: '游戏公告',
      content: '欢迎来到早餐店模拟器！开始你的早餐店经营之旅吧！',
      date: '2023-05-01'
    },

    // 动画效果
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化数据管理器
    this.dataManager = new DataManager();

    // 初始化音频管理器
    this.audioManager = new AudioManager();

    // 检查是否可以使用 wx.getUserProfile
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }

    // 加载数据
    this.loadData();

    // 创建动画实例
    this.animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 播放背景音乐
    if (this.data.settings && this.data.settings.isMusicEnabled) {
      this.audioManager.playBGM('main');
    }

    // 刷新数据（如果已经加载过）
    if (this.data.gameData) {
      this.refreshData();
    }

    // 启动动画
    this.startAnimation();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 暂停背景音乐
    if (this.data.settings && this.data.settings.isMusicEnabled) {
      this.audioManager.pauseBGM();
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 停止背景音乐
    this.audioManager.stopBGM();
  },

  /**
   * 加载数据
   */
  loadData: function () {
    // 加载设置
    this.dataManager.getSettings()
      .then(settings => {
        this.setData({ settings });

        // 根据设置播放背景音乐
        if (settings.isMusicEnabled) {
          this.audioManager.playBGM('main');
        }

        // 加载用户信息
        return this.dataManager.getUserInfo();
      })
      .then(userInfo => {
        if (userInfo) {
          this.setData({
            userInfo,
            hasUserInfo: true
          });
        }

        // 加载游戏数据并检查每日登录
        return this.dataManager.checkDailyLogin();
      })
      .then(gameData => {
        // 检查是否有每日登录奖励
        const today = new Date().toISOString().split('T')[0];
        const isNewLogin = gameData.lastLoginDate === today &&
                          gameData.consecutiveLoginDays > 0;

        // 计算登录奖励
        let loginReward = {
          coins: this.dataManager.defaultGameData.basic.dailyLoginReward,
          consecutiveDays: gameData.consecutiveLoginDays || 1,
          isBonus: false
        };

        // 检查是否有连续登录奖励
        const consecutiveDays = gameData.consecutiveLoginDays || 1;
        const bonusIndex = Math.min(consecutiveDays, 7) - 1;
        const bonusCoins = this.dataManager.defaultGameData.basic.consecutiveLoginBonus[bonusIndex] || 0;

        if (bonusCoins > 0) {
          loginReward.coins += bonusCoins;
          loginReward.isBonus = true;
        }

        this.setData({
          gameData,
          isLoading: false,
          showLoginReward: isNewLogin,
          loginReward
        });
      })
      .catch(err => {
        console.error('加载数据失败', err);
        wx.showToast({
          title: '加载数据失败',
          icon: 'none'
        });

        // 即使加载失败也要关闭加载状态
        this.setData({
          isLoading: false
        });
      });
  },

  /**
   * 刷新数据
   */
  refreshData: function () {
    // 重新加载游戏数据
    this.dataManager.getGameData()
      .then(gameData => {
        this.setData({ gameData });
      })
      .catch(err => {
        console.error('刷新数据失败', err);
      });
  },

  /**
   * 开始动画效果
   */
  startAnimation: function () {
    // 创建一个循环动画
    this.animation.scale(1.05).step()
      .scale(1).step();

    this.setData({
      animationData: this.animation.export()
    });

    // 定时重复动画
    setTimeout(() => {
      if (this.animation) {
        this.startAnimation();
      }
    }, 2000);
  },

  /**
   * 获取用户信息
   */
  getUserProfile: function () {
    if (this.data.settings && this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('click');
    }

    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        // 保存用户信息
        this.dataManager.saveUserInfo(res.userInfo)
          .then(() => {
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            });

            wx.showToast({
              title: '登录成功',
              icon: 'success'
            });
          });
      }
    });
  },

  /**
   * 开始游戏
   */
  startGame: function () {
    if (this.data.settings && this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('click');
    }

    wx.navigateTo({
      url: '../game/game'
    });
  },

  /**
   * 进入商店
   */
  goToShop: function () {
    if (this.data.settings && this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('click');
    }

    wx.navigateTo({
      url: '../shop/shop'
    });
  },

  /**
   * 进入排行榜
   */
  goToRanking: function () {
    if (this.data.settings && this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('click');
    }

    wx.navigateTo({
      url: '../ranking/ranking'
    });
  },

  /**
   * 进入个人资料
   */
  goToProfile: function () {
    if (this.data.settings && this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('click');
    }

    wx.navigateTo({
      url: '../profile/profile'
    });
  },

  /**
   * 进入设置
   */
  goToSettings: function () {
    if (this.data.settings && this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('click');
    }

    wx.navigateTo({
      url: '../settings/settings'
    });
  },

  /**
   * 领取每日登录奖励
   */
  claimLoginReward: function () {
    if (this.data.settings && this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('coin');
    }

    // 更新游戏数据
    const newCoins = this.data.gameData.coins + this.data.loginReward.coins;

    this.dataManager.updateGameData({ coins: newCoins })
      .then(gameData => {
        this.setData({
          gameData,
          showLoginReward: false
        });

        wx.showToast({
          title: `获得 ${this.data.loginReward.coins} 金币`,
          icon: 'success'
        });
      });
  },

  /**
   * 关闭每日登录奖励弹窗
   */
  closeLoginReward: function () {
    if (this.data.settings && this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('click');
    }

    this.setData({
      showLoginReward: false
    });
  }
})
