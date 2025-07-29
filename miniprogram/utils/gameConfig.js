/**
 * 早餐店模拟器 - 游戏配置
 * 包含游戏中的各种配置数据，如食物、设备、顾客类型等
 */

// 食物配置
const FOOD_CONFIG = [
  {
    id: 'soy_milk',
    name: '豆浆',
    price: 5,
    cost: 2,
    cookTime: 15,
    baseQuality: 70,
    category: 'drink',
    description: '香浓可口的传统豆浆',
    image: '/images/food/soy_milk.png',
    unlocked: true
  },
  {
    id: 'rice_porridge',
    name: '白粥',
    price: 4,
    cost: 1,
    cookTime: 20,
    baseQuality: 75,
    category: 'porridge',
    description: '香软可口的白米粥',
    image: '/images/food/rice_porridge.png',
    unlocked: true
  },
  {
    id: 'steamed_bun',
    name: '馒头',
    price: 3,
    cost: 1,
    cookTime: 25,
    baseQuality: 80,
    category: 'staple',
    description: '松软可口的传统主食',
    image: '/images/food/steamed_bun.png',
    unlocked: true
  },
  {
    id: 'fried_dough_stick',
    name: '油条',
    price: 3,
    cost: 1,
    cookTime: 10,
    baseQuality: 65,
    category: 'fried',
    description: '金黄酥脆的传统早点',
    image: '/images/food/fried_dough_stick.png',
    unlocked: true
  },
  {
    id: 'tea_egg',
    name: '茶叶蛋',
    price: 2,
    cost: 1,
    cookTime: 30,
    baseQuality: 75,
    category: 'side',
    description: '入味香浓的茶香鸡蛋',
    image: '/images/food/tea_egg.png',
    unlocked: true
  },
  {
    id: 'scallion_pancake',
    name: '葱油饼',
    price: 5,
    cost: 2,
    cookTime: 15,
    baseQuality: 70,
    category: 'pancake',
    description: '香脆可口的葱香饼',
    image: '/images/food/scallion_pancake.png',
    unlocked: false,
    unlockCost: 200
  },
  {
    id: 'rice_ball',
    name: '饭团',
    price: 6,
    cost: 2,
    cookTime: 20,
    baseQuality: 75,
    category: 'staple',
    description: '美味可口的米饭团',
    image: '/images/food/rice_ball.png',
    unlocked: false,
    unlockCost: 250
  },
  {
    id: 'steamed_rice_roll',
    name: '肠粉',
    price: 8,
    cost: 3,
    cookTime: 25,
    baseQuality: 80,
    category: 'staple',
    description: '滑嫩可口的广式肠粉',
    image: '/images/food/steamed_rice_roll.png',
    unlocked: false,
    unlockCost: 300
  },
  {
    id: 'wonton',
    name: '馄饨',
    price: 10,
    cost: 4,
    cookTime: 20,
    baseQuality: 85,
    category: 'soup',
    description: '鲜美可口的传统馄饨',
    image: '/images/food/wonton.png',
    unlocked: false,
    unlockCost: 350
  },
  {
    id: 'baozi',
    name: '包子',
    price: 6,
    cost: 2,
    cookTime: 30,
    baseQuality: 80,
    category: 'staple',
    description: '松软可口的传统包子',
    image: '/images/food/baozi.png',
    unlocked: false,
    unlockCost: 250
  },
  {
    id: 'congee',
    name: '皮蛋瘦肉粥',
    price: 12,
    cost: 5,
    cookTime: 35,
    baseQuality: 90,
    category: 'porridge',
    description: '香浓可口的传统粥品',
    image: '/images/food/congee.png',
    unlocked: false,
    unlockCost: 400
  },
  {
    id: 'dumpling',
    name: '水饺',
    price: 10,
    cost: 4,
    cookTime: 25,
    baseQuality: 85,
    category: 'staple',
    description: '鲜美可口的传统水饺',
    image: '/images/food/dumpling.png',
    unlocked: false,
    unlockCost: 350
  },
  {
    id: 'tea',
    name: '茶',
    price: 4,
    cost: 1,
    cookTime: 10,
    baseQuality: 75,
    category: 'drink',
    description: '清香可口的传统茶饮',
    image: '/images/food/tea.png',
    unlocked: false,
    unlockCost: 150
  },
  {
    id: 'milk_tea',
    name: '奶茶',
    price: 8,
    cost: 3,
    cookTime: 15,
    baseQuality: 80,
    category: 'drink',
    description: '香浓可口的传统奶茶',
    image: '/images/food/milk_tea.png',
    unlocked: false,
    unlockCost: 300
  },
  {
    id: 'fried_rice',
    name: '蛋炒饭',
    price: 12,
    cost: 5,
    cookTime: 20,
    baseQuality: 85,
    category: 'staple',
    description: '香喷可口的传统炒饭',
    image: '/images/food/fried_rice.png',
    unlocked: false,
    unlockCost: 400
  }
];

