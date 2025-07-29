#!/usr/bin/env node

// 简单的MCP服务器模拟
const http = require('http');
const fs = require('fs');
const path = require('path');

// 模拟菜单数据
const menuItems = {
  '主食': [
    { name: '豆浆油条', price: 5.0, description: '传统早餐组合，香脆油条配上浓郁豆浆' },
    { name: '肉包子', price: 3.0, description: '鲜肉馅料，松软面皮' },
    { name: '煎饼果子', price: 8.0, description: '薄脆煎饼配以酥脆果子，加鸡蛋更香' },
  ],
  '小吃': [
    { name: '茶叶蛋', price: 2.0, description: '香浓入味，口感醇厚' },
    { name: '糯米鸡', price: 6.0, description: '糯米包裹鸡肉，香气四溢' },
    { name: '春卷', price: 4.0, description: '酥脆外皮，蔬菜馅料' },
  ],
  '饮品': [
    { name: '豆浆', price: 3.0, description: '现磨豆浆，香浓可口' },
    { name: '米粥', price: 2.0, description: '香甜可口，温暖胃部' },
    { name: '热牛奶', price: 4.0, description: '新鲜牛奶，营养丰富' },
  ],
};

// 创建一个简单的HTTP服务器
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/api/menu') {
    res.end(JSON.stringify(menuItems));
  } else if (req.url === '/api/order' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const order = JSON.parse(body);

        // 简单的验证
        if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: '订单项目不能为空' }));
          return;
        }

        if (!order.address) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: '配送地址不能为空' }));
          return;
        }

        if (!order.phone) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: '联系电话不能为空' }));
          return;
        }

        // 模拟下单成功
        const orderId = Math.floor(Math.random() * 1000000);
        const estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString();

        res.end(JSON.stringify({
          success: true,
          orderId,
          estimatedDeliveryTime,
          message: '下单成功，请等待配送',
        }));
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: '无效的请求数据' }));
      }
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: '未找到请求的资源' }));
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`早餐店服务器运行在 http://localhost:${PORT}`);
});

// 记录启动信息到文件
fs.writeFileSync(
  path.join(__dirname, 'server-info.txt'),
  `服务器启动时间: ${new Date().toISOString()}\n端口: ${PORT}\n`
);

console.log('服务器信息已保存到 server-info.txt');
