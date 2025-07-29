/**
 * 获取游戏数据云函数
 * 负责获取玩家的游戏数据，如果不存在则创建默认数据
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化云开发
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取数据库引用
const db = cloud.database()
const gameDataCollection = db.collection('gameData')

// 默认游戏数据
const DEFAULT_GAME_DATA = {
  // 玩家基本信息
  player: {
    money: 1000,          // 初始金钱
    level: 1,             // 初始等级
    experience: 0,        // 初始经验
    reputation: 0,        // 初始声誉
    totalDaysPlayed: 0,   // 已游玩天数
    totalCustomers: 0,    // 总顾客数
    totalEarnings: 0      // 总收入
  },

  // 已解锁的设备
  unlockedEquipment: [
    {
      id: 'stove',        // 炉灶
      level: 1,           // 设备等级
      durability: 100     // 耐久度
    }
  ],

  // 已解锁的食谱
  unlockedRecipes: [
    'fried_egg',          // 煎蛋
    'scrambled_egg',      // 炒鸡蛋
    'bacon',              // 培根
    'sausage'             // 香肠
  ],

  // 库存物品
  inventory: [
    {
      id: 'egg',          // 鸡蛋
      name: '鸡蛋',
      quantity: 50,       // 数量
      maxQuantity: 100    // 最大库存
    },
    {
      id: 'bacon',        // 培根
      name: '培根',
      quantity: 30,
      maxQuantity: 50
    },
    {
      id: 'sausage',      // 香肠
      name: '香肠',
      quantity: 30,
      maxQuantity: 50
    },
    {
      id: 'bread',        // 面包
      name: '面包',
      quantity: 20,
      maxQuantity: 40
    }
  ],

  // 游戏统计数据
  stats: {
    bestDayEarnings: 0,   // 最佳单日收入
    bestDayCustomers: 0,  // 最佳单日顾客数
    totalFoodCooked: 0,   // 总烹饪食物数
    totalFoodSold: 0,     // 总售出食物数
    totalEquipmentUpgrades: 0  // 总设备升级次数
  },

  // 已完成的成就
  achievements: [],

  // 游戏设置
  settings: {
    musicVolume: 0.5,     // 音乐音量
    soundVolume: 0.8,     // 音效音量
    isMusicEnabled: true, // 是否启用音乐
    isSoundEnabled: true  // 是否启用音效
  },

  // 最后更新时间
  lastUpdateTime: Date.now()
}

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取用户OpenID
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID

  if (!openId) {
    return {
      success: false,
      error: '无法获取用户OpenID'
    }
  }

  try {
    // 查询用户游戏数据
    const userGameData = await gameDataCollection.where({
      _openid: openId
    }).get()

    // 如果用户数据存在，直接返回
    if (userGameData.data && userGameData.data.length > 0) {
      const gameData = userGameData.data[0]

      // 更新最后访问时间
      await gameDataCollection.doc(gameData._id).update({
        data: {
          lastAccessTime: Date.now()
        }
      })

      return {
        success: true,
        data: gameData
      }
    }

    // 如果用户数据不存在，创建默认数据
    const defaultData = {
      ...DEFAULT_GAME_DATA,
      _openid: openId,
      createTime: Date.now(),
      lastAccessTime: Date.now()
    }

    // 添加到数据库
    const result = await gameDataCollection.add({
      data: defaultData
    })

    if (result._id) {
      return {
        success: true,
        data: defaultData,
        isNewUser: true
      }
    } else {
      return {
        success: false,
        error: '创建用户数据失败'
      }
    }
  } catch (error) {
    console.error('获取游戏数据失败:', error)

    return {
      success: false,
      error: error.message || '获取游戏数据失败'
    }
  }
}
/**