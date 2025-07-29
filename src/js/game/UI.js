/**
 * 用户界面类
 * 负责管理游戏的UI元素和交互
 */

export default class UI {
  constructor(game) {
    this.game = game

    // UI元素
    this.elements = {}

    // 当前显示的菜单
    this.currentMenu = null

    // 通知列表
    this.notifications = []

    // 对话框
    this.dialog = {
      visible: false,
      title: '',
      content: '',
      buttons: [],
      onClose: null
    }

    // 提示框
    this.tooltip = {
      visible: false,
      text: '',
      x: 0,
      y: 0
    }

    // 日结算界面
    this.daySummary = {
      visible: false,
      day: 0,
      earnings: 0,
      customers: 0,
      expenses: 0,
      profit: 0
    }

    // 鼠标状态
    this.mouseX = 0
    this.mouseY = 0
    this.isMouseDown = false

    // 拖拽状态
    this.draggedItem = null

    // 初始化UI
    this.init()
  }

  /**
   * 初始化UI
   */
  init() {
    // 创建UI元素
    this.createUIElements()

    // 添加事件监听器
    this.addEventListeners()

    console.log('UI初始化完成')
  }

  /**
   * 创建UI元素
   */
  createUIElements() {
    // 顶部状态栏
    this.elements.statusBar = {
      x: 0,
      y: 0,
      width: this.game.width,
      height: 50,
      render: this.renderStatusBar.bind(this)
    }

    // 底部工具栏
    this.elements.toolbar = {
      x: 0,
      y: this.game.height - 60,
      width: this.game.width,
      height: 60,
      render: this.renderToolbar.bind(this)
    }

    // 菜单按钮
    this.elements.menuButton = {
      x: 10,
      y: 10,
      width: 40,
      height: 40,
      text: '菜单',
      onClick: this.toggleMenu.bind(this),
      render: this.renderButton.bind(this)
    }

    // 商店按钮
    this.elements.shopButton = {
      x: 60,
      y: 10,
      width: 40,
      height: 40,
      text: '商店',
      onClick: this.openShop.bind(this),
      render: this.renderButton.bind(this)
    }

    // 食谱按钮
    this.elements.recipeButton = {
      x: 110,
      y: 10,
      width: 40,
      height: 40,
      text: '食谱',
      onClick: this.openRecipeBook.bind(this),
      render: this.renderButton.bind(this)
    }

    // 统计按钮
    this.elements.statsButton = {
      x: 160,
      y: 10,
      width: 40,
      height: 40,
      text: '统计',
      onClick: this.openStats.bind(this),
      render: this.renderButton.bind(this)
    }

    // 设置按钮
    this.elements.settingsButton = {
      x: this.game.width - 50,
      y: 10,
      width: 40,
      height: 40,
      text: '设置',
      onClick: this.openSettings.bind(this),
      render: this.renderButton.bind(this)
    }
  }

