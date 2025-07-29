/**
 * 早餐店模拟器 - 游戏配置
 * 包含游戏的各种配置参数
 */

const gameConfig = {
  /**
   * 游戏基本配置
   */
  basic: {
    // 游戏名称
    gameName: '早餐店模拟器',

    // 游戏版本
    version: '1.0.0',

    // 初始金币
    initialCoins: 500,

    // 初始宝石
    initialGems: 0,

    // 每日登录奖励（金币）
    dailyLoginReward: 50,

    // 连续登录额外奖励（金币）
    consecutiveLoginBonus: [0, 0, 10, 20, 30, 50, 100],

    // 经验值系数（影响升级所需经验）
    expFactor: 1.2,

    // 初始等级所需经验
    baseExpToNextLevel: 100,

    // 每日任务数量
    dailyTaskCount: 3
  },

  /**
   * 食物配置
   */
  food: {
    // 食物列表
    items: [
      {
        id: 'bacon_and_egg',
        name: '培根煎蛋',
        description: '经典的早餐组合，香脆的培根配上嫩滑的煎蛋',
        price: 15,
        cost: 5,
        cookTime: 20,
        popularity: 100,
        ingredients: ['bacon', 'egg'],
        requiredEquipment: ['pan'],
        image: 'images/food/bacon_and_egg.png',
        unlocked: true
      },
      {
        id: 'pancake',
        name: '松饼',
        description: '蓬松香甜的松饼，搭配枫糖浆更美味',
        price: 12,
        cost: 4,
        cookTime: 25,
        popularity: 90,
        ingredients: ['flour', 'egg', 'milk'],
        requiredEquipment: ['pan'],
        image: 'images/food/pancake.png',
        unlocked: false
      },
      {
        id: 'toast',
        name: '吐司',
        description: '金黄酥脆的吐司，可以搭配各种酱料',
        price: 8,
        cost: 2,
        cookTime: 15,
        popularity: 80,
        ingredients: ['bread'],
        requiredEquipment: ['toaster'],
        image: 'images/food/toast.png',
        unlocked: false
      },
      {
        id: 'coffee',
        name: '咖啡',
        description: '提神醒脑的咖啡，早晨的必备饮品',
        price: 10,
        cost: 3,
        cookTime: 15,
        popularity: 95,
        ingredients: ['coffee_bean', 'water'],
        requiredEquipment: ['coffee_machine'],
        image: 'images/food/coffee.png',
        unlocked: false
      },
      {
        id: 'croissant',
        name: '牛角面包',
        description: '酥脆可口的法式牛角面包',
        price: 14,
        cost: 5,
        cookTime: 30,
        popularity: 85,
        ingredients: ['flour', 'butter'],
        requiredEquipment: ['oven'],
        image: 'images/food/croissant.png',
        unlocked: false
      },
      {
        id: 'sandwich',
        name: '三明治',
        description: '营养丰富的三明治，适合快节奏的早晨',
        price: 18,
        cost: 6,
        cookTime: 25,
        popularity: 88,
        ingredients: ['bread', 'lettuce', 'tomato', 'cheese'],
        requiredEquipment: ['cutting_board'],
        image: 'images/food/sandwich.png',
        unlocked: false
      },
      {
        id: 'oatmeal',
        name: '燕麦粥',
        description: '健康美味的燕麦粥，可以添加各种水果',
        price: 12,
        cost: 4,
        cookTime: 20,
        popularity: 75,
        ingredients: ['oat', 'milk'],
        requiredEquipment: ['pot'],
        image: 'images/food/oatmeal.png',
        unlocked: false
      },
      {
        id: 'cappuccino',
        name: '卡布奇诺',
        description: '浓郁香醇的卡布奇诺，奶泡丰富',
        price: 16,
        cost: 5,
        cookTime: 20,
        popularity: 92,
        ingredients: ['coffee_bean', 'milk'],
        requiredEquipment: ['coffee_machine'],
        image: 'images/food/cappuccino.png',
        unlocked: false
      }
    ],

    // 食材列表
    ingredients: [
      {
        id: 'bacon',
        name: '培根',
        price: 20,
        image: 'images/ingredients/bacon.png'
      },
      {
        id: 'egg',
        name: '鸡蛋',
        price: 15,
        image: 'images/ingredients/egg.png'
      },
      {
        id: 'flour',
        name: '面粉',
        price: 10,
        image: 'images/ingredients/flour.png'
      },
      {
        id: 'milk',
        name: '牛奶',
        price: 12,
        image: 'images/ingredients/milk.png'
      },
      {
        id: 'bread',
        name: '面包',
        price: 15,
        image: 'images/ingredients/bread.png'
      },
      {
        id: 'coffee_bean',
        name: '咖啡豆',
        price: 25,
        image: 'images/ingredients/coffee_bean.png'
      },
      {
        id: 'water',
        name: '水',
        price: 5,
        image: 'images/ingredients/water.png'
      },
      {
        id: 'butter',
        name: '黄油',
        price: 18,
        image: 'images/ingredients/butter.png'
      },
      {
        id: 'lettuce',
        name: '生菜',
        price: 8,
        image: 'images/ingredients/lettuce.png'
      },
      {
        id: 'tomato',
        name: '番茄',
        price: 10,
        image: 'images/ingredients/tomato.png'
      },
      {
        id: 'cheese',
        name: '奶酪',
        price: 22,
        image: 'images/ingredients/cheese.png'
      },
      {
        id: 'oat',
        name: '燕麦',
        price: 15,
        image: 'images/ingredients/oat.png'
      }
    ]
  },

  /**
   * 设备配置
   */
  equipment: {
    // 设备列表
    items: [
      {
        id: 'pan',
        name: '平底锅',
        description: '基础烹饪工具，可以用来煎炸食物',
        price: 0, // 初始设备，免费
        level: 1,
        cookingSpeedBonus: 0,
        qualityBonus: 0,
        image: 'images/equipment/pan.png',
        unlocked: true
      },
      {
        id: 'toaster',
        name: '烤面包机',
        description: '用于烤制面包，制作吐司',
        price: 200,
        level: 2,
        cookingSpeedBonus: 10,
        qualityBonus: 5,
        image: 'images/equipment/toaster.png',
        unlocked: false
      },
      {
        id: 'coffee_machine',
        name: '咖啡机',
        description: '用于制作各种咖啡饮品',
        price: 350,
        level: 3,
        cookingSpeedBonus: 15,
        qualityBonus: 10,
        image: 'images/equipment/coffee_machine.png',
        unlocked: false
      },
      {
        id: 'oven',
        name: '烤箱',
        description: '用于烘焙面包、蛋糕等食物',
        price: 500,
        level: 4,
        cookingSpeedBonus: 20,
        qualityBonus: 15,
        image: 'images/equipment/oven.png',
        unlocked: false
      },
      {
        id: 'cutting_board',
        name: '切菜板',
        description: '用于准备三明治等需要切割的食物',
        price: 150,
        level: 2,
        cookingSpeedBonus: 5,
        qualityBonus: 5,
        image: 'images/equipment/cutting_board.png',
        unlocked: false
      },
      {
        id: 'pot',
        name: '锅',
        description: '用于煮粥、汤等液体食物',
        price: 250,
        level: 3,
        cookingSpeedBonus: 10,
        qualityBonus: 8,
        image: 'images/equipment/pot.png',
        unlocked: false
      }
    ],

    // 设备升级
    upgrades: [
      {
        id: 'pan_upgrade',
        name: '高级平底锅',
        description: '提高煎炸食物的速度和质量',
        price: 300,
        targetEquipment: 'pan',
        cookingSpeedBonus: 20,
        qualityBonus: 15,
        image: 'images/equipment/pan_upgrade.png',
        unlocked: false
      },
      {
        id: 'coffee_machine_upgrade',
        name: '专业咖啡机',
        description: '制作更高品质的咖啡饮品',
        price: 600,
        targetEquipment: 'coffee_machine',
        cookingSpeedBonus: 25,
        qualityBonus: 20,
        image: 'images/equipment/coffee_machine_upgrade.png',
        unlocked: false
      },
      {
        id: 'oven_upgrade',
        name: '对流烤箱',
        description: '更快速、更均匀地烘焙食物',
        price: 800,
        targetEquipment: 'oven',
        cookingSpeedBonus: 30,
        qualityBonus: 25,
        image: 'images/equipment/oven_upgrade.png',
        unlocked: false
      }
    ]
  },

  /**
   * 装饰配置
   */
  decoration: {
    // 墙纸
    wallpapers: [
      {
        id: 'basic_wallpaper',
        name: '基础墙纸',
        description: '简单的米色墙纸',
        price: 0, // 初始装饰，免费
        customerHappinessBonus: 0,
        image: 'images/decoration/basic_wallpaper.png',
        unlocked: true
      },
      {
        id: 'modern_wallpaper',
        name: '现代风格墙纸',
        description: '时尚的灰色条纹墙纸',
        price: 200,
        customerHappinessBonus: 5,
        image: 'images/decoration/modern_wallpaper.png',
        unlocked: false
      },
      {
        id: 'vintage_wallpaper',
        name: '复古风格墙纸',
        description: '怀旧的花纹墙纸',
        price: 300,
        customerHappinessBonus: 8,
        image: 'images/decoration/vintage_wallpaper.png',
        unlocked: false
      }
    ],

    // 地板
    floors: [
      {
        id: 'basic_floor',
        name: '基础地板',
        description: '简单的木质地板',
        price: 0, // 初始装饰，免费
        customerHappinessBonus: 0,
        image: 'images/decoration/basic_floor.png',
        unlocked: true
      },
      {
        id: 'tile_floor',
        name: '瓷砖地板',
        description: '整洁的白色瓷砖地板',
        price: 250,
        customerHappinessBonus: 5,
        image: 'images/decoration/tile_floor.png',
        unlocked: false
      },
      {
        id: 'marble_floor',
        name: '大理石地板',
        description: '高档的大理石地板',
        price: 500,
        customerHappinessBonus: 10,
        image: 'images/decoration/marble_floor.png',
        unlocked: false
      }
    ],

    // 植物
    plants: [
      {
        id: 'small_plant',
        name: '小盆栽',
        description: '为店铺增添一抹绿色',
        price: 100,
        customerHappinessBonus: 3,
        image: 'images/decoration/small_plant.png',
        unlocked: false
      },
      {
        id: 'medium_plant',
        name: '中型盆栽',
        description: '美化店铺环境',
        price: 200,
        customerHappinessBonus: 5,
        image: 'images/decoration/medium_plant.png',
        unlocked: false
      },
      {
        id: 'large_plant',
        name: '大型盆栽',
        description: '提升店铺格调',
        price: 350,
        customerHappinessBonus: 8,
        image: 'images/decoration/large_plant.png',
        unlocked: false
      }
    ]
  },

  /**
   * 顾客配置
   */
  customer: {
    // 顾客类型
    types: [
      {
        id: 'regular',
        name: '普通顾客',
        description: '没有特殊要求的顾客',
        patience: 30, // 等待时间（秒）
        tipChance: 0.2, // 给小费的概率
        tipAmount: [1, 5], // 小费范围
        image: 'images/customers/regular.png',
        weight: 70 // 出现权重
      },
      {
        id: 'hurried',
        name: '匆忙顾客',
        description: '时间紧迫，等待耐心较低',
        patience: 20,
        tipChance: 0.1,
        tipAmount: [1, 3],
        image: 'images/customers/hurried.png',
        weight: 15
      },
      {
        id: 'picky',
        name: '挑剔顾客',
        description: '对食物质量要求较高',
        patience: 35,
        tipChance: 0.3,
        tipAmount: [3, 8],
        image: 'images/customers/picky.png',
        weight: 10
      },
      {
        id: 'wealthy',
        name: '富有顾客',
        description: '更愿意给小费',
        patience: 40,
        tipChance: 0.6,
        tipAmount: [5, 15],
        image: 'images/customers/wealthy.png',
        weight: 5
      }
    ],
    
    // 顾客生成配置
    generation: {
      // 基础生成间隔（秒）
      baseInterval: 20,
      
      // 随机波动范围（秒）
      intervalVariation: 10,
      
      // 最大同时顾客数量（根据店铺等级增加）
      baseMaxCustomers: 3,
      
      // 每个店铺等级增加的最大顾客数
      customersPerShopLevel: 1
    },
    
    // 顾客满意度配置
    satisfaction: {
      // 等待时间影响
      waitTimeImpact: -2, // 每10秒减少的满意度
      
      // 食物质量影响
      foodQualityImpact: 0.2, // 每1点食物质量增加的满意度
      
      // 订单错误影响
      orderErrorImpact: -30, // 订单错误减少的满意度
      
      // 店铺装饰影响
      decorationImpact: 1 // 每1点装饰加成增加的满意度
    }
  },
  
  /**
   * 游戏难度配置
   */
  difficulty: {
    // 难度级别
    levels: [
      {
        id: 'easy',
        name: '简单',
        description: '适合新手玩家，游戏节奏较慢',
        customerPatienceMultiplier: 1.2, // 顾客耐心倍数
        earningsMultiplier: 1.2, // 收入倍数
        customerIntervalMultiplier: 1.3, // 顾客生成间隔倍数
        cookingTimeMultiplier: 0.9 // 烹饪时间倍数
      },
      {
        id: 'normal',
        name: '普通',
        description: '标准游戏体验',
        customerPatienceMultiplier: 1.0,
        earningsMultiplier: 1.0,
        customerIntervalMultiplier: 1.0,
        cookingTimeMultiplier: 1.0
      },
      {
        id: 'hard',
        name: '困难',
        description: '适合有经验的玩家，游戏节奏较快',
        customerPatienceMultiplier: 0.8,
        earningsMultiplier: 0.9,
        customerIntervalMultiplier: 0.8,
        cookingTimeMultiplier: 1.1
      }
    ],
    
    // 默认难度
    defaultDifficulty: 'normal'
  },
  
  /**
   * 商店配置
   */
  shop: {
    // 商店分类
    categories: [
      {
        id: 'equipment',
        name: '设备',
        description: '购买烹饪设备',
        icon: 'images/ui/equipment_icon.png'
      },
      {
        id: 'ingredients',
        name: '食材',
        description: '购买烹饪食材',
        icon: 'images/ui/ingredients_icon.png'
      },
      {
        id: 'decoration',
        name: '装饰',
        description: '购买店铺装饰',
        icon: 'images/ui/decoration_icon.png'
      },
      {
        id: 'upgrades',
        name: '升级',
        description: '升级现有设备',
        icon: 'images/ui/upgrades_icon.png'
      }
    ],
    
    // 商店刷新配置
    refresh: {
      // 自动刷新间隔（小时）
      autoRefreshInterval: 24,
      
      // 手动刷新费用（金币）
      manualRefreshCost: 50
    },
    
    // 折扣活动配置
    discounts: {
      // 折扣概率
      chance: 0.2,
      
      // 折扣范围
      range: [0.1, 0.3], // 10%-30%的折扣
      
      // 折扣持续时间（小时）
      duration: 6
    }
  },
  
  /**
   * 游戏进度配置
   */
  progression: {
    // 等级解锁
    unlocks: [
      {
        level: 1,
        items: ['bacon_and_egg']
      },
      {
        level: 2,
        items: ['pancake', 'toaster']
      },
      {
        level: 3,
        items: ['coffee', 'coffee_machine']
      },
      {
        level: 4,
        items: ['toast', 'cutting_board']
      },
      {
        level: 5,
        items: ['croissant', 'oven']
      },
      {
        level: 6,
        items: ['sandwich', 'pot']
      },
      {
        level: 7,
        items: ['oatmeal']
      },
      {
        level: 8,
        items: ['cappuccino']
      }
    ],
    
    // 成就
    achievements: [
      {
        id: 'first_day',
        name: '第一天',
        description: '完成你的第一天营业',
        reward: {
          coins: 50,
          gems: 1
        }
      },
      {
        id: 'money_maker',
        name: '赚钱高手',
        description: '累计赚取1000金币',
        reward: {
          coins: 100,
          gems: 2
        }
      },
      {
        id: 'customer_service',
        name: '顾客服务',
        description: '服务50位顾客',
        reward: {
          coins: 150,
          gems: 3
        }
      },
      {
        id: 'perfect_dish',
        name: '完美料理',
        description: '制作10道完美料理',
        reward: {
          coins: 200,
          gems: 4
        }
      },
      {
        id: 'shop_owner',
        name: '店铺老板',
        description: '购买5件店铺升级',
        reward: {
          coins: 250,
          gems: 5
        }
      }
    ]
  }
};

module.exports = gameConfig;