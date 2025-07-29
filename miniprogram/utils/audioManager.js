/**
 * 早餐店模拟器 - 音频管理器
 * 用于管理游戏中的音效和背景音乐
 */

class AudioManager {
  constructor() {
    // 背景音乐实例
    this.bgmInstance = null;

    // 当前播放的背景音乐
    this.currentBGM = '';

    // 音频资源路径
    this.audioPath = {
      bgm: {
        main: 'audio/bgm/main_theme.mp3',
        cooking: 'audio/bgm/cooking_theme.mp3',
        shop: 'audio/bgm/shop_theme.mp3',
        ranking: 'audio/bgm/ranking_theme.mp3',
        profile: 'audio/bgm/profile_theme.mp3',
        settings: 'audio/bgm/settings_theme.mp3'
      },
      sounds: {
        click: 'audio/sounds/click.mp3',
        coin: 'audio/sounds/coin.mp3',
        cooking_start: 'audio/sounds/cooking_start.mp3',
        cooking_success: 'audio/sounds/cooking_success.mp3',
        cooking_fail: 'audio/sounds/cooking_fail.mp3',
        customer_enter: 'audio/sounds/customer_enter.mp3',
        customer_leave: 'audio/sounds/customer_leave.mp3',
        customer_happy: 'audio/sounds/customer_happy.mp3',
        customer_angry: 'audio/sounds/customer_angry.mp3',
        level_up: 'audio/sounds/level_up.mp3',
        purchase: 'audio/sounds/purchase.mp3',
        achievement: 'audio/sounds/achievement.mp3'
      }
    };

    // 初始化
    this.init();
  }

  /**
   * 初始化音频管理器
   */
  init() {
    // 创建背景音乐实例
    this.bgmInstance = wx.createInnerAudioContext();
    this.bgmInstance.loop = true; // 循环播放

    // 监听错误
    this.bgmInstance.onError((res) => {
      console.error('背景音乐播放错误:', res);
    });
  }

  /**
   * 播放背景音乐
   * @param {string} type - 背景音乐类型，对应 audioPath.bgm 中的键
   */
  playBGM(type) {
    // 检查是否有有效的类型
    if (!type || !this.audioPath.bgm[type]) {
      console.warn('无效的背景音乐类型:', type);
      return;
    }

    // 如果已经在播放相同的背景音乐，则不做任何操作
    if (this.currentBGM === type && this.bgmInstance.paused === false) {
      return;
    }

    // 停止当前播放的背景音乐
    this.bgmInstance.stop();

    // 设置新的背景音乐
    this.bgmInstance.src = this.audioPath.bgm[type];
    this.currentBGM = type;

    // 播放背景音乐
    this.bgmInstance.play();
  }

  /**
   * 停止背景音乐
   */
  stopBGM() {
    if (this.bgmInstance) {
      this.bgmInstance.stop();
      this.currentBGM = '';
    }
  }

  /**
   * 暂停背景音乐
   */
  pauseBGM() {
    if (this.bgmInstance) {
      this.bgmInstance.pause();
    }
  }

  /**
   * 恢复背景音乐
   */
  resumeBGM() {
    if (this.bgmInstance && this.currentBGM) {
      this.bgmInstance.play();
    }
  }

  /**
   * 播放音效
   * @param {string} type - 音效类型，对应 audioPath.sounds 中的键
   */
  playSound(type) {
    // 检查是否有有效的类型
    if (!type || !this.audioPath.sounds[type]) {
      console.warn('无效的音效类型:', type);
      return;
    }

    // 创建音效实例
    const soundInstance = wx.createInnerAudioContext();
    soundInstance.src = this.audioPath.sounds[type];

    // 监听错误
    soundInstance.onError((res) => {
      console.error('音效播放错误:', res);
    });

    // 监听播放结束，自动销毁实例
    soundInstance.onEnded(() => {
      soundInstance.destroy();
    });

    // 播放音效
    soundInstance.play();
  }

  /**
   * 设置背景音乐音量
   * @param {number} volume - 音量，范围 0-1
   */
  setBGMVolume(volume) {
    if (this.bgmInstance) {
      this.bgmInstance.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * 销毁音频管理器
   */
  destroy() {
    if (this.bgmInstance) {
      this.bgmInstance.destroy();
      this.bgmInstance = null;
    }
  }
}

module.exports = AudioManager;
