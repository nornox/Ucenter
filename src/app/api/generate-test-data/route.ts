import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const articleData = [
  {
    topic: '日常生活',
    title: '10个小习惯，让你的生活更有序',
    content:
      '在繁忙的现代生活中，保持生活有序往往是一个挑战。本文介绍了10个简单却有效的小习惯，包括每天整理床铺、使用待办事项清单、实行两分钟规则等。这些习惯看似微不足道，但长期坚持可以显著提高生活质量和工作效率。通过培养这些习惯，你将发现生活变得更加有条理，压力也随之减少。',
  },
  {
    topic: '日常生活',
    title: '如何在繁忙中找到属于自己的时间',
    content:
      '在当今快节奏的社会中，很多人感觉时间永远不够用。本文探讨了如何在繁忙的日程中创造和保护属于自己的时间。建议包括设定明确的界限、学会说不、利用碎片时间等。文章还强调了自我时间对于心理健康和个人发展的重要性，鼓励读者重新审视自己的时间分配，找到工作、生活和个人发展之间的平衡。',
  },
  {
    topic: '日常生活',
    title: '断舍离：简化生活的艺术',
    content:
      '断舍离源于日本，是一种通过整理物品来简化生活的方法。本文详细介绍了断舍离的核心理念和实践步骤。从衣物到书籍，从厨房用具到数码产品，文章提供了具体的建议，帮助读者识别真正需要的物品，勇于舍弃多余的东西。通过实践断舍离，不仅可以让居住空间更加整洁，还能带来心灵的轻松和自由。',
  },
  {
    topic: '日常生活',
    title: '工作与生活平衡：5个实用技巧',
    content:
      '在追求事业成功的同时保持生活质量，是现代人面临的一大挑战。本文提供了5个实用技巧来帮助读者实现工作与生活的平衡。这些技巧包括设定明确的工作时间界限、学会委派任务、培养工作之外的兴趣爱好等。文章强调，真正的成功不仅仅是职业上的成就，更包括个人生活的幸福和满足。',
  },
  {
    topic: '美食探索',
    title: '本地美食地图：隐藏在街角的美味',
    content:
      '每个城市都有其独特的美食文化，而最地道的美味往往隐藏在不起眼的街角。本文带领读者探索城市中鲜为人知的美食宝藏，从老字号的传统小吃到新兴的创意料理。文章不仅介绍了这些美食的特色和历史，还提供了寻找隐藏美食的技巧，鼓励读者走出舒适区，体验真正的本地风味。',
  },
  {
    topic: '美食探索',
    title: '5种简单食材，100种美味变化',
    content:
      '厨艺并非天赋，而是来自于对食材的了解和创意的运用。本文选取了5种常见的食材：鸡蛋、土豆、西红柿、面粉和牛奶，详细介绍了如何将它们变化出100种不同的美味。从简单的早餐到精致的晚餐，从西式料理到东方美食，这些变化不仅能满足不同的口味需求，还能激发读者的烹饪灵感，让日常饮食变得更加丰富多彩。',
  },
  {
    topic: '美食探索',
    title: '世界各地街头小吃大盘点',
    content:
      '街头小吃是了解一个地方文化最直接的方式之一。本文带领读者环游世界，品尝各地独特的街头美食。从墨西哥的玉米卷饼到日本的章鱼小丸子，从印度的咖喱饼到意大利的披萨，每一种小吃都承载着当地的历史和文化。文章不仅介绍了这些美食的口味和制作方法，还分享了品尝街头小吃的注意事项，让读者在美食之旅中既能大饱口福，又能确保安全。',
  },
  {
    topic: '旅行计划',
    title: '背包客生存指南：如何用最少的钱环游世界',
    content:
      '环游世界是很多人的梦想，但高昂的费用常常让人望而却步。本文为预算有限的旅行者提供了实用的建议，包括如何寻找便宜的机票、选择经济型住宿、利用当地公共交通等。文章还分享了一些省钱的小技巧，如参加免费的步行团、在当地市场购买食材自己烹饪等。通过这些方法，即使预算有限，也能体验丰富的世界文化，创造难忘的旅行回忆。',
  },
  {
    topic: '旅行计划',
    title: '48小时城市速览：巴黎篇',
    content:
      '巴黎，这座浪漫之都，有太多值得探索的地方。但如果时间有限，该如何在48小时内领略巴黎的精华？本文为时间紧张的旅行者提供了一份详细的行程规划。第一天的行程包括参观埃菲尔铁塔、卢浮宫和圣母院，晚上漫步塞纳河畔；第二天则安排了凯旋门、香榭丽舍大街和蒙马特高地。文章不仅提供了参观建议，还推荐了一些地道的法式餐厅和咖啡馆，让你在短短两天内深入体验巴黎的魅力。',
  },
  {
    topic: '旅行计划',
    title: '自驾游攻略：美国1号公路完全指南',
    content:
      '美国1号公路是世界上最美丽的海岸线公路之一，从旧金山到洛杉矶，沿途风景令人叹为观止。本文为计划自驾1号公路的旅行者提供了详细的攻略。内容包括最佳旅行时间、租车建议、必看景点推荐等。从金门大桥到大苏尔，从赫氏古堡到圣塔芭芭拉，文章为每一段行程都提供了详细的描述和实用建议，帮助读者规划一次难忘的公路旅行。',
  },
  {
    topic: '健身日记',
    title: '30天腹肌养成计划',
    content:
      '拥有一副结实的腹肌不仅能提升外表魅力，还能改善核心力量，对整体健康大有裨益。本文提供了一个为期30天的腹肌训练计划。从基础的仰卧起坐到高级的悬挂举腿，计划循序渐进，适合各个级别的健身爱好者。文章还包括了饮食建议和生活方式调整，因为真正的腹肌不仅仅是训练的结果，更需要全面的健康管理。跟随这个计划，你将在30天内看到明显的变化。',
  },
  {
    topic: '健身日记',
    title: '零器械居家健身：全身运动指南',
    content:
      '没有健身器械并不意味着无法进行有效的锻炼。本文介绍了一系列无需任何器械就能完成的全身运动。从俯卧撑到深蹲，从弓步到平板支撑，这些动作覆盖了全身各个主要肌群。文章详细讲解了每个动作的正确姿势和常见错误，并提供了针对不同健身水平的变式。此外，文章还设计了几套完整的训练方案，让读者可以直接上手，在家中也能享受到高质量的全身锻炼。',
  },
  {
    topic: '编程技巧',
    title: '代码重构：提高可读性的10个技巧',
    content:
      '代码重构是提高软件质量的重要手段，而提高代码可读性是重构的核心目标之一。本文介绍了10个实用的代码重构技巧，帮助程序员编写出更易读、更易维护的代码。这些技巧包括使用有意义的变量名、提取复杂逻辑到独立函数、减少嵌套层级等。文章还讨论了何时进行重构，以及如何在不破坏现有功能的前提下安全地进行重构。通过实践这些技巧，程序员可以显著提高代码质量，减少未来维护的困难。',
  },
  {
    topic: '编程技巧',
    title: '设计模式入门：解决常见编程问题',
    content:
      '设计模式是软件开发中解决常见问题的最佳实践方案。本文为初学者介绍了几个最常用的设计模式，包括单例模式、工厂模式、观察者模式等。每个模式都配有实际的代码示例和使用场景说明，帮助读者理解这些模式的核心思想和应用方法。文章还讨论了设计模式的优缺点，以及如何在实际项目中恰当地使用它们。通过学习这些设计模式，程序员可以提高代码的灵活性和可维护性，更好地应对复杂的软件开发挑战。',
  },
  {
    topic: '前端开发',
    title: '响应式设计：适配各种屏幕尺寸的秘诀',
    content:
      '在移动设备普及的今天，响应式设计已经成为前端开发的必备技能。本文深入探讨了响应式设计的核心原则和实现技巧。从流式布局到弹性图片，从媒体查询到移动优先策略，文章全面介绍了响应式设计的各个方面。特别强调了如何处理复杂的布局和导航在不同设备上的展现。文章还包括了一些常见的响应式设计模式和最佳实践，以及如何使用现代CSS特性（如Flexbox和Grid）来简化响应式布局的实现。通过本文，前端开发者可以掌握创建适应各种屏幕尺寸的网站的技巧。',
  },
  {
    topic: '前端开发',
    title: 'Vue.js vs React：如何选择前端框架',
    content:
      '在众多前端框架中，Vue.js和React无疑是最受欢迎的两个。本文深入比较了这两个框架的异同，帮助开发者做出最适合自己项目的选择。文章从学习曲线、性能、生态系统、社区支持等多个角度进行了详细的对比。同时，还通过实际的代码示例展示了两个框架在处理常见前端任务时的不同方法。文章不仅指出了每个框架的优势，也坦诚地讨论了它们的局限性。最后，文章给出了在不同场景下如何选择框架的建议，强调没有绝对的好坏之分，关键是要根据项目需求和团队情况做出明智的选择。',
  },
  {
    topic: '后端架构',
    title: '微服务架构：优势与挑战',
    content:
      '微服务架构已经成为现代后端开发的热门话题。本文深入探讨了微服务架构的核心概念、优势以及实施过程中可能遇到的挑战。文章首先介绍了从单体应用到微服务的演进过程，然后详细分析了微服务带来的好处，如更好的可扩展性、团队自主性和技术栈灵活性。同时，文章也坦诚地讨论了微服务架构的复杂性，包括服务间通信、数据一致性、部署和监控等方面的挑战。文章还提供了一些实用的建议和最佳实践，帮助读者在实际项目中更好地应用微服务架构。通过本文，后端开发者可以全面了解微服务架构，为是否采用这种架构做出明智的决策。',
  },
  {
    topic: '后端架构',
    title: 'Docker容器化：简化部署流程',
    content:
      'Docker容器化技术正在革新软件的开发、测试和部署流程。本文详细介绍了Docker的核心概念和使用方法，帮助后端开发者掌握这一强大工具。文章从Docker的基本概念如镜像和容器开始，逐步深入到Dockerfile的编写、容器的管理和编排。特别强调了Docker如何解决在我机器上能运行的经典问题，以及如何使用Docker Compose管理多容器应用。文章还探讨了Docker在持续集成和持续部署（CI/CD）中的应用，以及如何使用Docker改善开发团队的协作。通过实际的案例和最佳实践，读者可以学会如何使用Docker来简化部署流程，提高开发效率。',
  },
  {
    topic: '数据库优化',
    title: 'MySQL性能调优：20个实用技巧',
    content:
      '数据库性能直接影响着应用的响应速度和用户体验。本文汇总了20个MySQL性能调优的实用技巧，涵盖了从查询优化到服务器配置的各个方面。文章首先介绍了如何使用EXPLAIN分析查询计划，然后深入讨论了索引优化、查询重写、表结构优化等技术。特别强调了一些常见的性能陷阱，如避免使用SELECT *、合理使用JOIN、优化子查询等。此外，文章还涉及了服务器层面的优化，包括配置InnoDB缓冲池、优化文件系统等。每个技巧都配有详细的解释和实际的代码示例，让读者能够立即应用到实践中。通过应用这些技巧，数据库管理员和开发者可以显著提升MySQL数据库的性能。',
  },
  {
    topic: '数据库优化',
    title: 'NoSQL数据库：何时使用及如何选择',
    content:
      '随着大数据时代的到来，NoSQL数据库越来越受欢迎。本文深入探讨了NoSQL数据库的类型、特点以及适用场景。文章首先介绍了NoSQL的四大类型：键值存储、文档数据库、列族存储和图数据库，并详细分析了每种类型的优势和局限性。然后，文章讨论了何时应该考虑使用NoSQL数据库，如处理大规模数据、需要高度的可扩展性或处理非结构化数据时。特别强调了NoSQL和关系型数据库的对比，帮助读者理解在什么情况下NoSQL是更好的选择。文章还提供了选择NoSQL数据库的指南，包括考虑数据模型、一致性需求、查询模式等因素。通过本文，读者可以全面了解NoSQL数据库，为项目选择合适的数据库解决方案。',
  },
  {
    topic: '英语学习',
    title: '英语口语突破：21天挑战计划',
    content:
      '提高英语口语能力是许多语言学习者的目标，但往往不知从何开始。本文提供了一个为期21天的英语口语突破计划，帮助学习者系统地提升口语水平。计划每天聚焦一个主题，如自我介绍、日常对话、工作交流等，并提供相应的词汇、句型和练习方法。文章强调了持续练习的重要性，建议学习者每天至少进行30分钟的口语练习，可以是自言自语、与朋友对话或参加语言交换。此外，文章还介绍了一些实用的口语练习工具和资源，如语言交换应用、播客等。通过坚持这个21天计划，学习者可以显著提高英语口语的流利度和自信心。',
  },
  {
    topic: '英语学习',
    title: '英语发音技巧：告别中式英语',
    content:
      '准确的发音是有效沟通的基础，但对许多中国英语学习者来说，摆脱中式英语口音是一个巨大的挑战。本文深入探讨了中国学习者常见的发音问题，并提供了针对性的改进技巧。文章首先分析了中英文发音系统的差异，然后重点讲解了一些容易混淆的音素，如/θ/和/ð/、/l/和/r/等。特别强调了英语的重音和语调，这往往是中国学习者最容易忽视的部分。文章还提供了一系列实用的练习方法，如舌头操、绕口令、模仿native speaker等。此外，文章推荐了一些有助于提高发音的工具和资源，如发音词典app、语音分析软件等。通过系统地练习这些技巧，学习者可以逐步改善发音，说出更地道的英语。',
  },
  {
    topic: '日语进阶',
    title: '日语敬语的正确使用：职场必备指南',
    content:
      '在日本职场中，正确使用敬语是必不可少的技能。本文深入浅出地介绍了日语敬语的基本概念和使用方法，特别针对职场场景。文章首先解释了尊敬语、谦逊语和礼貌语的区别，然后通过具体的例句展示了如何在不同情况下选择合适的敬语形式。特别强调了一些容易混淆的敬语表达，如「いらっしゃる」和「まいる」的区别。文章还讨论了敬语使用的社会文化背景，帮助读者理解为什么日本人如此重视敬语。此外，文章提供了一些实用的练习方法，如角色扮演等，帮助学习者在实际场景中正确使用敬语。通过本文，日语学习者可以掌握敬语的精髓，在日本职场中更好地沟通和交流。',
  },
  {
    topic: '日语进阶',
    title: '日语听力训练：从动漫到新闻',
    content:
      '提高日语听力是语言学习中的一个重要环节，而从娱乐内容到正式新闻的跨度则代表了听力能力的不同层次。本文提供了一个系统的日语听力训练方法，帮助学习者从理解简单的动漫对话进阶到复杂的新闻报道。文章首先建议从喜欢的动漫开始，利用简单有趣的内容培养兴趣和基础听力。然后逐步过渡到日常对话视频、综艺节目、纪录片，最后到新闻报道。对于每个阶段，文章都提供了具体的学习策略，如如何利用字幕、如何做笔记、如何进行阴影跟读等。特别强调了听力材料多样化的重要性，建议学习者接触不同口音和说话速度的材料。文章还推荐了一些优质的听力资源和工具，如NHK的语言学习节目、日语播客等。通过遵循这个训练方法，学习者可以全面提升日语听力能力，最终达到理解快速新闻报道的水平。',
  },
  {
    topic: '德语入门',
    title: '德语发音规则：21天掌握技巧',
    content:
      '德语的发音对很多初学者来说是一个挑战，但通过系统的学习和练习，是可以在较短时间内取得显著进步的。本文提供了一个为期21天的德语发音学习计划，帮助学习者快速掌握德语发音的基本规则和技巧。计划每天聚焦一个或几个相关的发音点，从元音、辅音到特殊的发音规则如元音变音、辅音连缀等。文章特别强调了一些对中国学习者来说较难的发音，如卷舌音/r/、喉音/ch/等，并提供了针对性的练习方法。此外，文章还介绍了德语的重音规则和语调特点，这对于说出地道的德语至关重要。每天的学习内容都配有大量的例词和短句，方便学习者进行反复练习。文章还推荐了一些有用的发音学习工具和资源，如发音视频、语音分析app等。通过坚持这个21天的学习计划，初学者可以建立起正确的德语发音基础，为今后的学习打下良好的基础。',
  },
  {
    topic: '德语入门',
    title: '德语语法基础：从A1到A2的学习路径',
    content:
      '德语语法以其严谨和复杂而闻名，但通过系统的学习，从A1到A2级别的基础语法是完全可以掌握的。本文详细介绍了从德语零基础到A2水平的语法学习路径，为初学者提供了清晰的学习指南。文章首先解释了德语的基本句子结构，然后逐步深入到更复杂的语法点，如动词变位、冠词变化、介词用法等。特别强调了一些对初学者具有挑战性的概念，如动词位置规则、形容词变化等。文章采用循序渐进的方式，每个语法点都配有简单明了的解释和大量的例句。此外，文章还提供了一些实用的记忆技巧和练习方法，帮助学习者更好地理解和记忆这些语法规则。文章最后给出了一个建议的学习时间表，指导学习者如何在合理的时间内完成从A1到A2的语法学习。通过遵循这个学习路径，德语初学者可以系统地掌握基础语法，为进一步提高德语水平打下坚实的基础。',
  },
  {
    topic: '西班牙语词汇',
    title: '西班牙语1000核心词汇：分类记忆法',
    content:
      '掌握一门语言的核心词汇是快速提高语言能力的关键。本文介绍了一种高效的方法来学习和记忆西班牙语的1000个核心词汇。文章首先解释了为什么这1000个词如此重要——它们覆盖了日常交流中约75%的用词。然后，文章详细介绍了如何通过分类来更有效地学习这些词汇。分类包括日常生活、工作、学习、旅行、情感表达等主题。对于每个类别，文章不仅列出了相关词汇，还提供了这些词在句子中的使用示例，帮助学习者理解词语的实际用法。特别强调了一些容易混淆的词语，如ser和estar的区别。文章还介绍了一些记忆技巧，如联想法、词根词缀分析法等，帮助学习者更快地记住这些词汇。此外，文章推荐了一些有助于词汇学习的工具和资源，如西班牙语学习app、在线词典等。通过系统地学习这1000个核心词汇，西班牙语学习者可以快速提升自己的词汇量，为进一步的语言学习打下坚实的基础。',
  },
  {
    topic: '西班牙语词汇',
    title: '西语词根记忆法：词汇量倍增技巧',
    content:
      '对于想要快速扩大西班牙语词汇量的学习者来说，掌握词根记忆法是一个非常有效的策略。本文深入探讨了如何利用西班牙语的词根来记忆和理解大量相关词汇。文章首先解释了什么是词根，以及为什么了解词根可以大大提高词汇学习的效率。然后，文章列举了一些最常见和最有用的西班牙语词根，如duc/duct（引导）、scrib/script（写）等，并详细解释了这些词根的含义和用法。对于每个词根，文章都提供了多个派生词的例子，帮助读者理解词根如何在不同单词中发挥作用。特别强调了一些在西班牙语和英语中相似的词根，这对于已经掌握英语的学习者特别有帮助。文章还介绍了如何通过词根来推测陌生词的意思，这是应对阅读材料中未知词汇的有力工具。此外，文章提供了一些实用的练习方法，如创建词根词典、进行词根联想游戏等，帮助学习者更好地掌握和运用这种记忆方法。通过系统地学习和应用词根记忆法，西班牙语学习者可以在短时间内显著增加自己的词汇量，提高语言学习的效率。',
  },
]

