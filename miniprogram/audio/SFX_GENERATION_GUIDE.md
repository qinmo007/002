# 音效生成详细指南

## 一、BFXR使用教程

### 1. 生成按钮音效
1. 打开 https://www.bfxr.net/
2. 点击"Pickup/Coin"按钮
3. 调整参数建议：
   - Base frequency: 1000-1500Hz
   - Duration: 0.2秒
   - 勾选"Filter"增加清脆感

### 2. 生成烹饪音效
1. 点击"Laser/Shoot"按钮
2. 调整参数建议：
   - Base frequency: 200-400Hz
   - Duration: 0.5-1秒
   - 添加"Vibrato"模拟煎炸声

### 3. 生成顾客提示音
1. 点击"Blip/Select"按钮
2. 调整参数建议：
   - Base frequency: 800-1200Hz
   - Duration: 0.3秒
   - 添加"Repeat"效果

## 二、ChipTone使用教程

### 1. 创建复古音效
1. 打开 http://sfbgames.com/chiptone/
2. 选择预设模板：
   - 按钮音: "Menu > Select"
   - 烹饪音: "SFX > Explosion"
   - 金币音: "Coins > Collect"

### 2. 参数调整技巧
- 增加"Noise"比例模拟煎炸声
- 降低"Release"值使音效更干脆
- 使用"Arpeggio"创造复杂音效

## 三、导出设置

1. 文件格式: MP3 128kbps
2. 命名规范:
   - 按钮: sfx_btn_[类型].mp3
   - 烹饪: sfx_cook_[食物].mp3
   - 顾客: sfx_customer_[动作].mp3
3. 音量标准化: -15dB RMS

## 四、实用建议

1. 创建音效变体：
   - 每种音效生成3-4个变体
   - 避免重复使用相同音效

2. 测试音效：
   - 在小程序中测试实际效果
   - 确保音效在移动设备上清晰可辨

3. 资源管理：
   - 单个音效不超过100KB
   - 背景音乐不超过2MB
