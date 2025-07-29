# 早餐店模拟器

一个基于微信小程序平台的早餐店经营模拟游戏，玩家可以在游戏中经营自己的早餐店，提供各种早餐选择，赚取游戏币，升级店铺和解锁新功能。

## 功能特点

- 🍳 **模拟经营**: 体验早餐店的日常经营，包括采购、制作和销售
- 🏆 **排行榜系统**: 与其他玩家比较经营成绩
- 🛒 **商店系统**: 使用游戏币购买店铺升级和新设备
- 👤 **个人资料**: 查看和管理个人游戏数据
- 📚 **教程系统**: 帮助新玩家快速上手
- ⚙️ **设置选项**: 自定义游戏体验

## 技术栈

- 前端: 微信小程序
- 后端: 腾讯云开发 (CloudBase)
- 数据库: 云数据库
- 存储: 云存储
- 计算: 云函数

## 项目结构

```
├── miniprogram/          # 微信小程序前端代码
│   ├── pages/            # 小程序页面
│   ├── components/       # 自定义组件
│   ├── utils/            # 工具函数
│   ├── images/           # 图片资源
│   └── audio/            # 音频资源
│
├── cloudfunctions/       # 云函数代码
│   ├── getGameData/      # 获取游戏数据
│   ├── getRanking/       # 获取排行榜数据
│   ├── getUserInfo/      # 获取用户信息
│   └── updateGameData/   # 更新游戏数据
│
└── src/                  # Web版源代码
    ├── js/               # JavaScript文件
    ├── css/              # 样式文件
    ├── images/           # 图片资源
    └── audio/            # 音频资源
```

## 安装和部署

### 前提条件

- 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 注册 [微信小程序账号](https://mp.weixin.qq.com/)
- 开通 [腾讯云开发](https://www.cloudbase.net/)

### 安装步骤

1. 克隆仓库到本地
   ```
   git clone <仓库URL>
   ```

2. 使用微信开发者工具打开项目

3. 在项目设置中配置你的AppID

4. 创建并配置云开发环境
   - 在微信开发者工具中，点击"云开发"
   - 创建新的云开发环境
   - 复制环境ID，并在 `app.js` 中配置

5. 部署云函数
   - 在微信开发者工具中，右键点击 `cloudfunctions` 目录下的每个云函数
   - 选择"上传并部署：云端安装依赖"

## 使用说明

1. 在微信中搜索"早餐店模拟器"小程序或使用微信开发者工具预览

2. 按照游戏内教程开始你的早餐店经营之旅

3. 完成日常任务，赚取游戏币，升级店铺

4. 解锁新的菜单项和设备，提高店铺效率和顾客满意度

5. 与好友比较排行榜成绩，争夺最佳经营者称号

## 开发指南

### 添加新功能

1. 在 `miniprogram/pages` 目录下创建新页面
2. 在 `app.json` 中注册新页面
3. 如需后端支持，在 `cloudfunctions` 目录下创建新的云函数

### 修改游戏参数

游戏核心参数位于 `miniprogram/config` 目录下，可以根据需要调整游戏难度和平衡性。

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

