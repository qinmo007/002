/**
 * 更新游戏数据云函数
 * 负责更新玩家的游戏数据，如金币、等级等
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

  // 获取要更新的玩家数据
  const playerData = event.playerData

  if (!playerData) {
    return {
      success: false,
      error: '未提供玩家数据'
    }
  }

  try {
    // 查询用户游戏数据
    const userGameData = await gameDataCollection.where({
      _openid: openId
    }).get()

    // 如果用户数据不存在，返回错误
    if (!userGameData.data || userGameData.data.length === 0) {
      return {
        success: false,
        error: '用户数据不存在'
      }
    }

    const gameData = userGameData.data[0]

    // 准备更新的数据
    const updateData = {
      ...playerData,
      lastUpdateTime: Date.now()
    }

    // 更新数据库
    await gameDataCollection.doc(gameData._id).update({
      data: updateData
    })

    return {
      success: true,
      message: '游戏数据更新成功'
    }
  } catch (error) {
    console.error('更新游戏数据失败:', error)

    return {
      success: false,
      error: error.message || '更新游戏数据失败'
    }
  }
}
