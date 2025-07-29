/**
 * 早餐店模拟器 - 数据管理器
 * 用于管理游戏中的数据存储和读取
 */

class DataManager {
  constructor() {
    // 存储键名
    this.storageKeys = {
      gameData: 'breakfast_simulator_game_data',
      settings: 'breakfast_simulator_settings',
      userInfo: 'breakfast_simulator_user_info'
    };

    // 默认游戏数据
    this.defaultGameData = {
      // 基本信息
      shopName: '我的早餐店',
      level: 1,
      exp: 0,
      expToNextLevel: 100,
      coins: 500,
      gems: 0,

      // 游戏统计
      daysPlayed: 0,
      totalEarnings: 0,
      totalCustomers: 0,
      totalOrders: 0,
      perfectDishes: 0,
      averageRating: 0,

      // 店铺信息
      shopLevel: 1,
      shopReputation: 0,
      maxCustomers: 5,
      customerPatience: 30,
      cookingSpeed: 1,

      // 拥有的物品
      ownedItems: ['pan', 'bacon', 'egg'],

      // 解锁的食物
      unlockedFood: ['bacon_and_egg'],

      // 当前装备
      currentEquipment: {
        cookware: 'pan',
        decoration: 'basic_wallpaper',
        floor: 'basic_floor'
      },

      // 游戏进度
      tutorialCompleted: false,
      storyProgress: 0,

      // 连续登录
      lastLoginDate: '',
      consecutiveLoginDays: 0,

      // 每日任务
      dailyTasks: [],

      // 成就进度
      achievements: {},

      // 游戏历史记录
      history: []
    };

    // 默认设置
    this.defaultSettings = {
      isSoundEnabled: true,
      isMusicEnabled: true,
      isNotificationEnabled: true,
      isVibrationEnabled: true,
      language: 'zh_CN',
      theme: 'default'
    };
  }

