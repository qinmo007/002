/**
 * 玩家类
 * 负责管理玩家的数据，包括金钱、经验、等级、解锁的设备和食谱等
 */

export default class Player {
  constructor(game) {
    this.game = game

    // 玩家基本信息
    this.name = '店长'
    this.avatar = ''
    this.level = 1
    this.exp = 0
    this.money = 500 // 初始资金
    this.reputation = 0 // 声誉值

    // 解锁的设备和食谱
    this.unlockedEquipment = ['pan'] // 初始解锁煎锅
    this.unlockedRecipes = ['egg', 'toast'] // 初始解锁食谱：煎蛋和吐司

    // 成就和任务
    this.achievements = []
    this.completedTasks = []
    this.currentTasks = []

    // 统计数据
    this.stats = {
      totalEarnings: 0,
      totalCustomers: 0,
      totalDishesServed: 0,
      totalDaysPlayed: 0,
      bestDayEarnings: 0,
      bestDayCustomers: 0
    }

    // 加载玩家数据
    this.loadPlayerData()
  }

  /**
   * 加载玩家数据
   */
  async loadPlayerData() {
    try {
      // 尝试从云端加载玩家数据
      const playerData = await this.game.cloudManager.getPlayerData()

      if (playerData) {
        // 更新玩家数据
        this.updatePlayerData(playerData)
        console.log('玩家数据加载成功')
      } else {
        // 如果没有云端数据，则创建新玩家
        console.log('创建新玩家数据')
        this.savePlayerData()
      }
    } catch (error) {
      console.error('加载玩家数据失败:', error)
    }
  }

  /**
   * 更新玩家数据
   */
  updatePlayerData(data) {
    // 更新基本信息
    this.name = data.name || this.name
    this.avatar = data.avatar || this.avatar
    this.level = data.level || this.level
    this.exp = data.exp || this.exp
    this.money = data.money || this.money
    this.reputation = data.reputation || this.reputation

    // 更新解锁的设备和食谱
    this.unlockedEquipment = data.unlockedEquipment || this.unlockedEquipment
    this.unlockedRecipes = data.unlockedRecipes || this.unlockedRecipes

    // 更新成就和任务
    this.achievements = data.achievements || this.achievements
    this.completedTasks = data.completedTasks || this.completedTasks
    this.currentTasks = data.currentTasks || this.currentTasks

    // 更新统计数据
    this.stats = data.stats || this.stats
  }

  /**
   * 保存玩家数据
   */
  async savePlayerData() {
    try {
      // 构建玩家数据对象
      const playerData = {
        name: this.name,
        avatar: this.avatar,
        level: this.level,
        exp: this.exp,
        money: this.money,
        reputation: this.reputation,
        unlockedEquipment: this.unlockedEquipment,
        unlockedRecipes: this.unlockedRecipes,
        achievements: this.achievements,
        completedTasks: this.completedTasks,
        currentTasks: this.currentTasks,
        stats: this.stats,
        lastSaved: new Date().toISOString()
      }

      // 保存到云端
      await this.game.cloudManager.savePlayerData(playerData)
      console.log('玩家数据保存成功')
    } catch (error) {
      console.error('保存玩家数据失败:', error)
    }
  }

  /**
   * 增加经验值
   */
  addExp(amount) {
    this.exp += amount

    // 检查是否升级
    this.checkLevelUp()

    // 保存数据
    this.savePlayerData()
  }

  /**
   * 检查是否升级
   */
  checkLevelUp() {
    // 计算升级所需经验
    const expNeeded = this.level * 100

    if (this.exp >= expNeeded) {
      // 升级
      this.level++
      this.exp -= expNeeded

      // 升级奖励
      this.money += this.level * 50

      console.log(`恭喜升级到 ${this.level} 级！`)

      // 检查是否解锁新设备或食谱
      this.checkUnlocks()

      // 继续检查是否可以再次升级
      this.checkLevelUp()
    }
  }