  /**
   * 添加事件监听器
   */
  addEventListeners() {
    // 获取画布元素
    const canvas = this.game.canvas

    // 鼠标移动事件
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect()
      this.mouseX = event.clientX - rect.left
      this.mouseY = event.clientY - rect.top

      // 处理拖拽
      if (this.draggedItem) {
        this.draggedItem.x = this.mouseX - this.draggedItem.offsetX
        this.draggedItem.y = this.mouseY - this.draggedItem.offsetY
      }

      // 更新提示框位置
      if (this.tooltip.visible) {
        this.tooltip.x = this.mouseX + 10
        this.tooltip.y = this.mouseY + 10
      }
    })

    // 鼠标按下事件
    canvas.addEventListener('mousedown', (event) => {
      this.isMouseDown = true

      // 检查点击的UI元素
      this.handleMouseClick()
    })

    // 鼠标释放事件
    canvas.addEventListener('mouseup', () => {
      this.isMouseDown = false

      // 处理拖拽结束
      if (this.draggedItem) {
        this.handleDragEnd()
        this.draggedItem = null
      }
    })

    // 鼠标离开事件
    canvas.addEventListener('mouseleave', () => {
      this.isMouseDown = false

      // 隐藏提示框
      this.hideTooltip()

      // 取消拖拽
      if (this.draggedItem) {
        this.draggedItem = null
      }
    })
  }

  /**
   * 更新UI
   */
  update() {
    // 更新通知
    this.updateNotifications()

    // 检查UI元素悬停
    this.checkHover()
  }

  /**
   * 渲染UI
   */
  render(ctx) {
    // 渲染所有UI元素
    Object.values(this.elements).forEach(element => {
      if (element.visible !== false) {
        element.rende(ctx, element)
      }
    })

    // 渲染通知
    this.renderNotifications(ctx)

    // 渲染对话框
    if (this.dialog.visible) {
      this.renderDialog(ctx)
    }

    // 渲染日结算界面
    if (this.daySummary.visible) {
      this.renderDaySummary(ctx)
    }

    // 渲染当前菜单
    if (this.currentMenu) {
      this.renderMenu(ctx)
    }

    // 渲染提示框
    if (this.tooltip.visible) {
      this.renderTooltip(ctx)
    }

    // 渲染拖拽的物品
    if (this.draggedItem) {
      this.renderDraggedItem(ctx)
    }
  }

  /**
   * 渲染状态栏
   */
  renderStatusBar(ctx, element) {
    // 绘制状态栏背景
    ctx.fillStyle = '#333'
    ctx.fillRect(element.x, element.y, element.width, element.height)

    // 绘制金钱
    ctx.fillStyle = '#fff'
    ctx.font = '16px Arial'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    ctx.fillText(`金钱: ${this.game.player.money}`, element.width - 10, element.y + 25)

    // 绘制经验和等级
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.fillText(`等级: ${this.game.player.level} (${this.game.player.experience}/${this.game.player.experienceToNextLevel})`, element.width / 2, element.y + 25)

    // 绘制时间
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'left'
    ctx.fillText(`${this.game.timeManager.getDateString()} ${this.game.timeManager.getTimeString()}`, 210, element.y + 25)
  }

  /**
   * 渲染工具栏
   */
  renderToolbar(ctx, element) {
    // 绘制工具栏背景
    ctx.fillStyle = '#333'
    ctx.fillRect(element.x, element.y, element.width, element.height)

    // 绘制工具栏按钮
    // 这里可以添加更多的工具栏按钮
  }

  /**
   * 渲染按钮
   */
  renderButton(ctx, button) {
    // 检查鼠标是否悬停在按钮上
    const isHovered = this.isPointInRect(this.mouseX, this.mouseY, button.x, button.y, button.width, button.height)

    // 绘制按钮背景
    ctx.fillStyle = isHovered ? '#555' : '#444'
    ctx.fillRect(button.x, button.y, button.width, button.height)

    // 绘制按钮边框
    ctx.strokeStyle = '#666'
    ctx.lineWidth = 2
    ctx.strokeRect(button.x, button.y, button.width, button.height)

    // 绘制按钮文本
    ctx.fillStyle = '#fff'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2)
  }

  /**
   * 渲染通知
   */
  renderNotifications(ctx) {
    // 绘制所有通知
    this.notifications.forEach((notification, index) => {
      // 计算通知位置
      const x = this.game.width - 210
      const y = 60 + index * 40

      // 计算通知透明度
      const alpha = Math.min(1, notification.duration / 1000)

      // 绘制通知背景
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`
      ctx.fillRect(x, y, 200, 30)

      // 绘制通知边框
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, 200, 30)

      // 绘制通知文本
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.font = '12px Arial'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(notification.text, x + 10, y + 15)
    })
  }

  /**
   * 渲染对话框
   */
  renderDialog(ctx) {
    // 绘制半透明背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, this.game.width, this.game.height)

    // 计算对话框位置和大小
    const dialogWidth = 400
    const dialogHeight = 250
    const dialogX = (this.game.width - dialogWidth) / 2
    const dialogY = (this.game.height - dialogHeight) / 2

    // 绘制对话框背景
    ctx.fillStyle = '#fff'
    ctx.fillRect(dialogX, dialogY, dialogWidth, dialogHeight)

    // 绘制对话框边框
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    ctx.strokeRect(dialogX, dialogY, dialogWidth, dialogHeight)

    // 绘制对话框标题
    ctx.fillStyle = '#333'
    ctx.font = '18px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.dialog.title, dialogX + dialogWidth / 2, dialogY + 30)

    // 绘制对话框内容
    ctx.font = '14px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(this.dialog.content, dialogX + 20, dialogY + 70)

    // 绘制对话框按钮
    this.dialog.buttons.forEach((button, index) => {
      const buttonWidth = 100
      const buttonHeight = 40
      const buttonX = dialogX + dialogWidth / 2 - (this.dialog.buttons.length * buttonWidth + (this.dialog.buttons.length - 1) * 10) / 2 + index * (buttonWidth + 10)
      const buttonY = dialogY + dialogHeight - 60

      // 检查鼠标是否悬停在按钮上
      const isHovered = this.isPointInRect(this.mouseX, this.mouseY, buttonX, buttonY, buttonWidth, buttonHeight)

      // 绘制按钮背景
      ctx.fillStyle = isHovered ? '#555' : '#444'
      ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight)

      // 绘制按钮边框
      ctx.strokeStyle = '#666'
      ctx.lineWidth = 1
      ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight)

      // 绘制按钮文本
      ctx.fillStyle = '#fff'
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(button.text, buttonX + buttonWidth / 2, buttonY + buttonHeight / 2)

      // 保存按钮位置信息
      button.x = buttonX
      button.y = buttonY
      button.width = buttonWidth
      button.height = buttonHeight
    })
  }

  /**
   * 渲染日结算界面
   */
  renderDaySummary(ctx) {
    // 绘制半透明背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, this.game.width, this.game.height)

    // 计算结算界面位置和大小
    const summaryWidth = 500
    const summaryHeight = 350
    const summaryX = (this.game.width - summaryWidth) / 2
    const summaryY = (this.game.height - summaryHeight) / 2

