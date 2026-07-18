export interface VocabularyWord {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  hskLevel: 1 | 2 | 3;
  category: 'Greetings' | 'Food' | 'Numbers' | 'Time' | 'Travel' | 'Work' | 'Daily' | 'Emotions';
  example: {
    hanzi: string;
    pinyin: string;
    english: string;
  };
}

export const HSK_VOCABULARY: VocabularyWord[] = [
  // ==========================================
  // HSK LEVEL 1 (Beginner Core)
  // ==========================================
  {
    id: 'hsk1-1',
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    english: 'Hello / Hi',
    hskLevel: 1,
    category: 'Greetings',
    example: {
      hanzi: '你好，很高兴认识你。',
      pinyin: 'Nǐ hǎo, hěn gāoxìng rènshí nǐ.',
      english: 'Hello, nice to meet you.',
    },
  },
  {
    id: 'hsk1-2',
    hanzi: '谢谢',
    pinyin: 'xièxie',
    english: 'Thank you',
    hskLevel: 1,
    category: 'Greetings',
    example: {
      hanzi: '谢谢你的帮助。',
      pinyin: 'Xièxie nǐ de bāngzhù.',
      english: 'Thank you for your help.',
    },
  },
  {
    id: 'hsk1-3',
    hanzi: '再见',
    pinyin: 'zàijiàn',
    english: 'Goodbye / See you again',
    hskLevel: 1,
    category: 'Greetings',
    example: {
      hanzi: '老师，再见！',
      pinyin: 'Lǎoshī, zàijiàn!',
      english: 'Teacher, goodbye!',
    },
  },
  {
    id: 'hsk1-4',
    hanzi: '对不起',
    pinyin: 'duìbuqǐ',
    english: 'Sorry / Excuse me',
    hskLevel: 1,
    category: 'Greetings',
    example: {
      hanzi: '对不起，我迟到了。',
      pinyin: 'Duìbuqǐ, wǒ chídào le.',
      english: 'Sorry, I am late.',
    },
  },
  {
    id: 'hsk1-5',
    hanzi: '没关系',
    pinyin: 'méi guānxi',
    english: "It's okay / Never mind",
    hskLevel: 1,
    category: 'Greetings',
    example: {
      hanzi: '没关系，别担心。',
      pinyin: 'Méi guānxi, bié dānxīn.',
      english: "It's okay, don't worry.",
    },
  },
  {
    id: 'hsk1-6',
    hanzi: '水',
    pinyin: 'shuǐ',
    english: 'Water',
    hskLevel: 1,
    category: 'Food',
    example: {
      hanzi: '我想喝水。',
      pinyin: 'Wǒ xiǎng hē shuǐ.',
      english: 'I want to drink water.',
    },
  },
  {
    id: 'hsk1-7',
    hanzi: '茶',
    pinyin: 'chá',
    english: 'Tea',
    hskLevel: 1,
    category: 'Food',
    example: {
      hanzi: '你喜欢喝绿茶吗？',
      pinyin: 'Nǐ xǐhuan hē lǜchá ma?',
      english: 'Do you like drinking green tea?',
    },
  },
  {
    id: 'hsk1-8',
    hanzi: '米饭',
    pinyin: 'mǐfàn',
    english: 'Cooked rice',
    hskLevel: 1,
    category: 'Food',
    example: {
      hanzi: '中午我们吃米饭。',
      pinyin: 'Zhōngwǔ wǒmen chī mǐfàn.',
      english: 'We eat rice at noon.',
    },
  },
  {
    id: 'hsk1-9',
    hanzi: '苹果',
    pinyin: 'píngguǒ',
    english: 'Apple',
    hskLevel: 1,
    category: 'Food',
    example: {
      hanzi: '这个苹果很大。',
      pinyin: 'Zhège píngguǒ hěn dà.',
      english: 'This apple is very big.',
    },
  },
  {
    id: 'hsk1-10',
    hanzi: '面条',
    pinyin: 'miàntiáo',
    english: 'Noodles',
    hskLevel: 1,
    category: 'Food',
    example: {
      hanzi: '牛肉面条真好吃。',
      pinyin: 'Niúròu miàntiáo zhēn hǎochī.',
      english: 'Beef noodles are really delicious.',
    },
  },
  {
    id: 'hsk1-11',
    hanzi: '一',
    pinyin: 'yī',
    english: 'One',
    hskLevel: 1,
    category: 'Numbers',
    example: {
      hanzi: '我有一个问题。',
      pinyin: 'Wǒ yǒu yī gè wèntí.',
      english: 'I have one question.',
    },
  },
  {
    id: 'hsk1-12',
    hanzi: '二',
    pinyin: 'èr',
    english: 'Two',
    hskLevel: 1,
    category: 'Numbers',
    example: {
      hanzi: '第二课很精彩。',
      pinyin: 'Dì èr kè hěn jīngcǎi.',
      english: 'The second lesson is wonderful.',
    },
  },
  {
    id: 'hsk1-13',
    hanzi: '三',
    pinyin: 'sān',
    english: 'Three',
    hskLevel: 1,
    category: 'Numbers',
    example: {
      hanzi: '桌子上有三个杯子。',
      pinyin: 'Zhuōzi shàng yǒu sān gè bēizi.',
      english: 'There are three cups on the table.',
    },
  },
  {
    id: 'hsk1-14',
    hanzi: '今天',
    pinyin: 'jīntiān',
    english: 'Today',
    hskLevel: 1,
    category: 'Time',
    example: {
      hanzi: '今天天气特别好。',
      pinyin: 'Jīntiān tiānqì tèbié hǎo.',
      english: 'The weather today is especially good.',
    },
  },
  {
    id: 'hsk1-15',
    hanzi: '明天',
    pinyin: 'míngtiān',
    english: 'Tomorrow',
    hskLevel: 1,
    category: 'Time',
    example: {
      hanzi: '明天我们要去长城。',
      pinyin: 'Míngtiān wǒmen yào qù Chángchéng.',
      english: 'We are going to the Great Wall tomorrow.',
    },
  },
  {
    id: 'hsk1-16',
    hanzi: '现在',
    pinyin: 'xiànzài',
    english: 'Now / Right now',
    hskLevel: 1,
    category: 'Time',
    example: {
      hanzi: '现在几点了？',
      pinyin: 'Xiànzài jǐ diǎn le?',
      english: 'What time is it now?',
    },
  },
  {
    id: 'hsk1-17',
    hanzi: '学校',
    pinyin: 'xuéxiào',
    english: 'School',
    hskLevel: 1,
    category: 'Daily',
    example: {
      hanzi: '我们的学校在市中心。',
      pinyin: 'Wǒmen de xuéxiào zài shì zhōngxīn.',
      english: 'Our school is in the city center.',
    },
  },
  {
    id: 'hsk1-18',
    hanzi: '书',
    pinyin: 'shū',
    english: 'Book',
    hskLevel: 1,
    category: 'Daily',
    example: {
      hanzi: '我看了一本中文书。',
      pinyin: 'Wǒ kàn le yī běn zhōngwén shū.',
      english: 'I read a Chinese book.',
    },
  },
  {
    id: 'hsk1-19',
    hanzi: '飞机',
    pinyin: 'fēijī',
    english: 'Airplane',
    hskLevel: 1,
    category: 'Travel',
    example: {
      hanzi: '我坐飞机去北京。',
      pinyin: 'Wǒ zuò fēijī qù Běijīng.',
      english: 'I take an airplane to Beijing.',
    },
  },
  {
    id: 'hsk1-20',
    hanzi: '出租车',
    pinyin: 'chūzūchē',
    english: 'Taxi / Cab',
    hskLevel: 1,
    category: 'Travel',
    example: {
      hanzi: '我们叫一辆出租车吧。',
      pinyin: 'Wǒmen jiào yī liàng chūzūchē ba.',
      english: "Let's call a taxi.",
    },
  },

  // ==========================================
  // HSK LEVEL 2 (Elementary Expansion)
  // ==========================================
  {
    id: 'hsk2-1',
    hanzi: '准备',
    pinyin: 'zhǔnbèi',
    english: 'To prepare / Ready',
    hskLevel: 2,
    category: 'Work',
    example: {
      hanzi: '我已经准备好今天的考试了。',
      pinyin: 'Wǒ yǐjīng zhǔnbèi hǎo jīntiān de kǎoshì le.',
      english: 'I have already prepared for today’s exam.',
    },
  },
  {
    id: 'hsk2-2',
    hanzi: '可能',
    pinyin: 'kěnéng',
    english: 'Possible / Maybe',
    hskLevel: 2,
    category: 'Daily',
    example: {
      hanzi: '他今天可能下雨不来了。',
      pinyin: 'Tā jīntiān kěnéng xiàyǔ bù lái le.',
      english: 'He might not come today because of the rain.',
    },
  },
  {
    id: 'hsk2-3',
    hanzi: '公司',
    pinyin: 'gōngsī',
    english: 'Company / Corporation',
    hskLevel: 2,
    category: 'Work',
    example: {
      hanzi: '他在一家科技公司上班。',
      pinyin: 'Tā zài yī jiā kējì gōngsī shàngbān.',
      english: 'He works at a tech company.',
    },
  },
  {
    id: 'hsk2-4',
    hanzi: '机场',
    pinyin: 'jīchǎng',
    english: 'Airport',
    hskLevel: 2,
    category: 'Travel',
    example: {
      hanzi: '从酒店到机场要半个小时。',
      pinyin: 'Cóng jiǔdiàn dào jīchǎng yào bàn gè xiǎoshí.',
      english: 'It takes half an hour from the hotel to the airport.',
    },
  },
  {
    id: 'hsk2-5',
    hanzi: '咖啡',
    pinyin: 'kāfēi',
    english: 'Coffee',
    hskLevel: 2,
    category: 'Food',
    example: {
      hanzi: '早晨喝一杯咖啡能让我清醒。',
      pinyin: 'Zǎochen hē yī bēi kāfēi néng ràng wǒ qīngxǐng.',
      english: 'Drinking a cup of coffee in the morning wakes me up.',
    },
  },
  {
    id: 'hsk2-6',
    hanzi: '便宜',
    pinyin: 'piányi',
    english: 'Cheap / Inexpensive',
    hskLevel: 2,
    category: 'Daily',
    example: {
      hanzi: '一家网上的商店非常便宜。',
      pinyin: 'Yī jiā wǎngshàng de shāngdiàn fēicháng piányi.',
      english: 'An online store is very cheap.',
    },
  },
  {
    id: 'hsk2-7',
    hanzi: '快乐',
    pinyin: 'kuàilè',
    english: 'Happy / Joyful',
    hskLevel: 2,
    category: 'Emotions',
    example: {
      hanzi: '祝你生日快乐！',
      pinyin: 'Zhù nǐ shēngrì kuàilè!',
      english: 'Wish you a happy birthday!',
    },
  },
  {
    id: 'hsk2-8',
    hanzi: '身体',
    pinyin: 'shēntǐ',
    english: 'Body / Health',
    hskLevel: 2,
    category: 'Daily',
    example: {
      hanzi: '经常运动对身体好。',
      pinyin: 'Jīngcháng yùndòng duì shēntǐ hǎo.',
      english: 'Regular exercise is good for your health.',
    },
  },
  {
    id: 'hsk2-9',
    hanzi: '火车站',
    pinyin: 'huǒchēzhàn',
    english: 'Train station',
    hskLevel: 2,
    category: 'Travel',
    example: {
      hanzi: '我们在火车站北口见面。',
      pinyin: 'Wǒmen zài huǒchēzhàn běikǒu jiànmiàn.',
      english: 'We meet at the north entrance of the train station.',
    },
  },
  {
    id: 'hsk2-10',
    hanzi: '希望',
    pinyin: 'xīwàng',
    english: 'To hope / Wish',
    hskLevel: 2,
    category: 'Emotions',
    example: {
      hanzi: '我希望明年能去中国旅行。',
      pinyin: 'Wǒ xīwàng míngnián néng qù Zhōngguó lǚxíng.',
      english: 'I hope I can travel to China next year.',
    },
  },

  // ==========================================
  // HSK LEVEL 3 (Intermediate Core)
  // ==========================================
  {
    id: 'hsk3-1',
    hanzi: '经验',
    pinyin: 'jīngyàn',
    english: 'Experience',
    hskLevel: 3,
    category: 'Work',
    example: {
      hanzi: '在移动应用开发上有丰富经验。',
      pinyin: 'Zài yídòng yìngyòng kāifā shàng yǒu fēngfù jīngyàn.',
      english: 'Has rich experience in mobile app development.',
    },
  },
  {
    id: 'hsk3-2',
    hanzi: '解决',
    pinyin: 'jiějué',
    english: 'To solve / To resolve',
    hskLevel: 3,
    category: 'Work',
    example: {
      hanzi: '这个问题终于解决了。',
      pinyin: 'Zhège wèntí zhōngyú jiějué le.',
      english: 'This problem has finally been solved.',
    },
  },
  {
    id: 'hsk3-3',
    hanzi: '习惯',
    pinyin: 'xíguàn',
    english: 'Habit / To be accustomed to',
    hskLevel: 3,
    category: 'Daily',
    example: {
      hanzi: '我已经习惯早起背单词了。',
      pinyin: 'Wǒ yǐjīng xíguàn zǎoqǐ bèi dāncí le.',
      english: 'I am accustomed to getting up early to memorize vocabulary.',
    },
  },
  {
    id: 'hsk3-4',
    hanzi: '提高',
    pinyin: 'tígāo',
    english: 'To improve / To raise',
    hskLevel: 3,
    category: 'Work',
    example: {
      hanzi: '多练习才能提高听力水平。',
      pinyin: 'Duō liànxí cái néng tígāo tīnglì shuǐpíng.',
      english: 'Only by practicing more can you improve your listening level.',
    },
  },
  {
    id: 'hsk3-5',
    hanzi: '检查',
    pinyin: 'jiǎnchá',
    english: 'To check / To inspect',
    hskLevel: 3,
    category: 'Work',
    example: {
      hanzi: '写完作业后必须认真检查。',
      pinyin: 'Xiě wán zuòyè hòu bìxū rènzhēn jiǎnchá.',
      english: 'You must check carefully after completing your homework.',
    },
  },
  {
    id: 'hsk3-6',
    hanzi: '环境',
    pinyin: 'huánjìng',
    english: 'Environment / Surroundings',
    hskLevel: 3,
    category: 'Daily',
    example: {
      hanzi: '安静的学习环境对专注很重要。',
      pinyin: 'Ānjìng de xuéxí huánjìng duì zhuānzhù hěn zhòngyào.',
      english: 'A quiet study environment is important for focus.',
    },
  },
  {
    id: 'hsk3-7',
    hanzi: '简单',
    pinyin: 'jiǎndān',
    english: 'Simple / Uncomplicated',
    hskLevel: 3,
    category: 'Daily',
    example: {
      hanzi: '这是一个简单而高效的方法。',
      pinyin: 'Zhè shì yī gè jiǎndān ér gāoxiào de fāngfǎ.',
      english: 'This is a simple yet effective method.',
    },
  },
  {
    id: 'hsk3-8',
    hanzi: '热情',
    pinyin: 'rèqíng',
    english: 'Enthusiastic / Passionate',
    hskLevel: 3,
    category: 'Emotions',
    example: {
      hanzi: '中国的朋友待人非常热情。',
      pinyin: 'Zhōngguó de péngyou dàirén fēicháng rèqíng.',
      english: 'Chinese friends are very enthusiastic when treating people.',
    },
  },
  {
    id: 'hsk3-9',
    hanzi: '重要',
    pinyin: 'zhòngyào',
    english: 'Important / Significant',
    hskLevel: 3,
    category: 'Daily',
    example: {
      hanzi: '声调是中文发音最重要的部分。',
      pinyin: 'Shēngdiào shì zhōngwén fāyīn zuì zhòngyào de bùfen.',
      english: 'Tones are the most important part of Chinese pronunciation.',
    },
  },
  {
    id: 'hsk3-10',
    hanzi: '机会',
    pinyin: 'jīhuì',
    english: 'Opportunity / Chance',
    hskLevel: 3,
    category: 'Work',
    example: {
      hanzi: '别放弃任何学习新知识的机会。',
      pinyin: 'Bié fàngqì rènhé xuéxí xīn zhīshí de jīhuì.',
      english: "Don't give up any opportunity to learn new knowledge.",
    },
  },
];

export function getWordsByLevel(level: 1 | 2 | 3 | 'ALL'): VocabularyWord[] {
  if (level === 'ALL') return HSK_VOCABULARY;
  return HSK_VOCABULARY.filter(word => word.hskLevel === level);
}

export function getWordsByCategory(category: string): VocabularyWord[] {
  return HSK_VOCABULARY.filter(word => word.category === category);
}

export function getAllCategories(): string[] {
  const cats = new Set(HSK_VOCABULARY.map(w => w.category));
  return Array.from(cats);
}