  /**
   * 获取游戏数据
   * @returns {Promise} 返回游戏数据的Promise
   */
  getGameData() {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: this.storageKeys.gameData,
        success: (res) => {
          resolve(res.data);
        },
        fail: (err) => {
          console.log('获取游戏数据失败，使用默认数据', err);
          // 使用默认数据
          this.saveGameData(this.defaultGameData)
            .then(() => {
              resolve(this.defaultGameData);
            })
            .catch(reject);
        }
      });
    });
  }

  /**
   * 保存游戏数据
   * @param {Object} gameData - 游戏数据
   * @returns {Promise} 返回保存结果的Promise
   */
  saveGameData(gameData) {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: this.storageKeys.gameData,
        data: gameData,
        success: () => {
          resolve();
        },
        fail: (err) => {
          console.error('保存游戏数据失败', err);
          reject(err);
        }
      });
    });
  }

  /**
   * 更新游戏数据
   * @param {Object} newData - 要更新的数据
   * @returns {Promise} 返回更新后的游戏数据的Promise
   */
  updateGameData(newData) {
    return this.getGameData()
      .then((gameData) => {
        // 合并数据
        const updatedData = { ...gameData, ...newData };

        // 保存更新后的数据
        return this.saveGameData(updatedData)
          .then(() => updatedData);
      });
  }

  /**
   * 重置游戏数据
   * @returns {Promise} 返回重置结果的Promise
   */
  resetGameData() {
    return this.saveGameData(this.defaultGameData)
      .then(() => this.defaultGameData);
  }

  /**
   * 获取设置
   * @returns {Promise} 返回设置数据的Promise
   */
  getSettings() {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: this.storageKeys.settings,
        success: (res) => {
          resolve(res.data);
        },
        fail: (err) => {
          console.log('获取设置失败，使用默认设置', err);
          // 使用默认设置
          this.saveSettings(this.defaultSettings)
            .then(() => {
              resolve(this.defaultSettings);
            })
            .catch(reject);
        }
      });
    });
  }

  /**
   * 保存设置
   * @param {Object} settings - 设置数据
   * @returns {Promise} 返回保存结果的Promise
   */
  saveSettings(settings) {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: this.storageKeys.settings,
        data: settings,
        success: () => {
          resolve();
        },
        fail: (err) => {
          console.error('保存设置失败', err);
          reject(err);
        }
      });
    });
  }

  /**
   * 更新设置
   * @param {Object} newSettings - 要更新的设置
   * @returns {Promise} 返回更新后的设置的Promise
   */
  updateSettings(newSettings) {
    return this.getSettings()
      .then((settings) => {
        // 合并设置
        const updatedSettings = { ...settings, ...newSettings };

        // 保存更新后的设置
        return this.saveSettings(updatedSettings)
          .then(() => updatedSettings);
      });
  }

  /**
   * 保存用户信息
   * @param {Object} userInfo - 用户信息
   * @returns {Promise} 返回保存结果的Promise
   */
  saveUserInfo(userInfo) {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: this.storageKeys.userInfo,
        data: userInfo,
        success: () => {
          resolve();
        },
        fail: (err) => {
          console.error('保存用户信息失败', err);
          reject(err);
        }
      });
    });
  }

  /**
   * 获取用户信息
   * @returns {Promise} 返回用户信息的Promise
   */
  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: this.storageKeys.userInfo,
        success: (res) => {
          resolve(res.data);
        },
        fail: (err) => {
          console.log('获取用户信息失败', err);
          resolve(null);
        }
      });
    });
  }

  /**
   * 检查并更新每日登录
   * @returns {Promise} 返回更新后的游戏数据的Promise
   */
  checkDailyLogin() {
    return this.getGameData()
      .then((gameData) => {
        const today = new Date().toISOString().split('T')[0];
        const lastLoginDate = gameData.lastLoginDate;

        // 如果是第一次登录或者不是今天登录的
        if (!lastLoginDate || lastLoginDate !== today) {
          // 更新最后登录日期
          gameData.lastLoginDate = today;

          // 检查是否连续登录
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (lastLoginDate === yesterdayStr) {
            // 连续登录天数+1
            gameData.consecutiveLoginDays = (gameData.consecutiveLoginDays || 0) + 1;
          } else {
            // 重置连续登录天数
            gameData.consecutiveLoginDays = 1;
          }

          // 生成每日任务
          gameData.dailyTasks = this.generateDailyTasks();

          // 保存更新后的数据
          return this.saveGameData(gameData)
            .then(() => gameData);
        }

        return gameData;
      });
  }

  /**
   * 生成每日任务
   * @returns {Array} 返回每日任务数组
   */
  generateDailyTasks() {
    // 任务类型
    const taskTypes = [
      { type: 'serve_customers', name: '服务顾客', min: 5, max: 20 },
      { type: 'earn_coins', name: '赚取金币', min: 100, max: 500 },
      { type: 'perfect_dishes', name: '制作完美料理', min: 1, max: 5 },
      { type: 'sell_food', name: '售卖食物', min: 3, max: 15 }
    ];

    // 随机选择3个任务
    const tasks = [];
    const selectedTypes = new Set();

    while (tasks.length < 3 && selectedTypes.size < taskTypes.length) {
      // 随机选择一个任务类型
      const randomIndex = Math.floor(Math.random() * taskTypes.length);
      const taskType = taskTypes[randomIndex];

      // 如果已经选择过这个类型，则跳过
      if (selectedTypes.has(taskType.type)) {
        continue;
      }

      // 标记为已选择
      selectedTypes.add(taskType.type);

      // 生成任务目标数量
      const target = Math.floor(Math.random() * (taskType.max - taskType.min + 1)) + taskType.min;

      // 生成奖励
      const coinReward = target * 10;
      const gemReward = Math.floor(target / 5);

      // 添加任务
      tasks.push({
        id: `${taskType.type}_${Date.now()}_${tasks.length}`,
        type: taskType.type,
        name: taskType.name,
        description: `${taskType.name} ${target} 次`,
        target: target,
        progress: 0,
        completed: false,
        rewards: {
          coins: coinReward,
          gems: gemReward
        }
      });
    }

    return tasks;
  }

  /**
   * 完成每日任务
   * @param {string} taskId - 任务ID
   * @returns {Promise} 返回更新后的游戏数据的Promise
   */
  completeTask(taskId) {
    return this.getGameData()
      .then((gameData) => {
        // 查找任务
        const taskIndex = gameData.dailyTasks.findIndex(task => task.id === taskId);

        if (taskIndex === -1) {
          throw new Error('任务不存在');
        }

        const task = gameData.dailyTasks[taskIndex];

        // 如果任务已完成，则不做任何操作
        if (task.completed) {
          return gameData;
        }

        // 标记任务为已完成
        task.completed = true;

        // 添加奖励
        gameData.coins = (gameData.coins || 0) + (task.rewards.coins || 0);
        gameData.gems = (gameData.gems || 0) + (task.rewards.gems || 0);

        // 更新任务
        gameData.dailyTasks[taskIndex] = task;

        // 保存更新后的数据
        return this.saveGameData(gameData)
          .then(() => gameData);
      });
  }

  /**
   * 更新任务进度
   * @param {string} taskType - 任务类型
   * @param {number} progress - 进度增量
   * @returns {Promise} 返回更新后的游戏数据的Promise
   */
  updateTaskProgress(taskType, progress = 1) {
    return this.getGameData()
      .then((gameData) => {
        // 查找相关任务
        const tasks = gameData.dailyTasks || [];
        let updated = false;

        tasks.forEach((task, index) => {
          if (task.type === taskType && !task.completed) {
            // 更新进度
            task.progress = Math.min(task.progress + progress, task.target);

            // 检查是否完成
            if (task.progress >= task.target) {
              task.completed = true;
            }

            // 更新任务
            gameData.dailyTasks[index] = task;
            updated = true;
          }
        });

        // 如果有更新，则保存数据
        if (updated) {
          return this.saveGameData(gameData)
            .then(() => gameData);
        }

        return gameData;
      });
  }

  /**
   * 添加游戏历史记录
   * @param {Object} record - 历史记录
   * @returns {Promise} 返回更新后的游戏数据的Promise
   */
  addHistory(record) {
    return this.getGameData()
      .then((gameData) => {
        // 确保有历史记录数组
        if (!gameData.history) {
          gameData.history = [];
        }

        // 添加记录
        gameData.history.unshift({
          ...record,
          timestamp: Date.now()
        });

        // 限制历史记录数量
        if (gameData.history.length > 30) {
          gameData.history = gameData.history.slice(0, 30);
        }

        // 保存更新后的数据
        return this.saveGameData(gameData)
          .then(() => gameData);
      });
  }
}

module.exports = DataManager;
