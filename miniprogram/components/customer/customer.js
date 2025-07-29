// 顾客组件逻辑
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 顾客ID
    customerId: {
      type: String,
      value: ''
    },
    // 顾客类型
    customerType: {
      type: String,
      value: 'normal' // normal, vip, impatient, generous
    },
    // 顾客初始位置
    initialPosition: {
      type: Object,
      value: { x: 0, y: 0 }
    },
    // 顾客耐心值（秒）
    patience: {
      type: Number,
      value: 30
    },
    // 顾客订单
    order: {
      type: Array,
      value: []
    },
    // 游戏难度
    difficulty: {
      type: String,
      value: 'normal' // easy, normal, hard
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 顾客图像
    customerImage: '',
    // 顾客位置
    position: { x: 0, y: 0 },
    // 顾客心情
    mood: 'neutral', // happy, neutral, impatient, angry
    // 是否显示心情
    showMood: false,
    // 是否显示订单
    showOrder: false,
    // 订单内容
    orderItems: [],
    // 剩余时间
    timeRemaining: 30,
    // 计时器ID
    timerId: null,
    // 是否正在离开
    isLeaving: false,
    // 是否正在进入
    isEntering: true,
    // 是否显示反馈
    showFeedback: false,
    // 反馈文本
    feedbackText: '',
    // 是否显示小费
    showTip: false,
    // 小费金额
    tipAmount: 0,
    // 顾客状态
    status: 'entering' // entering, waiting, ordering, served, leaving
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached() {
      this.initialize()
    },
    detached() {
      // 清除计时器
      if (this.data.timerId) {
        clearInterval(this.data.timerId)
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化顾客
     */
    initialize() {
      // 设置顾客图像
      this.setCustomerImage()

      // 设置顾客位置
      this.setData({
        position: this.properties.initialPosition
      })

      // 设置顾客订单
      this.processOrder()

      // 设置顾客状态为进入中
      this.setData({
        status: 'entering',
        isEntering: true
      })

      // 延迟显示订单
      setTimeout(() => {
        this.setData({
          isEntering: false,
          status: 'waiting',
          showOrder: true
        })

        // 开始计时
        this.startTimer()
      }, 1000)
    },

    /**
     * 设置顾客图像
     */
    setCustomerImage() {
      // 根据顾客类型选择图像
      let imagePath = ''

      switch (this.properties.customerType) {
        case 'vip':
          imagePath = `/assets/images/customers/vip_${Math.floor(Math.random() * 3) + 1}.png`
          break
        case 'impatient':
          imagePath = `/assets/images/customers/impatient_${Math.floor(Math.random() * 3) + 1}.png`
          break
        case 'generous':
          imagePath = `/assets/images/customers/generous_${Math.floor(Math.random() * 3) + 1}.png`
          break
        default:
          imagePath = `/assets/images/customers/normal_${Math.floor(Math.random() * 5) + 1}.png`
      }

      this.setData({
        customerImage: imagePath
      })
    },

    /**
     * 处理订单数据
     */
    processOrder() {
      const orderItems = this.properties.order.map(item => {
        return {
          id: item.id,
          name: item.name,
          icon: item.icon || `/assets/images/foods/${item.id}.png`,
          count: item.count || 1
        }
      })

      this.setData({
        orderItems,
        timeRemaining: this.properties.patience
      })
    },

    /**
     * 开始计时器
     */
    startTimer() {
      // 清除可能存在的计时器
      if (this.data.timerId) {
        clearInterval(this.data.timerId)
      }

      // 设置计时器
      const timerId = setInterval(() => {
        let timeRemaining = this.data.timeRemaining - 1
        let mood = this.data.mood

        // 根据剩余时间更新心情
        if (timeRemaining <= 0) {
          // 时间用完，顾客离开
          this.handleTimeout()
          return
        } else if (timeRemaining <= 5) {
          mood = 'angry'
          this.setData({ showMood: true })
        } else if (timeRemaining <= 15) {
          mood = 'impatient'
          this.setData({ showMood: true })
        }

        this.setData({
          timeRemaining,
          mood
        })
      }, 1000)

      this.setData({ timerId })
    },

    /**
     * 处理超时
     */
    handleTimeout() {
      // 清除计时器
      if (this.data.timerId) {
        clearInterval(this.data.timerId)
        this.setData({ timerId: null })
      }

      // 显示不满意反馈
      this.showFeedback('等太久了！')

      // 通知父组件顾客离开
      setTimeout(() => {
        this.triggerEvent('customerLeave', {
          customerId: this.properties.customerId,
          satisfied: false,
          reason: 'timeout'
        })

        // 设置离开状态
        this.setData({
          status: 'leaving',
          isLeaving: true,
          showOrder: false
        })
      }, 1500)
    },

    /**
     * 点击订单
     */
    onOrderTap() {
      // 通知父组件处理订单
      this.triggerEvent('orderTap', {
        customerId: this.properties.customerId,
        order: this.properties.order
      })
    },

    /**
     * 处理订单完成
     * @param {Object} orderResult 订单结果
     * @param {Boolean} orderResult.correct 订单是否正确
     * @param {Number} orderResult.tipAmount 小费金额
     */
    handleOrderComplete(orderResult) {
      // 清除计时器
      if (this.data.timerId) {
        clearInterval(this.data.timerId)
        this.setData({ timerId: null })
      }

      // 隐藏订单
      this.setData({
        showOrder: false,
        status: 'served'
      })

      if (orderResult.correct) {
        // 订单正确
        this.setData({ mood: 'happy', showMood: true })

        // 显示满意反馈
        const feedbacks = ['太好吃了！', '非常满意！', '味道不错！', '谢谢！']
        this.showFeedback(feedbacks[Math.floor(Math.random() * feedbacks.length)])

        // 显示小费（如果有）
        if (orderResult.tipAmount > 0) {
          setTimeout(() => {
            this.setData({
              showTip: true,
              tipAmount: orderResult.tipAmount
            })
          }, 1000)
        }

        // 通知父组件顾客满意离开
        setTimeout(() => {
          this.triggerEvent('customerLeave', {
            customerId: this.properties.customerId,
            satisfied: true,
            tipAmount: orderResult.tipAmount
          })

          // 设置离开状态
          this.setData({
            status: 'leaving',
            isLeaving: true
          })
        }, 3000)
      } else {
        // 订单错误
        this.setData({ mood: 'angry', showMood: true })

        // 显示不满意反馈
        const feedbacks = ['这不是我点的！', '订单错了！', '我要投诉！']
        this.showFeedback(feedbacks[Math.floor(Math.random() * feedbacks.length)])

        // 通知父组件顾客不满意离开
        setTimeout(() => {
          this.triggerEvent('customerLeave', {
            customerId: this.properties.customerId,
            satisfied: false,
            reason: 'wrong_order'
          })

          // 设置离开状态
          this.setData({
            status: 'leaving',
            isLeaving: true
          })
        }, 2000)
      }
    },

    /**
     * 显示反馈文本
     * @param {String} text 反馈文本
     */
    showFeedback(text) {
      this.setData({
        showFeedback: true,
        feedbackText: text
      })

      // 延迟隐藏反馈
      setTimeout(() => {
        this.setData({
          showFeedback: false
        })
      }, 2000)
    },

    /**
     * 移动顾客到指定位置
     * @param {Object} position 位置坐标
     */
    moveTo(position) {
      this.setData({
        position
      })
    }
  }
})
