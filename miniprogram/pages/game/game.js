/**
 * 早餐店模拟器 - 游戏页面
 */

// 导入工具类
const DataManager = require('../../utils/dataManager');
const AudioManager = require('../../utils/audioManager');
const util = require('../../utils/util');

// 导入游戏配置
const gameConfig = require('../../utils/gameConfig');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 加载状态
    isLoading: true,
    
    // 游戏数据
    gameData: null,
    
    // 设置
    settings: null,
    
    // 游戏状态
    gameState: 'preparing', // preparing, running, paused, finished
    
    // 游戏时间
    gameTime: 0, // 游戏时间（秒）
    dayTime: 0, // 当天时间（秒）
    dayDuration: 180, // 一天的持续时间（秒）
    
    // 游戏日期
    currentDay: 1,
    
    // 游戏统计
    dailyStats: {
      earnings: 0,
      customers: 0,
      orders: 0,
      perfectDishes: 0,
      averageRating: 0,
      ratings: []
    },
    
    // 顾客
    customers: [],
    maxCustomers: 3,
    
    // 订单
    currentOrders: [],
    completedOrders: [],
    
    // 烹饪
    cookingFood: null,
    cookingProgress: 0,
    cookingQuality: 0,
    
    // 食物和设备
    availableFood: [],
    ownedEquipment: [],
    
    // UI状态
    showPauseMenu: false,
    showDayEndSummary: false,
    showTutorial: false,
    
    // 动画数据
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
    
    // 加载数据
    this.loadData();
    
    // 创建动画实例
    this.animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 如果游戏状态为暂停，则恢复游戏
    if (this.data.gameState === 'paused') {
      this.resumeGame();
    }
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 暂停游戏
    if (this.data.gameState === 'running') {
      this.pauseGame();
    }
  },
  
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 停止所有计时器
    this.clearAllTimers();
    
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
          this.audioManager.playBGM('game');
        }
        
        // 加载游戏数据
        return this.dataManager.getGameData();
      })
      .then(gameData => {
        // 准备游戏数据
        this.prepareGameData(gameData);
        
        // 检查是否需要显示教程
        const showTutorial = !gameData.tutorialCompleted;
        
        this.setData({
          gameData,
          isLoading: false,
          showTutorial
        });
        
        // 如果不需要显示教程，则开始游戏
        if (!showTutorial) {
          this.startGame();
        }
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
   * 准备游戏数据
   */
  prepareGameData: function (gameData) {
    // 准备可用食物
    const availableFood = gameConfig.food.items.filter(food => {
      // 检查是否已解锁
      return gameData.unlockedFood.includes(food.id);
    });
    
    // 准备拥有的设备
    const ownedEquipment = gameConfig.equipment.items.filter(equipment => {
      // 检查是否拥有
      return gameData.ownedItems.includes(equipment.id);
    });
    
    // 设置最大顾客数量
    const maxCustomers = gameData.maxCustomers || 3;
    
    this.setData({
      availableFood,
      ownedEquipment,
      maxCustomers
    });
  },
  
  /**
   * 开始游戏
   */
  startGame: function () {
    // 设置游戏状态为运行中
    this.setData({
      gameState: 'running',
      showTutorial: false
    });
    
    // 开始游戏计时器
    this.startGameTimer();
    
    // 开始生成顾客
    this.startCustomerGeneration();
    
    // 播放开始音效
    if (this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('game_start');
    }
  },
  
  /**
   * 暂停游戏
   */
  pauseGame: function () {
    // 设置游戏状态为暂停
    this.setData({
      gameState: 'paused',
      showPauseMenu: true
    });
    
    // 停止所有计时器
    this.clearAllTimers();
    
    // 播放暂停音效
    if (this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('pause');
    }
  },
  
  /**
   * 恢复游戏
   */
  resumeGame: function () {
    // 设置游戏状态为运行中
    this.setData({
      gameState: 'running',
      showPauseMenu: false
    });
    
    // 重新开始游戏计时器
    this.startGameTimer();
    
    // 重新开始顾客生成
    this.startCustomerGeneration();
    
    // 如果有正在烹饪的食物，继续烹饪
    if (this.data.cookingFood) {
      this.startCookingTimer();
    }
    
    // 播放恢复音效
    if (this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('resume');
    }
  },
  
  /**
   * 结束游戏
   */
  endGame: function () {
    // 设置游戏状态为结束
    this.setData({
      gameState: 'finished'
    });
    
    // 停止所有计时器
    this.clearAllTimers();
    
    // 计算当天统计数据
    this.calculateDailyStats();
    
    // 显示日结算界面
    this.showDayEndSummary();
    
    // 播放结束音效
    if (this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('game_end');
    }
  },
  
  /**
   * 开始新的一天
   */
  startNewDay: function () {
    // 更新游戏数据
    const gameData = this.data.gameData;
    gameData.daysPlayed += 1;
    gameData.totalEarnings += this.data.dailyStats.earnings;
    gameData.totalCustomers += this.data.dailyStats.customers;
    gameData.totalOrders += this.data.dailyStats.orders;
    gameData.perfectDishes += this.data.dailyStats.perfectDishes;
    
    // 计算新的平均评分
    const totalRatings = gameData.averageRating * (gameData.daysPlayed - 1) + this.data.dailyStats.averageRating;
    gameData.averageRating = totalRatings / gameData.daysPlayed;
    
    // 添加游戏历史记录
    this.dataManager.addHistory({
      day: gameData.daysPlayed,
      earnings: this.data.dailyStats.earnings,
      customers: this.data.dailyStats.customers,
      orders: this.data.dailyStats.orders,
      perfectDishes: this.data.dailyStats.perfectDishes,
      averageRating: this.data.dailyStats.averageRating
    });
    
    // 更新任务进度
    this.dataManager.updateTaskProgress('serve_customers', this.data.dailyStats.customers);
    this.dataManager.updateTaskProgress('earn_coins', this.data.dailyStats.earnings);
    this.dataManager.updateTaskProgress('perfect_dishes', this.data.dailyStats.perfectDishes);
    this.dataManager.updateTaskProgress('sell_food', this.data.dailyStats.orders);
    
    // 保存游戏数据
    this.dataManager.saveGameData(gameData)
      .then(() => {
        // 重置游戏状态
        this.setData({
          gameState: 'preparing',
          gameTime: 0,
          dayTime: 0,
          currentDay: this.data.currentDay + 1,
          dailyStats: {
            earnings: 0,
            customers: 0,
            orders: 0,
            perfectDishes: 0,
            averageRating: 0,
            ratings: []
          },
          customers: [],
          currentOrders: [],
          completedOrders: [],
          cookingFood: null,
          cookingProgress: 0,
          cookingQuality: 0,
          showDayEndSummary: false
        });
        
        // 开始新的一天
        this.startGame();
      })
      .catch(err => {
        console.error('保存游戏数据失败', err);
        wx.showToast({
          title: '保存游戏数据失败',
          icon: 'none'
        });
      });
  },
  
  /**
   * 返回主页
   */
  goToHome: function () {
    // 停止所有计时器
    this.clearAllTimers();
    
    // 停止背景音乐
    this.audioManager.stopBGM();
    
    // 返回主页
    wx.navigateBack();
  },
  
  /**
   * 开始游戏计时器
   */
  startGameTimer: function () {
    // 清除现有计时器
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
    
    // 创建新计时器，每秒更新一次
    this.gameTimer = setInterval(() => {
      // 更新游戏时间
      let gameTime = this.data.gameTime + 1;
      let dayTime = this.data.dayTime + 1;
      
      // 检查是否到达一天结束
      if (dayTime >= this.data.dayDuration) {
        this.endGame();
        return;
      }
      
      // 更新数据
      this.setData({
        gameTime,
        dayTime
      });
      
      // 更新顾客等待时间
      this.updateCustomersWaitTime();
      
    }, 1000);
  },
  
  /**
   * 开始顾客生成
   */
  startCustomerGeneration: function () {
    // 清除现有计时器
    if (this.customerTimer) {
      clearInterval(this.customerTimer);
    }
    
    // 获取顾客生成配置
    const genConfig = gameConfig.customer.generation;
    
    // 计算生成间隔
    const baseInterval = genConfig.baseInterval * 1000; // 转换为毫秒
    const variation = genConfig.intervalVariation * 1000; // 转换为毫秒
    
    // 创建新计时器，随机间隔生成顾客
    const generateCustomer = () => {
      // 检查是否可以生成新顾客
      if (this.data.customers.length < this.data.maxCustomers && this.data.gameState === 'running') {
        this.generateCustomer();
      }
      
      // 计算下一次生成时间
      const nextInterval = baseInterval + Math.random() * variation;
      
      // 设置下一次生成
      this.customerTimer = setTimeout(generateCustomer, nextInterval);
    };
    
    // 开始生成
    generateCustomer();
  },
  
  /**
   * 生成顾客
   */
  generateCustomer: function () {
    // 获取顾客类型
    const customerTypes = gameConfig.customer.types;
    
    // 根据权重随机选择顾客类型
    const totalWeight = customerTypes.reduce((sum, type) => sum + type.weight, 0);
    let randomWeight = Math.random() * totalWeight;
    let selectedType = customerTypes[0];
    
    for (const type of customerTypes) {
      if (randomWeight <= type.weight) {
        selectedType = type;
        break;
      }
      randomWeight -= type.weight;
    }
    
    // 生成随机顾客名称
    const name = util.generateRandomCustomerName();
    
    // 生成随机订单
    const order = util.generateRandomOrder(this.data.availableFood, 1, 3);
    
    // 计算订单总价
    const orderPrice = order.reduce((total, food) => total + food.price, 0);
    
    // 创建新顾客
    const customer = {
      id: Date.now().toString(),
      name,
      type: selectedType.id,
      image: selectedType.image,
      patience: selectedType.patience,
      maxPatience: selectedType.patience,
      tipChance: selectedType.tipChance,
      tipAmount: selectedType.tipAmount,
      order,
      orderPrice,
      waitTime: 0,
      state: 'waiting' // waiting, served, left
    };
    
    // 添加到顾客列表
    const customers = [...this.data.customers, customer];
    
    // 添加到订单列表
    const currentOrders = [...this.data.currentOrders, {
      id: customer.id,
      customerName: customer.name,
      items: customer.order,
      price: customer.orderPrice,
      state: 'pending' // pending, cooking, ready, served, failed
    }];
    
    // 更新数据
    this.setData({
      customers,
      currentOrders
    });
    
    // 播放顾客到来音效
    if (this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('customer_enter');
    }
  },
  
  /**
   * 更新顾客等待时间
   */
  updateCustomersWaitTime: function () {
    // 获取当前顾客列表
    const customers = [...this.data.customers];
    
    // 更新每个顾客的等待时间
    for (let i = 0; i < customers.length; i++) {
      if (customers[i].state === 'waiting') {
        customers[i].waitTime += 1;
        
        // 检查是否超过耐心值
        if (customers[i].waitTime >= customers[i].patience) {
          // 顾客离开
          customers[i].state = 'left';
          
          // 更新对应的订单状态
          const currentOrders = [...this.data.currentOrders];
          const orderIndex = currentOrders.findIndex(order => order.id === customers[i].id);
          
          if (orderIndex !== -1) {
            currentOrders[orderIndex].state = 'failed';
            
            this.setData({
              currentOrders
            });
          }
          
          // 播放顾客离开音效
          if (this.data.settings.isSoundEnabled) {
            this.audioManager.playSound('customer_leave_angry');
          }
          
          // 延迟移除顾客
          setTimeout(() => {
            this.removeCustomer(customers[i].id);
          }, 2000);
        }
      }
    }
    
    // 更新数据
    this.setData({
      customers
    });
  },
  
  /**
   * 移除顾客
   */
  removeCustomer: function (customerId) {
    // 获取当前顾客列表
    const customers = this.data.customers.filter(customer => customer.id !== customerId);
    
    // 更新数据
    this.setData({
      customers
    });
  },
  
  /**
   * 开始烹饪食物
   */
  startCooking: function (e) {
    // 获取选中的食物
    const foodId = e.currentTarget.dataset.id;
    const food = this.data.availableFood.find(item => item.id === foodId);
    
    // 检查是否已经在烹饪
    if (this.data.cookingFood) {
      wx.showToast({
        title: '已经在烹饪中',
        icon: 'none'
      });
      return;
    }
    
    // 检查是否有足够的设备
    const requiredEquipment = food.requiredEquipment || [];
    const hasEquipment = requiredEquipment.every(equipId => {
      return this.data.ownedEquipment.some(equip => equip.id === equipId);
    });
    
    if (!hasEquipment) {
      wx.showToast({
        title: '缺少必要设备',
        icon: 'none'
      });
      return;
    }
    
    // 设置烹饪状态
    this.setData({
      cookingFood: food,
      cookingProgress: 0,
      cookingQuality: 50 // 初始质量为50%
    });
    
    // 开始烹饪计时器
    this.startCookingTimer();
    
    // 播放烹饪开始音效
    if (this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('cooking_start');
    }
  },
  
  /**
   * 开始烹饪计时器
   */
  startCookingTimer: function () {
    // 清除现有计时器
    if (this.cookingTimer) {
      clearInterval(this.cookingTimer);
    }
    
    // 获取烹饪时间
    const cookingTime = this.data.cookingFood.cookTime;
    
    // 计算每次更新的进度
    const progressStep = 100 / (cookingTime * 10); // 每100ms更新一次，总共cookingTime秒
    
    // 创建新计时器，每100ms更新一次
    this.cookingTimer = setInterval(() => {
      // 更新烹饪进度
      let cookingProgress = this.data.cookingProgress + progressStep;
      
      // 检查是否完成烹饪
      if (cookingProgress >= 100) {
        cookingProgress = 100;
        this.finishCooking();
        return;
      }
      
      // 更新数据
      this.setData({
        cookingProgress
      });
    }, 100);
  },
  
  /**
   * 提升烹饪质量
   */
  boostCookingQuality: function () {
    // 检查是否在烹饪中
    if (!this.data.cookingFood) {
      return;
    }
    
    // 增加烹饪质量
    let cookingQuality = this.data.cookingQuality + 5;
    
    // 限制最大质量
    cookingQuality = Math.min(cookingQuality, 100);
    
    // 更新数据
    this.setData({
      cookingQuality
    });
    
    // 播放提升质量音效
    if (this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('quality_boost');
    }
  },
  
  /**
   * 完成烹饪
   */
  finishCooking: function () {
    // 清除烹饪计时器
    if (this.cookingTimer) {
      clearInterval(this.cookingTimer);
      this.cookingTimer = null;
    }
    
    // 获取烹饪的食物和质量
    const food = this.data.cookingFood;
    const quality = this.data.cookingQuality;
    
    // 检查是否有待处理的订单需要这个食物
    const currentOrders = [...this.data.currentOrders];
    let orderFound = false;
    
    for (let i = 0; i < currentOrders.length; i++) {
      if (currentOrders[i].state === 'pending') {
        // 检查订单中是否包含这个食物
        const foodIndex = currentOrders[i].items.findIndex(item => item.id === food.id);
        
        if (foodIndex !== -1) {
          // 更新订单状态
          currentOrders[i].items[foodIndex].cooked = true;
          currentOrders[i].items[foodIndex].quality = quality;
          
          // 检查订单是否全部完成
          const allCooked = currentOrders[i].items.every(item => item.cooked);
          
          if (allCooked) {
            currentOrders[i].state = 'ready';
          }
          
          orderFound = true;
          break;
        }
      }
    }
    
    // 如果没有找到对应订单，则作为额外食物
    if (!orderFound) {
      // 可以添加到额外食物列表，或者给予一些惩罚
      wx.showToast({
        title: '没有订单需要这个食物',
        icon: 'none'
      });
    }
    
    // 更新数据
    this.setData({
      currentOrders,
      cookingFood: null,
      cookingProgress: 0,
      cookingQuality: 0
    });
    
    // 播放烹饪完成音效
    if (this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('cooking_complete');
    }
  },
  
  /**
   * 上菜
   */
  serveOrder: function (e) {
    // 获取订单ID
    const orderId = e.currentTarget.dataset.id;
    
    // 获取订单和顾客
    const order = this.data.currentOrders.find(order => order.id === orderId);
    const customer = this.data.customers.find(customer => customer.id === orderId);
    
    // 检查订单是否准备好
    if (!order || order.state !== 'ready') {
      wx.showToast({
        title: '订单尚未准备好',
        icon: 'none'
      });
      return;
    }
    
    // 检查顾客是否还在等待
    if (!customer || customer.state !== 'waiting') {
      wx.showToast({
        title: '顾客已离开',
        icon: 'none'
      });
      return;
    }
    
    // 计算食物质量平均值
    const totalQuality = order.items.reduce((sum, item) => sum + (item.quality || 0), 0);
    const averageQuality = totalQuality / order.items.length;
    
    // 计算是否是完美料理
    const isPerfect = averageQuality >= 95;
    
    // 计算顾客满意度
    const satisfaction = util.calculateCustomerSatisfaction({
      waitTime: customer.waitTime,
      foodQuality: averageQuality,
      orderCorrect: true
    });
    
    // 计算小费
    let tip = 0;
    if (Math.random() < customer.tipChance) {
      // 根据满意度调整小费概率
      const tipMultiplier = satisfaction / 100;
      const [minTip, maxTip] = customer.tipAmount;
      tip = Math.round(util.randomInt(minTip, maxTip) * tipMultiplier);
    }
    
    // 计算总收入
    const totalEarnings = order.price + tip;
    
    // 更新统计数据
    const dailyStats = { ...this.data.dailyStats };
    dailyStats.earnings += totalEarnings;
    dailyStats.customers += 1;
    dailyStats.orders += 1;
    
    if (isPerfect) {
      dailyStats.perfectDishes += 1;
    }
    
    // 计算评分（1-5分）
    const rating = util.calculateGameRating({
      customerSatisfaction: satisfaction,
      foodQuality: averageQuality,
      serviceSpeed: Math.max(0, 100 - (customer.waitTime / customer.maxPatience) * 100),
      shopCleanliness: 80 // 默认值，可以根据游戏机制调整
    });
    
    // 添加评分到统计
    dailyStats.ratings.push(rating);
    dailyStats.averageRating = dailyStats.ratings.reduce((sum, r) => sum + r, 0) / dailyStats.ratings.length;
    
    // 更新订单状态
    const currentOrders = this.data.currentOrders.map(o => {
      if (o.id === orderId) {
        return { ...o, state: 'served' };
      }
      return o;
    });
    
    // 更新顾客状态
    const customers = this.data.customers.map(c => {
      if (c.id === orderId) {
        return { ...c, state: 'served' };
      }
      return c;
    });
    
    // 添加到已完成订单
    const completedOrders = [...this.data.completedOrders, {
      ...order,
      state: 'served',
      satisfaction,
      tip,
      totalEarnings,
      isPerfect
    }];
    
    // 更新数据
    this.setData({
      currentOrders,
      customers,
      completedOrders,
      dailyStats
    });
    
    // 显示收入提示
    wx.showToast({
      title: `+${totalEarnings} 金币`,
      icon: 'success'
    });
    
    // 播放上菜音效
    if (this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('serve_order');
    }
    
    // 延迟移除顾客
    setTimeout(() => {
      this.removeCustomer(orderId);
    }, 2000);
  },
  
  /**
   * 计算当天统计数据
   */
  calculateDailyStats: function () {
    // 已经在每次上菜时更新了统计数据，这里可以做一些额外的计算
    const dailyStats = { ...this.data.dailyStats };
    
    // 计算失败订单数
    const failedOrders = this.data.currentOrders.filter(order => order.state === 'failed').length;
    dailyStats.failedOrders = failedOrders;
    
    // 计算成功率
    const totalOrders = dailyStats.orders + failedOrders;
    dailyStats.successRate = totalOrders > 0 ? (dailyStats.orders / totalOrders) * 100 : 0;
    
    // 更新数据
    this.setData({
      dailyStats
    });
  },
  
  /**
   * 显示日结算界面
   */
  showDayEndSummary: function () {
    this.setData({
      showDayEndSummary: true
    });
    
    // 播放结算音效
    if (this.data.settings.isSoundEnabled) {
      this.audioManager.playSound('day_end');
    }
  },
  
  /**
   * 清除所有计时器
   */
  clearAllTimers: function () {
    // 清除游戏计时器
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
    
    // 清除顾客生成计时器
    if (this.customerTimer) {
      clearTimeout(this.customerTimer);
      this.customerTimer = null;
    }
    
    // 清除烹饪计时器
    if (this.cookingTimer) {
      clearInterval(this.cookingTimer);
      this.cookingTimer = null;
    }
  },
  
  /**
   * 完成教程
   */
  completeTutorial: function () {
    // 更新游戏数据
    const gameData = this.data.gameData;
    gameData.tutorialCompleted = true;
    
    // 保存游戏数据
    this.dataManager.saveGameData(gameData)
      .then(() => {
        // 开始游戏
        this.startGame();
      })
      .catch(err => {
        console.error('保存游戏数据失败', err);
        // 即使保存失败也开始游戏
        this.startGame();
      });
  }
})