  /**
   * 检查是否解锁新设备或食谱
   */
  checkUnlocks() {
    // 根据等级解锁新设备
    switch (this.level) {
      case 2:
        this.unlockEquipment('steamer') // 解锁蒸笼
        this.unlockRecipe('congee') // 解锁粥
        break
      case 3:
        this.unlockEquipment('drink_machine') // 解锁饮料机
        this.unlockRecipe('soy_milk') // 解锁豆浆
        break
      case 5:
        this.unlockRecipe('dumpling') // 解锁饺子
        break
      case 7:
        this.unlockEquipment('oven') // 解锁烤箱
        this.unlockRecipe('cake') // 解锁蛋糕
        break
      case 10:
        this.unlockRecipe('coffee') // 解锁咖啡
        break
    }
  }

  /**
   * 解锁设备
   */
  unlockEquipment(equipmentId) {
    if (!this.unlockedEquipment.includes(equipmentId)) {
      this.unlockedEquipment.push(equipmentId)
      console.log(`解锁新设备: ${equipmentId}`)

      // 通知厨房更新设备
      this.game.kitchen.updateEquipment()
    }
  }

  /**
   * 解锁食谱
   */
  unlockRecipe(recipeId) {
    if (!this.unlockedRecipes.includes(recipeId)) {
      this.unlockedRecipes.push(recipeId)
      console.log(`解锁新食谱: ${recipeId}`)
    }
  }

  /**
   * 增加金钱
   */
  addMoney(amount) {
    this.money += amount
    this.stats.totalEarnings += amount

    // 更新最佳日收入
    const todayEarnings = this.game.timeManager.getDayEarnings()
    if (todayEarnings > this.stats.bestDayEarnings) {
      this.stats.bestDayEarnings = todayEarnings
    }

    // 保存数据
    this.savePlayerData()
  }

  /**
   * 减少金钱
   */
  spendMoney(amount) {
    if (this.money >= amount) {
      this.money -= amount

      // 保存数据
      this.savePlayerData()

      return true
    }

    return false
  }

  /**
   * 增加声誉值
   */
  addReputation(amount) {
    this.reputation += amount

    // 保存数据
    this.savePlayerData()
  }

  /**
   * 减少声誉值
   */
  reduceReputation(amount) {
    this.reputation = Math.max(0, this.reputation - amount)

    // 保存数据
    this.savePlayerData()
  }

  /**
   * 完成任务
   */
  completeTask(taskId) {
    // 从当前任务中移除
    this.currentTasks = this.currentTasks.filter(task => task.id !== taskId)

    // 添加到已完成任务
    this.completedTasks.push(taskId)

    // 保存数据
    this.savePlayerData()
  }

  /**
   * 解锁成就
   */
  unlockAchievement(achievementId) {
    if (!this.achievements.includes(achievementId)) {
      this.achievements.push(achievementId)
      console.log(`解锁新成就: ${achievementId}`)

      // 保存数据
      this.savePlayerData()
    }
  }

  /**
   * 更新统计数据
   */
  updateStats(key, value) {
    if (this.stats.hasOwnProperty(key)) {
      this.stats[key] += value

      // 检查是否解锁相关成就
      this.checkStatsAchievements()

      // 保存数据
      this.savePlayerData()
    }
  }

  /**
   * 检查统计数据相关成就
   */
  checkStatsAchievements() {
    // 根据统计数据解锁成就
    if (this.stats.totalCustomers >= 100 && !this.achievements.includes('customers_100')) {
      this.unlockAchievement('customers_100')
    }

    if (this.stats.totalDishesServed >= 500 && !this.achievements.includes('dishes_500')) {
      this.unlockAchievement('dishes_500')
    }

    if (this.stats.totalEarnings >= 10000 && !this.achievements.includes('earnings_10000')) {
      this.unlockAchievement('earnings_10000')
    }
  }
}
