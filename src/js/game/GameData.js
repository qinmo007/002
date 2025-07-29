/**
 * 游戏数据
 * 包含游戏中的静态数据，如食谱、设备类型和顾客类型等
 */

// 设备类型数据
export const EQUIPMENT_TYPES = [
  {
    id: 'stove',
    name: '炉灶',
    type: 'cooking',
    description: '基础烹饪设备，用于煎炒烹炸',
    cookTime: 8000,
    basePrice: 500,
    recipes: ['fried_egg', 'scrambled_egg', 'bacon', 'sausage'],
    unlockLevel: 1
  },
  {
    id: 'grill',
    name: '烤架',
    type: 'cooking',
    description: '用于烤制食物，如面包、肉类等',
    cookTime: 10000,
    basePrice: 800,
    recipes: ['toast', 'pancake', 'grilled_sausage', 'grilled_sandwich'],
    unlockLevel: 2
  },
  {
    id: 'coffee_machine',
    name: '咖啡机',
    type: 'beverage',
    description: '用于制作各种咖啡饮品',
    cookTime: 5000,
    basePrice: 1200,
    recipes: ['coffee', 'latte', 'cappuccino', 'americano'],
    unlockLevel: 3
  },
  {
    id: 'juicer',
    name: '榨汁机',
    type: 'beverage',
    description: '用于制作新鲜果汁',
    cookTime: 6000,
    basePrice: 1000,
    recipes: ['orange_juice', 'apple_juice', 'mixed_juice', 'smoothie'],
    unlockLevel: 4
  },
  {
    id: 'steamer',
    name: '蒸锅',
    type: 'cooking',
    description: '用于蒸制食物，如包子、馒头等',
    cookTime: 12000,
    basePrice: 1500,
    recipes: ['steamed_bun', 'dumpling', 'rice_roll', 'steamed_rice'],
    unlockLevel: 5
  },
  {
    id: 'fryer',
    name: '油炸锅',
    type: 'cooking',
    description: '用于油炸食物，如油条、炸鸡等',
    cookTime: 9000,
    basePrice: 1800,
    recipes: ['fried_dough', 'fried_chicken', 'french_fries', 'onion_rings'],
    unlockLevel: 6
  },
  {
    id: 'oven',
    name: '烤箱',
    type: 'cooking',
    description: '用于烘焙食物，如面包、蛋糕等',
    cookTime: 15000,
    basePrice: 2000,
    recipes: ['bread', 'croissant', 'cake', 'cookie'],
    unlockLevel: 7
  },
  {
    id: 'blender',
    name: '搅拌机',
    type: 'beverage',
    description: '用于制作奶昔、冰沙等',
    cookTime: 7000,
    basePrice: 1600,
    recipes: ['milkshake', 'smoothie', 'protein_shake', 'yogurt'],
    unlockLevel: 8
  }
]

