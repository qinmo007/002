/**
 * 游戏入口文件
 * 负责初始化游戏并启动主循环
 */

import Game from './game/Game.js'

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
  // 获取游戏容器
  const gameContainer = document.getElementById('game-container')

  if (!gameContainer) {
    console.error('找不到游戏容器元素')
    return
  }

  // 创建游戏画布
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 600

  // 添加画布到容器
  gameContainer.appendChild(canvas)

  // 获取2D渲染上下文
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    console.error('无法获取2D渲染上下文')
    return
  }

  // 创建游戏实例
  const game = new Game(canvas, ctx)

  // 初始化游戏
  game.init().then(() => {
    // 启动游戏主循环
    game.start()

    console.log('游戏启动成功')
  }).catch(error => {
    console.error('游戏初始化失败:', error)
  })

  // 添加窗口大小调整事件
  window.addEventListener('resize', () => {
    // 调整游戏大小
    game.resize()
  })

  // 添加页面可见性变化事件
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // 页面不可见时暂停游戏
      game.pause()
    } else {
      // 页面可见时恢复游戏
      game.resume()
    }
  })

  // 添加键盘事件
  window.addEventListener('keydown', (event) => {
    // 处理键盘按下事件
    game.handleKeyDown(event)
  })

  window.addEventListener('keyup', (event) => {
    // 处理键盘释放事件
    game.handleKeyUp(event)
  })
})

// 导出游戏类，以便其他模块可以使用
export { Game }