// 设备配置
const EQUIPMENT_CONFIG = [
  {
    id: 'basic_stove',
    name: '基础炉灶',
    effect: {
      type: 'cooking_speed',
      value: 0
    },
    price: 0,
    description: '基础的炉灶，没有特殊效果',
    image: '/images/equipment/basic_stove.png',
    owned: true
  },
  {
    id: 'advanced_stove',
    name: '高级炉灶',
    effect: {
      type: 'cooking_speed',
      value: 20
    },
    price: 500,
    description: '提高烹饪速度20%',
    image: '/images/equipment/advanced_stove.png',
    owned: false
  },
  {
    id: 'quality_pot',
    name: '优质锅具',
    effect: {
      type: 'base_quality',
      value: 10
    },
    price: 600,
    description: '提高食物基础质量10%',
    image: '/images/equipment/quality_pot.png',
    owned: false
  },
  {
    id: 'auto_cooker',
    name: '自动烹饪机',
    effect: {
      type: 'auto_quality',
      value: 5
    },
    price: 1000,
    description: '每秒自动提升食物质量5%',
    image: '/images/equipment/auto_cooker.png',
    owned: false
  },
  {
    id: 'food_warmer',
    name: '食物保温器',
    effect: {
      type: 'food_freshness',
      value: 30
    },
    price: 800,
    description: '延长食物新鲜度30%',
    image: '/images/equipment/food_warmer.png',
    owned: false
  },
  {
    id: 'multi_cooker',
    name: '多功能烹饪机',
    effect: {
      type: 'multi_cook',
      value: 2
    },
    price: 1500,
    description: '可以同时烹饪2种食物',
    image: '/images/equipment/multi_cooker.png',
    owned: false
  },
  {
    id: 'premium_ingredients',
    name: '优质食材',
    effect: {
      type: 'all_quality',
      value: 15
    },
    price: 1200,
    description: '提高所有食物质量15%',
    image: '/images/equipment/premium_ingredients.png',
    owned: false
  },
  {
    id: 'customer_service',
    name: '顾客服务培训',
    effect: {
      type: 'customer_patience',
      value: 20
    },
    price: 1000,
    description: '提高顾客耐心20%',
    image: '/images/equipment/customer_service.png',
    owned: false
  },
  {
    id: 'efficient_layout',
    name: '高效布局',
    effect: {
      type: 'serve_speed',
      value: 25
    },
    price: 900,
    description: '提高上菜速度25%',
    image: '/images/equipment/efficient_layout.png',
    owned: false
  },
  {
    id: 'advertising',
    name: '广告宣传',
    effect: {
      type: 'customer_rate',
      value: 30
    },
    price: 1200,
    description: '提高顾客到来频率30%',
    image: '/images/equipment/advertising.png',
    owned: false
  }
];

// 顾客类型配置
const CUSTOMER_TYPES = [
  {
    id: 'regular',
    name: '普通顾客',
    patienceBase: 120,
    patienceVariance: 30,
    tipChance: 0.3,
    tipPercent: 0.1,
    frequency: 0.6,
    images: [
      '/images/customers/regular_1.png',
      '/images/customers/regular_2.png',
      '/images/customers/regular_3.png',
      '/images/customers/regular_4.png'
    ]
  },
  {
    id: 'businessman',
    name: '商务人士',
    patienceBase: 90,
    patienceVariance: 20,
    tipChance: 0.6,
    tipPercent: 0.2,
    frequency: 0.2,
    images: [
      '/images/customers/businessman_1.png',
      '/images/customers/businessman_2.png'
    ]
  },
  {
    id: 'student',
    name: '学生',
    patienceBase: 150,
    patienceVariance: 40,
    tipChance: 0.1,
    tipPercent: 0.05,
    frequency: 0.15,
    images: [
      '/images/customers/student_1.png',
      '/images/customers/student_2.png'
    ]
  },
  {
    id: 'elderly',
    name: '老年人',
    patienceBase: 180,
    patienceVariance: 30,
    tipChance: 0.4,
    tipPercent: 0.15,
    frequency: 0.05,
    images: [
      '/images/customers/elderly_1.png',
      '/images/customers/elderly_2.png'
    ]
  }
];

// 游戏难度设置
const DIFFICULTY_SETTINGS = {
  easy: {
    name: '简单',
    customerRate: 0.7,
    customerPatienceMultiplier: 1.2,
    foodQualityMultiplier: 1.2,
    earningsMultiplier: 1.2,
    startingMoney: 200
  },
  normal: {
    name: '普通',
    customerRate: 1.0,
    customerPatienceMultiplier: 1.0,
    foodQualityMultiplier: 1.0,
    earningsMultiplier: 1.0,
    startingMoney: 100
  },
  hard: {
    name: '困难',
    customerRate: 1.3,
    customerPatienceMultiplier: 0.8,
    foodQualityMultiplier: 0.8,
    earningsMultiplier: 0.8,
    startingMoney: 50
  }
};

// 成就配置
const ACHIEVEMENTS = [
  {
    id: 'first_day',
    name: '第一天',
    description: '完成第一天的营业',
    condition: {
      type: 'days_completed',
      value: 1
    },
    reward: {
      type: 'money',
      value: 50
    },
    icon: '/images/achievements/first_day.png'
  },
  {
    id: 'week_milestone',
    name: '一周里程碑',
    description: '连续经营7天',
    condition: {
      type: 'days_completed',
      value: 7
    },
    reward: {
      type: 'money',
      value: 200
    },
    icon: '/images/achievements/week_milestone.png'
  },
  {
    id: 'master_chef',
    name: '大厨',
    description: '制作100道完美料理',
    condition: {
      type: 'perfect_dishes',
      value: 100
    },
    reward: {
      type: 'equipment',
      value: 'quality_pot'
    },
    icon: '/images/achievements/master_chef.png'
  },
  {
    id: 'popular_store',
    name: '人气店铺',
    description: '服务500位顾客',
    condition: {
      type