// 食谱数据
export const RECIPE_DATA = [
  // 炉灶食谱
  {
    id: 'fried_egg',
    name: '煎蛋',
    type: 'main',
    description: '简单的煎鸡蛋，早餐的经典选择',
    price: 5,
    cookTime: 5000,
    ingredients: ['egg'],
    equipmentId: 'stove',
    unlockLevel: 1
  },
  {
    id: 'scrambled_egg',
    name: '炒鸡蛋',
    type: 'main',
    description: '松软可口的炒鸡蛋',
    price: 6,
    cookTime: 6000,
    ingredients: ['egg', 'salt'],
    equipmentId: 'stove',
    unlockLevel: 1
  },
  {
    id: 'bacon',
    name: '培根',
    type: 'side',
    description: '香脆的培根条',
    price: 8,
    cookTime: 7000,
    ingredients: ['bacon'],
    equipmentId: 'stove',
    unlockLevel: 1
  },
  {
    id: 'sausage',
    name: '香肠',
    type: 'side',
    description: '美味的早餐香肠',
    price: 7,
    cookTime: 8000,
    ingredients: ['sausage'],
    equipmentId: 'stove',
    unlockLevel: 1
  },

  // 烤架食谱
  {
    id: 'toast',
    name: '吐司',
    type: 'staple',
    description: '香脆的烤面包片',
    price: 3,
    cookTime: 4000,
    ingredients: ['bread'],
    equipmentId: 'grill',
    unlockLevel: 2
  },
  {
    id: 'pancake',
    name: '煎饼',
    type: 'staple',
    description: '松软的美式煎饼',
    price: 10,
    cookTime: 8000,
    ingredients: ['flour', 'egg', 'milk'],
    equipmentId: 'grill',
    unlockLevel: 2
  },
  {
    id: 'grilled_sausage',
    name: '烤香肠',
    type: 'side',
    description: '外焦里嫩的烤香肠',
    price: 8,
    cookTime: 9000,
    ingredients: ['sausage'],
    equipmentId: 'grill',
    unlockLevel: 2
  },
  {
    id: 'grilled_sandwich',
    name: '烤三明治',
    type: 'main',
    description: '美味的烤三明治',
    price: 12,
    cookTime: 10000,
    ingredients: ['bread', 'cheese', 'ham', 'lettuce'],
    equipmentId: 'grill',
    unlockLevel: 3
  },

  // 咖啡机食谱
  {
    id: 'coffee',
    name: '黑咖啡',
    type: 'beverage',
    description: '浓郁的黑咖啡',
    price: 8,
    cookTime: 3000,
    ingredients: ['coffee_bean'],
    equipmentId: 'coffee_machine',
    unlockLevel: 3
  },
  {
    id: 'latte',
    name: '拿铁',
    type: 'beverage',
    description: '香浓的拿铁咖啡',
    price: 12,
    cookTime: 5000,
    ingredients: ['coffee_bean', 'milk'],
    equipmentId: 'coffee_machine',
    unlockLevel: 3
  },
  {
    id: 'cappuccino',
    name: '卡布奇诺',
    type: 'beverage',
    description: '经典的卡布奇诺咖啡',
    price: 15,
    cookTime: 6000,
    ingredients: ['coffee_bean', 'milk', 'milk_foam'],
    equipmentId: 'coffee_machine',
    unlockLevel: 4
  },
  {
    id: 'americano',
    name: '美式咖啡',
    type: 'beverage',
    description: '清爽的美式咖啡',
    price: 10,
    cookTime: 4000,
    ingredients: ['coffee_bean', 'water'],
    equipmentId: 'coffee_machine',
    unlockLevel: 3
  },

  // 榨汁机食谱
  {
    id: 'orange_juice',
    name: '橙汁',
    type: 'beverage',
    description: '新鲜的橙汁',
    price: 8,
    cookTime: 5000,
    ingredients: ['orange'],
    equipmentId: 'juicer',
    unlockLevel: 4
  },
  {
    id: 'apple_juice',
    name: '苹果汁',
    type: 'beverage',
    description: '清甜的苹果汁',
    price: 8,
    cookTime: 5000,
    ingredients: ['apple'],
    equipmentId: 'juicer',
    unlockLevel: 4
  },
  {
    id: 'mixed_juice',
    name: '混合果汁',
    type: 'beverage',
    description: '多种水果混合的果汁',
    price: 12,
    cookTime: 7000,
    ingredients: ['orange', 'apple', 'banana'],
    equipmentId: 'juicer',
    unlockLevel: 5
  },
  {
    id: 'smoothie',
    name: '冰沙',
    type: 'beverage',
    description: '冰凉可口的水果冰沙',
    price: 15,
    cookTime: 8000,
    ingredients: ['mixed_fruit', 'ice', 'yogurt'],
    equipmentId: 'juicer',
    unlockLevel: 5
  },

  // 蒸锅食谱
  {
    id: 'steamed_bun',
    name: '包子',
    type: 'staple',
    description: '松软的包子',
    price: 5,
    cookTime: 10000,
    ingredients: ['flour', 'filling'],
    equipmentId: 'steamer',
    unlockLevel: 5
  },
  {
    id: 'dumpling',
    name: '饺子',
    type: 'staple',
    description: '美味的饺子',
    price: 8,
    cookTime: 12000,
    ingredients: ['flour', 'filling'],
    equipmentId: 'steamer',
    unlockLevel: 5
  },
  {
    id: 'rice_roll',
    name: '肠粉',
    type: 'staple',
    description: '滑嫩的肠粉',
    price: 10,
    cookTime: 8000,
    ingredients: ['rice_flour', 'filling'],
    equipmentId: 'steamer',
    unlockLevel: 6
  },
  {
    id: 'steamed_rice',
    name: '蒸饭',
    type: 'staple',
    description: '香软的米饭',
    price: 3,
    cookTime: 15000,
    ingredients: ['rice'],
    equipmentId: 'steamer',
    unlockLevel: 5
  }
]

// 顾客类型数据
export const CUSTOMER_TYPES = [
  {
    id: 'normal',
    name: '普通顾客',
    patience: 60, // 耐心值（秒）
    spendingMultiplier: 1.0, // 消费倍率
    baseWeight: 70 // 出现权重
  },
  {
    id: 'student',
    name: '学生',
    patience: 45,
    spendingMultiplier: 0.8,
    baseWeight: 50
  },
  {
    id: 'businessman',
    name: '商务人士',
    patience: 30,
    spendingMultiplier: 1.5,
    baseWeight: 30
  },
  {
    id: 'vip',
    name: 'VIP顾客',
    patience: 90,
    spendingMultiplier: 2.0,
    baseWeight: 10
  },
  {
    id: 'critic',
    name: '美食评论家',
    patience: 120,
    spendingMultiplier: 1.8,
    baseWeight: 5
  }
]

// 顾客食物偏好
export const FOOD_PREFERENCES = {
  normal: ['fried_egg', 'toast', 'coffee', 'orange_juice', 'steamed_bun'],
  student: ['scrambled_egg', 'pancake', 'milk', 'apple_juice', 'steamed_rice'],
  businessman: ['grilled_sandwich', 'coffee', 'americano', 'bacon', 'toast'],
  vip: ['cappuccino', 'latte', 'grilled_sandwich', 'pancake', 'mixed_juice'],
  critic: ['cappuccino', 'croissant', 'grilled_sandwich', 'smoothie', 'rice_roll']
}

// 升级经验需求
export const LEVEL_EXPERIENCE = [
  0,      // 1级
  100,    // 2级
  300,    // 3级
  600,    // 4级
  1000,   // 5级
  1500,   // 6级
  2200,   // 7级
  3000,   // 8级
  4000,   // 9级
  5500,   // 10级
  7000,   // 11级
  9000,   // 12级
  11000,  // 13级
  13500,  // 14级
  16000,  // 15级
  19000,  // 16级
  22000,  // 17级
  25500,  // 18级
  29000,  // 19级
  33000   // 20级
]

// 成就数据
export const ACHIEVEMENTS = [
  {
    id: 'first_day',
    name: '第一天',
    description: '完成第一天的营业',
    condition: { type: 'days_played', value: 1 },
    reward: { type: 'money', value: 100 }
  },
  {
    id: 'week_milestone',
    name: '一周里程碑',
    description: '经营早餐店一周',
    condition: { type: 'days_played', value: 7 },
    reward: { type: 'money', value: 500 }
  },
  {
    id: 'month_milestone',
    name: '一月里程碑',
    description: '经营早餐店一个月',
    condition: { type: 'days_played', value: 30 },
    reward: { type: 'money', value: 2000