/**
 * 早餐店模拟器 - 工具函数库
 * 包含各种实用函数
 */

/**
 * 格式化时间
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的时间字符串，格式为 YYYY-MM-DD HH:mm:ss
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串，格式为 YYYY-MM-DD
 */
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

/**
 * 格式化数字
 * @param {number} n - 数字
 * @returns {string} 格式化后的数字字符串，个位数补0
 */
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 生成指定范围内的随机整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} 随机整数
 */
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成指定范围内的随机浮点数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @param {number} decimals - 小数位数
 * @returns {number} 随机浮点数
 */
const randomFloat = (min, max, decimals = 2) => {
  const val = Math.random() * (max - min) + min
  return parseFloat(val.toFixed(decimals))
}

/**
 * 随机从数组中选择一个元素
 * @param {Array} array - 数组
 * @returns {*} 随机选择的元素
 */
const randomPick = (array) => {
  if (!array || array.length === 0) return null
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * 随机从数组中选择多个不重复的元素
 * @param {Array} array - 数组
 * @param {number} count - 选择的元素数量
 * @returns {Array} 随机选择的元素数组
 */
const randomPickMultiple = (array, count) => {
  if (!array || array.length === 0) return []
  if (count >= array.length) return [...array]
  
  const result = []
  const tempArray = [...array]
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length)
    result.push(tempArray[randomIndex])
    tempArray.splice(randomIndex, 1)
  }
  
  return result
}

/**
 * 洗牌算法，随机打乱数组
 * @param {Array} array - 要打乱的数组
 * @returns {Array} 打乱后的新数组
 */
