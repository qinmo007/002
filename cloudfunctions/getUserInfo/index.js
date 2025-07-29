/**
 * 获取用户信息云函数
 * 负责获取用户的基本信息，如OpenID等
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化云开发
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取数据库引用
const db = cloud.database()
const userCollection = db.collection('users')

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取用户OpenID
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const appId = wxContext.APPID
  const unionId = wxContext.UNIONID

  if (!openId) {
    return {
      success: false,
      error: '无法获取用户OpenID'
    }
  }

  try {
    // 查询用户信息
    const userInfo = await userCollection.where({
      _openid: openId
    }).get()

    // 如果用户信息存在，更新最后访问时间
    if (userInfo.data && userInfo.data.length > 0) {
      const user = userInfo.data[0]

      // 更新最后访问时间
      await userCollection.doc(user._id).update({
        data: {
          lastAccessTime: Date.now()
        }
      })

      return {
        success: true,
        openid: openId,
        appid: appId,
        unionid: unionId,
        userInfo: user
      }
    }

    // 如果用户信息不存在，创建新用户
    const newUser = {
      _openid: openId,
      appid: appId,
      unionid: unionId,
      createTime: Date.now(),
      lastAccessTime: Date.now(),
      // 可以添加其他默认用户信息
      nickname: '',
      avatarUrl: '',
      gender: 0,
      country: '',
      province: '',
      city: '',
      language: 'zh_CN'
    }

    // 添加到数据库
    const result = await userCollection.add({
      data: newUser
    })

    if (result._id) {
      return {
        success: true,
        openid: openId,
        appid: appId,
        unionid: unionId,
        userInfo: newUser,
        isNewUser: true
      }
    } else {
      return {
        success: false,
        error: '创建用户信息失败'
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)

    // 如果发生错误，至少返回OpenID
    return {
      success: false,
      error: error.message || '获取用户信息失败',
      openid: openId,
      appid: appId,
      unionid: unionId
    }
  }
}
