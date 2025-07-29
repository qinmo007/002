/**
 * 早餐店模拟器 - 排行榜页面逻辑
 */

// 获取应用实例
const app = getApp()

Page({
  data: {
    // 用户数据
    userInfo: {},
    gameData: null,

    // 界面状态
    currentTab: 'daily', // 当前选中的标签: daily, weekly, all_time
    isLoading: true,

    // 排行榜数据
    dailyRankings: [],
    weeklyRankings: [],
    allTimeRankings: [],

    // 用户排名
    userRanking: {
      daily: null,
      weekly: null,
      allTime: null
    }
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
      app.audioManager.playBGM('ranking')
    }

    // 获取排行榜数据
    this.fetchRankingData()
  },

  // 更新游戏数据
  updateGameData() {
    // 如果全局已有游戏数据
    if (app.globalData.gameData) {
      this.setData({
        gameData: app.globalData.gameData
      })
    } else {
      // 否则获取游戏数据
      app.getGameData()

      // 设置回调
      app.gameDataReadyCallback = res => {
        this.setData({
          gameData: res
        })
      }
    }
  },

  // 获取排行榜数据
  fetchRankingData() {
    // 模拟获取排行榜数据
    // 实际应用中，这里应该调用云函数或API获取真实的排行榜数据

    // 生成模拟数据
    const dailyRankings = this.generateMockRankingData(20)
    const weeklyRankings = this.generateMockRankingData(20)
    const allTimeRankings = this.generateMockRankingData(20)

    // 添加当前用户到排行榜
    if (app.globalData.userInfo) {
      const userNickName = app.globalData.userInfo.nickName || '我'
      const userScore = app.globalData.gameData ? app.globalData.gameData.totalEarnings || 0 : 0

      // 计算用户排名
      const userRanking = {
        daily: this.calculateUserRanking(dailyRankings, userScore),
        weekly: this.calculateUserRanking(weeklyRankings, userScore),
        allTime: this.calculateUserRanking(allTimeRankings, userScore)
      }

      // 更新排行榜数据
      this.setData({
        dailyRankings,
        weeklyRankings,
        allTimeRankings,
        userRanking,
        isLoading: false
      })
    } else {
      // 未登录用户
      this.setData({
        dailyRankings,
        weeklyRankings,
        allTimeRankings,
        isLoading: false
      })
    }
  },

  // 生成模拟排行榜数据
  generateMockRankingData(count) {
    const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十',
                  '郑十一', '王小二', '李小三', '赵小四', '钱小五', '孙小六', '周小七',
                  '吴小八', '郑小九', '王大力', '李大壮', '赵大猛', '钱大勇', '孙大刚',
                  '周大伟', '吴大强', '郑大雄', '王小明', '李小红', '赵小花', '钱小丽']

    const avatars = [
      '../../images/ui/avatar1.png',
      '../../images/ui/avatar2.png',
      '../../images/ui/avatar3.png',
      '../../images/ui/avatar4.png',
      '../../images/ui/avatar5.png'
    ]

    const rankings = []

    for (let i = 0; i < count; i++) {
      const randomName = names[Math.floor(Math.random() * names.length)]
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)]
      const baseScore = 10000 - (i * 500) // 排名越高，分数越高
      const randomOffset = Math.floor(Math.random() * 200) // 添加一些随机性

      rankings.push({
        rank: i + 1,
        name: randomName,
        avatar: randomAvatar,
        score: baseScore + randomOffset
      })
    }

    return rankings
  },

  // 计算用户排名
  calculateUserRanking(rankings, userScore) {
    let rank = rankings.length + 1

    for (let i = 0; i < rankings.length; i++) {
      if (userScore >= rankings[i].score) {
        rank = i + 1
        break
      }
    }

    return rank
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

  // 返回首页
  goBack() {
    // 播放点击音效
    if (app.globalData.settings && app.globalData.settings.isSoundEnabled) {
      app.audioManager.playSound('click')
    }

    wx.navigateBack()
  }
})