const shuffle = (array) => {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 深拷贝对象
 * @param {Object} obj - 要拷贝的对象
 * @returns {Object} 拷贝后的新对象
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }
  
  if (obj instanceof Object) {
    const copy = {}
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key])
    })
    return copy
  }
  
  return obj
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
const debounce = (func, wait) => {
  let timeout
  return function() {
    const context = this
    const args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 节流后的函数
 */
const throttle = (func, wait) => {
  let timeout = null
  let lastRun = 0
  return function() {
    const context = this
    const args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}

/**
 * 格式化金币数量
 * @param {number} coins - 金币数量
 * @returns {string} 格式化后的金币字符串
 */
const formatCoins = (coins) => {
  if (coins >= 1000000) {
    return (coins / 1000000).toFixed(1) + 'M'
  }
  if (coins >= 1000) {
    return (coins / 1000).toFixed(1) + 'K'
  }
  return coins.toString()
}

/**
 * 计算两个日期之间的天数差
 * @param {Date|string} date1 - 日期1
 * @param {Date|string} date2 - 日期2
 * @returns {number} 天数差
 */
const daysBetween = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  
  // 重置时间部分，只保留日期
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  
  // 计算天数差
  const diffTime = Math.abs(d2 - d1)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

/**
 * 检查两个日期是否是连续的
 * @param {Date|string} date1 - 日期1
 * @param {Date|string} date2 - 日期2
 * @returns {boolean} 是否连续
 */
const isConsecutiveDays = (date1, date2) => {
  return daysBetween(date1, date2) === 1
}

/**
 * 计算经验值到达下一级所需的经验值
 * @param {number} level - 当前等级
 * @returns {number} 所需经验值
 */
const expToNextLevel = (level) => {
  return Math.floor(100 * Math.pow(1.2, level - 1))
}

/**
 * 计算升级所需的总经验值
 * @param {number} level - 目标等级
 * @returns {number} 所需总经验值
 */
const totalExpToLevel = (level) => {
  let total = 0
  for (let i = 1; i < level; i++) {
    total += expToNextLevel(i)
  }
  return total
}

/**
 * 根据经验值计算等级
 * @param {number} exp - 经验值
 * @returns {Object} 等级信息，包含level（等级）、currentExp（当前等级的经验值）和nextLevelExp（升级所需经验值）
 */
const calculateLevel = (exp) => {
  let level = 1
  let expRemaining = exp
  let expForNextLevel = expToNextLevel(level)
  
  while (expRemaining >= expForNextLevel) {
    expRemaining -= expForNextLevel
    level++
    expForNextLevel = expToNextLevel(level)
  }
  
  return {
    level,
    currentExp: expRemaining,
    nextLevelExp: expForNextLevel
  }
}

/**
 * 计算游戏评分
 * @param {Object} params - 参数对象
 * @param {number} params.customerSatisfaction - 顾客满意度（0-100）
 * @param {number} params.foodQuality - 食物质量（0-100）
 * @param {number} params.serviceSpeed - 服务速度（0-100）
 * @param {number} params.shopCleanliness - 店铺清洁度（0-100）
 * @returns {number} 游戏评分（1-5）
 */
const calculateGameRating = ({ customerSatisfaction = 0, foodQuality = 0, serviceSpeed = 0, shopCleanliness = 0 }) => {
  // 权重
  const weights = {
    customerSatisfaction: 0.4,
    foodQuality: 0.3,
    serviceSpeed: 0.2,
    shopCleanliness: 0.1
  }
  
  // 计算加权平均分
  const weightedScore = 
    customerSatisfaction * weights.customerSatisfaction +
    foodQuality * weights.foodQuality +
    serviceSpeed * weights.serviceSpeed +
    shopCleanliness * weights.shopCleanliness
  
  // 转换为1-5分制
  const rating = 1 + (weightedScore / 100) * 4
  
  // 保留一位小数
  return parseFloat(rating.toFixed(1))
}

/**
 * 计算顾客满意度
 * @param {Object} params - 参数对象
 * @param {number} params.waitTime - 等待时间（秒）
 * @param {number} params.foodQuality - 食物质量（0-100）
 * @param {boolean} params.orderCorrect - 订单是否正确
 * @returns {number} 顾客满意度（0-100）
 */
const calculateCustomerSatisfaction = ({ waitTime = 0, foodQuality = 0, orderCorrect = true }) => {
  // 基础满意度
  let satisfaction = 80
  
  // 等待时间影响（每10秒减少5分，最多减少40分）
  const waitTimePenalty = Math.min(Math.floor(waitTime / 10) * 5, 40)
  satisfaction -= waitTimePenalty
  
  // 食物质量影响（直接影响20分）
  const foodQualityBonus = (foodQuality / 100) * 20
  satisfaction += foodQualityBonus
  
  // 订单正确性影响
  if (!orderCorrect) {
    satisfaction -= 30
  }
  
  // 确保满意度在0-100之间
  return Math.max(0, Math.min(100, satisfaction))
}

/**
 * 生成随机顾客名称
 * @returns {string} 随机顾客名称
 */
const generateRandomCustomerName = () => {
  const firstNames = ['张', '王', '李', '赵', '陈', '刘', '杨', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '林', '郭', '何', '高', '罗']
  const lastNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '洋', '艳', '勇', '军', '杰', '娟', '涛', '明', '超', '秀兰', '霞']
  
  return randomPick(firstNames) + randomPick(lastNames)
}

/**
 * 生成随机订单
 * @param {Array} availableItems - 可用的食物列表
 * @param {number} minItems - 最少食物数量
 * @param {number} maxItems - 最多食物数量
 * @returns {Array} 随机订单
 */
const generateRandomOrder = (availableItems, minItems = 1, maxItems = 3) => {
  if (!availableItems || availableItems.length === 0) {
    return []
  }
  
  // 确定订单中的食物数量
  const itemCount = randomInt(minItems, Math.min(maxItems, availableItems.length))
  
  // 随机选择食物
  return randomPickMultiple(availableItems, itemCount)
}

/**
 * 计算订单价格
 * @param {Array} order - 订单中的食物列表
 * @param {Object} priceList - 价格列表，键为食物ID，值为价格
 * @returns {number} 订单总价
 */
const calculateOrderPrice = (order, priceList) => {
  if (!order || !priceList) {
    return 0
  }
  
  return order.reduce((total, item) => {
    return total + (priceList[item] || 0)
  }, 0)
}

module.exports = {
  formatTime,
  formatDate,
  formatNumber,
  randomInt,
  randomFloat,
  randomPick,
  randomPickMultiple,
  shuffle,
  deepClone,
  debounce,
  throttle,
  formatCoins,
  daysBetween,
  isConsecutiveDays,
  expToNextLevel,
  totalExpToLevel,
  calculateLevel,
  calculateGameRating,
  calculateCustomerSatisfaction,
  generateRandomCustomerName,
  generateRandomOrder,
  calculateOrderPrice
}