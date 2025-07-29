/**
 * 游戏辅助函数
 */

/**
 * 根据权重随机选择一个元素
 * @param {Array} items 元素数组
 * @param {Array} weights 权重数组
 * @returns {*} 选中的元素
 */
const weightedRandom = function(items, weights) {
  // 计算权重总和
  let totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

  // 生成随机数
  let random = Math.random() * totalWeight

  // 根据权重选择元素
  for (let i = 0; i < items.length; i++) {
    if (random < weights[i]) {
      return items[i]
    }
    random -= weights[i]
  }

  // 默认返回第一个元素
  return items[0]
}

/**
 * 生成随机顾客位置
 * @returns {Object} 位置对象 {x, y}
 */
const getRandomCustomerPosition = function() {
  // 生成随机位置（屏幕左右两侧）
  const side = Math.random() > 0.5 ? 'left' : 'right'
  const x = side === 'left' ? Math.random() * 0.3 : 0.7 + Math.random() * 0.3
  const y = 0.3 + Math.random() * 0.4 // 屏幕中部

  return { x, y }
}

/**
 * 计算星级评分
 * @param {Number} servedCount 已服务顾客数
 * @param {Number} targetCount 目标顾客数
 * @param {Number} timeRemaining 剩余时间
 * @param {Number} totalTime 总时间
 * @returns {Number} 星级评分（1-5）
 */
const calculateStarRating = function(servedCount, targetCount, timeRemaining, totalTime) {
  // 基础评分：根据完成目标的百分比
  const completionRatio = servedCount / targetCount
  let stars = 0

  if (completionRatio >= 1) {
    // 达成目标
    stars = 3

    // 额外星级：根据剩余时间
    const timeRatio = timeRemaining / totalTime
    if (timeRatio > 0.3) stars++
    if (timeRatio > 0.6) stars++
  } else if (completionRatio >= 0.8) {
    // 接近目标
    stars = 2

    // 额外星级：根据完成度
    if (completionRatio >= 0.9) stars++
  } else if (completionRatio >= 0.5) {
    // 完成一半
    stars = 1

    // 额外星级：根据完成度
    if (completionRatio >= 0.7) stars++
  } else {
    // 未达到一半
    stars = 1
  }

  return stars
}

/**
 * 清除所有计时器
 */
const clearAllTimers = function(timers) {
  // 清除游戏计时器
  if (timers.gameTimer) {
    clearInterval(timers.gameTimer)
    timers.gameTimer = null
  }

  // 清除顾客生成计时器
  if (timers.customerSpawnTimer) {
    clearInterval(timers.customerSpawnTimer)
    timers.customerSpawnTimer = null
  }

  // 清除制作计时器
  if (timers.cookingTimer) {
    clearInterval(timers.cookingTimer)
    timers.cookingTimer = null
  }

  // 清除提示计时器
  if (timers.tipsTimer) {
    clearTimeout(timers.tipsTimer)
    timers.tipsTimer = null
  }
}

/**
 * 显示游戏提示
 */
const showTips = function(text, duration = 3000) {
  return new Promise((resolve) => {
    // 设置提示文本
    this.setData({
      showTips: true,
      tipsText: text
    })

    // 清除之前的计时器
    if (this.tipsTimer) {
      clearTimeout(this.tipsTimer)
    }

    // 设置新的计时器
    this.tipsTimer = setTimeout(() => {
      this.setData({
        showTips: false
      })
      resolve()
    }, duration)
  })
}

module.exports = {
  weightedRandom,
  getRandomCustomerPosition,
  calculateStarRating,
  clearAllTimers,
  showTips
}
