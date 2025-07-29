/**
 * 声音管理器类
 * 负责管理游戏音效和背景音乐
 */

export default class SoundManager {
  constructor(game) {
    this.game = game

    // 音频设置
    this.musicVolume = 0.5
    this.soundVolume = 0.8
    this.isMusicEnabled = true
    this.isSoundEnabled = true

    // 当前播放的背景音乐
    this.currentMusic = null

    // 音频缓存
    this.soundCache = {}

    // 初始化声音管理器
    this.init()
  }

  /**
   * 初始化声音管理器
   */
  init() {
    // 从本地存储加载音频设置
    this.loadSettings()

    console.log('声音管理器初始化完成')
  }

  /**
   * 从本地存储加载音频设置
   */
  loadSettings() {
    try {
      const settings = localStorage.getItem('soundSettings')

      if (settings) {
        const parsedSettings = JSON.parse(settings)

        this.musicVolume = parsedSettings.musicVolume !== undefined ? parsedSettings.musicVolume : this.musicVolume
        this.soundVolume = parsedSettings.soundVolume !== undefined ? parsedSettings.soundVolume : this.soundVolume
        this.isMusicEnabled = parsedSettings.isMusicEnabled !== undefined ? parsedSettings.isMusicEnabled : this.isMusicEnabled
        this.isSoundEnabled = parsedSettings.isSoundEnabled !== undefined ? parsedSettings.isSoundEnabled : this.isSoundEnabled
      }
    } catch (error) {
      console.error('Failed to load sound settings:', error)
    }
  }

  /**
   * 保存音频设置到本地存储
   */
  saveSettings() {
    try {
      const settings = {
        musicVolume: this.musicVolume,
        soundVolume: this.soundVolume,
        isMusicEnabled: this.isMusicEnabled,
        isSoundEnabled: this.isSoundEnabled
      }

      localStorage.setItem('soundSettings', JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save sound settings:', error)
    }
  }

  /**
   * 播放音效
   */
  playSound(id) {
    if (!this.isSoundEnabled) return

    // 获取音效资源
    const sound = this.game.resourceManager.getSound(id)

    if (!sound) {
      console.warn(`Sound not found: ${id}`)
      return
    }

    // 检查是否已经有缓存的音效实例
    if (!this.soundCache[id]) {
      this.soundCache[id] = []
    }

    // 查找可用的音效实例
    let soundInstance = null

    for (const instance of this.soundCache[id]) {
      if (instance.paused || instance.ended) {
        soundInstance = instance
        break
      }
    }

    // 如果没有可用的实例，创建一个新的
    if (!soundInstance) {
      soundInstance = sound.cloneNode()
      this.soundCache[id].push(soundInstance)

      // 限制缓存大小
      if (this.soundCache[id].length > 5) {
        this.soundCache[id].shift()
      }
    }

    // 设置音量并播放
    soundInstance.volume = this.soundVolume
    soundInstance.currentTime = 0

    try {
      soundInstance.play().catch(error => {
        console.warn(`Failed to play sound: ${id}`, error)
      })
    } catch (error) {
      console.warn(`Failed to play sound: ${id}`, error)
    }

    return soundInstance
  }

  /**
   * 播放背景音乐
   */
  playMusic(id, loop = true) {
    if (!this.isMusicEnabled) return

    // 如果已经在播放相同的音乐，不做任何操作
    if (this.currentMusic && this.currentMusic.id === id && !this.currentMusic.paused) {
      return
    }

    // 停止当前播放的音乐
    this.stopMusic()

    // 获取音乐资源
    const music = this.game.resourceManager.getSound(id)

    if (!music) {
      console.warn(`Music not found: ${id}`)
      return
    }

    // 设置音乐属性
    music.volume = this.musicVolume
    music.loop = loop

    // 播放音乐
    try {
      music.play().catch(error => {
        console.warn(`Failed to play music: ${id}`, error)
      })
    } catch (error) {
      console.warn(`Failed to play music: ${id}`, error)
    }

    // 保存当前音乐引用
    this.currentMusic = music
    this.currentMusic.id = id
  }

  /**
   * 停止背景音乐
   */
  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause()
      this.currentMusic.currentTime = 0
      this.currentMusic = null
    }
  }

  /**
   * 暂停背景音乐
   */
  pauseMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause()
    }
  }

  /**
   * 恢复背景音乐
   */
  resumeMusic() {
    if (this.currentMusic && this.isMusicEnabled) {
      try {
        this.currentMusic.play().catch(error => {
          console.warn(`Failed to resume music`, error)
        })
      } catch (error) {
        console.warn(`Failed to resume music`, error)
      }
    }
  }

  /**
   * 设置音乐音量
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume))

    if (this.currentMusic) {
      this.currentMusic.volume = this.musicVolume
    }

    this.saveSettings()
  }

  /**
   * 设置音效音量
   */
  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
  }

  /**
   * 启用/禁用背景音乐
   */
  toggleMusic(enabled) {
    this.isMusicEnabled = enabled !== undefined ? enabled : !this.isMusicEnabled

    if (this.isMusicEnabled) {
      this.resumeMusic()
    } else {
      this.pauseMusic()
    }

    this.saveSettings()
  }

  /**
   * 启用/禁用音效
   */
  toggleSound(enabled) {
    this.isSoundEnabled = enabled !== undefined ? enabled : !this.isSoundEnabled
    this.saveSettings()
  }

  /**
   * 获取音乐音量
   */
  getMusicVolume() {
    return this.musicVolume
  }

  /**
   * 获取音效音量
   */
  getSoundVolume() {
    return this.soundVolume
  }

  /**
   * 检查背景音乐是否启用
   */
  isMusicOn() {
    return this.isMusicEnabled
  }

  /**
   * 检查音效是否启用
   */
  isSoundOn() {
    return this.isSoundEnabled
  }
}
