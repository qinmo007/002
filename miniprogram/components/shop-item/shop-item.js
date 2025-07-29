// 商店商品组件逻辑
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 处理购买按钮点击
    handleBuy() {
      // 触发购买事件，将商品信息传递给父组件
      this.triggerEvent('buy', {
        item: this.properties.item
      })
    }
  }
})
