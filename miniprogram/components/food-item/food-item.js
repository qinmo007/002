// 食物组件
Component({
  properties: {
    foodData: Object // 包含type, status, progress等数据
  },

  data: {
    progress: 0,
    status: 'waiting', // waiting/cooking/done/burnt
    timer: null
  },

  methods: {
    // 开始制作
    startCooking() {
      this.setData({ status: 'cooking' });

      this.data.timer = setInterval(() => {
        const newProgress = this.data.progress + 5;
        this.setData({ progress: newProgress });

        if (newProgress >= 100) {
          this.finishCooking();
        }
      }, 500);
    },

    // 完成制作
    finishCooking() {
      clearInterval(this.data.timer);
      this.setData({
        status: 'done',
        progress: 100
      });
      this.triggerEvent('done', {id: this.properties.foodData.id});
    },

    // 食物烧焦处理
    checkBurnt() {
      if (this.data.status === 'done') {
        setTimeout(() => {
          this.setData({ status: 'burnt' });
          this.triggerEvent('burnt', {id: this.properties.foodData.id});
        }, 3000);
      }
    },

    // 拖拽开始
    onTouchStart(e) {
      this.triggerEvent('dragstart', {
        id: this.properties.foodData.id,
        position: e.touches[0]
      });
    },

    // 拖拽移动
    onTouchMove(e) {
      this.triggerEvent('dragmove', {
        id: this.properties.foodData.id,
        position: e.touches[0]
      });
    },

    // 拖拽结束
    onTouchEnd(e) {
      this.triggerEvent('dragend', {
        id: this.properties.foodData.id,
        position: e.changedTouches[0]
      });
    }
  },

  // 组件生命周期
  lifetimes: {
    attached() {
      if (this.properties.foodData.status === 'cooking') {
        this.startCooking();
      }
    },
    detached() {
      clearInterval(this.data.timer);
    }
  },

  observers: {
    'foodData.status': function(status) {
      if (status === 'cooking' && this.data.status !== 'cooking') {
        this.startCooking();
      }
    }
  }
});
