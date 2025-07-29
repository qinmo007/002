// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const { type, scope, limit = 50, openid } = event

  // 获取当前用户的openid
  const wxContext = cloud.getWXContext()
  const userOpenId = openid || wxContext.OPENID

  try {
    // 根据排行榜类型和范围获取数据
    let rankingData = []
    let userRank = null

    // 排行榜类型：totalIncome(总收入), shopLevel(店铺等级), customerCount(顾客数量), recipeUnlock(食谱解锁)
    // 排行榜范围：friends(好友), global(全球)

    // 构建查询条件
    const collection = db.collection('user_stats')
    let query = collection.aggregate()

    // 如果是好友排行，需要先获取好友列表
    if (scope === 'friends') {
      const userInfo = await db.collection('users').doc(userOpenId).get()
      const friendList = userInfo.data.friends || []

      // 添加自己
      friendList.push(userOpenId)

      // 只查询好友数据
      query = query.match({
        _openid: _.in(friendList)
      })
    }

    // 根据排行类型选择排序字段
    let sortField = ''
    switch (type) {
      case 'totalIncome':
        sortField = 'stats.totalIncome'
        break
      case 'shopLevel':
        sortField = 'stats.shopLevel'
        break
      case 'customerCount':
        sortField = 'stats.customerCount'
        break
      case 'recipeUnlock':
        sortField = 'stats.recipeUnlockCount'
        break
      default:
        sortField = 'stats.totalIncome'
    }

    // 执行排序和限制
    const result = await query
      .sort({
        [sortField]: -1, // 降序排序
        updateTime: -1 // 同分数时，最近更新的排前面
      })
      .limit(limit)
      .lookup({
        from: 'users',
        localField: '_openid',
        foreignField: '_openid',
        as: 'userInfo'
      })
      .project({
        _openid: 1,
        stats: 1,
        userInfo: { $arrayElemAt: ['$userInfo', 0] },
        rank: $.rank($.descending([`$${sortField}`]))
      })
      .end()

    rankingData = result.list.map((item, index) => {
      // 格式化排行榜数据
      const formattedItem = {
        rank: index + 1, // 排名从1开始
        openid: item._openid,
        avatarUrl: item.userInfo ? item.userInfo.avatarUrl : '',
        nickName: item.userInfo ? item.userInfo.nickName : '未知用户',
        value: 0, // 根据类型获取对应的值
        isCurrentUser: item._openid === userOpenId
      }

      // 根据排行类型设置值
      switch (type) {
        case 'totalIncome':
          formattedItem.value = item.stats.totalIncome || 0
          break
        case 'shopLevel':
          formattedItem.value = item.stats.shopLevel || 1
          break
        case 'customerCount':
          formattedItem.value = item.stats.customerCount || 0
          break
        case 'recipeUnlock':
          formattedItem.value = item.stats.recipeUnlockCount || 0
          break
      }

      // 记录当前用户的排名
      if (item._openid === userOpenId) {
        userRank = formattedItem
      }

      return formattedItem
    })

    // 如果当前用户不在排行榜中，单独查询用户排名
    if (!userRank) {
      const userStats = await db.collection('user_stats').where({
        _openid: userOpenId
      }).get()

      if (userStats.data.length > 0) {
        // 计算用户排名
        const userStatData = userStats.data[0]

        // 查询比用户分数高的人数
        const higherRanks = await db.collection('user_stats')
          .where({
            [`stats.${type}`]: _.gt(userStatData.stats[type] || 0)
          })
          .count()

        // 用户排名 = 比自己高的人数 + 1
        const userRankNumber = higherRanks.total + 1

        // 获取用户信息
        const userInfo = await db.collection('users').doc(userOpenId).get()

        userRank = {
          rank: userRankNumber,
          openid: userOpenId,
          avatarUrl: userInfo.data.avatarUrl || '',
          nickName: userInfo.data.nickName || '未知用户',
          value: userStatData.stats[type] || 0,
          isCurrentUser: true
        }
      }
    }

    return {
      success: true,
      data: {
        list: rankingData,
        userRank: userRank,
        type: type,
        scope: scope
      }
    }

  } catch (error) {
    console.error('获取排行榜数据失败', error)
    return {
      success: false,
      error: error.message
    }
  }
}