const itemTypes = ['text', 'url', 'pic', 'mixed']

const websites = [
  { name: '知乎', url: 'https://www.zhihu.com' },
  { name: '掘金', url: 'https://juejin.cn' },
  { name: '微博', url: 'https://weibo.com' },
  { name: '豆瓣', url: 'https://www.douban.com' },
  { name: 'CSDN', url: 'https://www.csdn.net' },
  { name: '简书', url: 'https://www.jianshu.com' },
  { name: '哔哩哔哩', url: 'https://www.bilibili.com' },
  { name: '小红书', url: 'https://www.xiaohongshu.com' },
  { name: '淘宝', url: 'https://www.taobao.com' },
  { name: '京东', url: 'https://www.jd.com' },
  { name: '天猫', url: 'https://www.tmall.com' },
  { name: '抖音', url: 'https://www.douyin.com' },
  { name: '微信读书', url: 'https://weread.qq.com' },
  { name: '网易云音乐', url: 'https://music.163.com' },
  { name: 'QQ音乐', url: 'https://y.qq.com' },
  { name: '虎扑', url: 'https://www.hupu.com' },
  { name: '知乎专栏', url: 'https://zhuanlan.zhihu.com' },
  { name: '36氪', url: 'https://36kr.com' },
  { name: '什么值得买', url: 'https://www.smzdm.com' },
  { name: '豆瓣电影', url: 'https://movie.douban.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
  { name: 'InfoQ', url: 'https://www.infoq.cn' },
  { name: 'segmentfault', url: 'https://segmentfault.com' },
  { name: 'V2EX', url: 'https://www.v2ex.com' },
]

function getRandomArticle() {
  return articleData[Math.floor(Math.random() * articleData.length)]
}

export async function GET() {
  try {
    // 生成2个测试用户
    const users = await Promise.all(
      [1, 2].map(async (i) => {
        const hashedPassword = await bcrypt.hash('testpassword', 10)
        return prisma.user.create({
          data: {
            username: `testuser${Math.floor(Math.random() * 1000)}`,
            name: `测试用户${i}`,
            email: `test${Math.floor(Math.random() * 1000)}@example.com}`,
            password: hashedPassword,
          },
        })
      }),
    )

    // 从数据库中读取2条用户信息
    // const users = await prisma.user.findMany({
    //   take: 2,
    //   orderBy: {
    //     id: 'asc'
    //   }
    // });

    // 生成100个收藏项
    const favItems = []
    const collections = new Map<number, Map<string, number>>()

    // 首先创建24个collection
    for (let i = 0; i < 24; i++) {
      const userId = users[Math.floor(i / 12)].id
      const article = articleData[i % articleData.length]
      const collectionTitle = article.topic

      const collection = await prisma.favItem.create({
        data: {
          userId,
          type: 'collection',
          title: collectionTitle,
          content: '',
          url: '',
          source: '',
          isDeleted: false,
          isPublic: false,
          shareToken: null,
          sharePassword: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      favItems.push(collection)

      if (!collections.has(userId)) {
        collections.set(userId, new Map())
      }
      collections.get(userId)!.set(collectionTitle, collection.id)
    }

    // 然后创建76个其他类型的收藏项
    for (let i = 0; i < 76; i++) {
      const userId = users[Math.floor(Math.random() * 2)].id
      const type = itemTypes[Math.floor(Math.random() * itemTypes.length)]
      const article = getRandomArticle()
      const title = article.title
      const content = article.content
      const topic = article.topic

      const website = websites[Math.floor(Math.random() * websites.length)]

      const parentId = collections.get(userId)?.get(topic) ?? null

      const favItem = await prisma.favItem.create({
        data: {
          userId,
          type,
          title,
          content,
          url: `${website.url}/${Math.random().toString(36).substring(7)}`,
          source: website.name,
          isDeleted: false,
          isPublic: false,
          shareToken: null,
          sharePassword: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          parentId,
        },
      })
      favItems.push(favItem)

      // //为每个收藏项创建标签并建立关联
      // let tag = await prisma.favTag.findUnique({
      //   where: { name: topic },
      // })
      // if (!tag) {
      //   tag = await prisma.favTag.create({
      //     data: { name: topic },
      //   })
      // }
      // await prisma.favItemTag.create({
      //   data: {
      //     itemId: favItem.id,
      //     tagId: tag.id,
      //   },
      // })
    }
    return NextResponse.json(
      {
        message: '测试数据生成成功',
        users,
        favItemsCount: favItems.length,
      },
      { status: 201 },
    )
  } catch (error: unknown) {
    console.error('生成测试数据时出错:', error)
    return NextResponse.json({ error: '生成测试数据失败' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
