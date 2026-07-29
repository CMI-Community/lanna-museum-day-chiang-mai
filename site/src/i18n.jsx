import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const languageOptions = [
  { code: "zh", short: "中", label: "中文", nativeLabel: "中文" },
  { code: "th", short: "ไทย", label: "ภาษาไทย", nativeLabel: "ไทย" },
  { code: "en", short: "EN", label: "English", nativeLabel: "English" },
];

const messages = {
  zh: {
    close: "关闭",
    optional: "可选",
    navLabel: "主要导航",
    openNav: "打开导航",
    closeNav: "关闭导航",
    language: "语言",
    languageMenu: "选择显示语言",
    languageChanged: "显示语言已切换为中文",
    nav: {
      works: "作品",
      about: "活动",
      journey: "日程",
      museums: "博物馆",
      collect: "采集",
      archive: "纹样档案",
      ideas: "灵感",
      recap: "活动回顾",
    },
    signup: {
      action: "报名入群",
      dialogLabel: "报名加入活动群",
      kicker: "REGISTER / 报名入群",
      title: "扫码加入清迈场活动群",
      description:
        "入群后获取 CMI Studio 详细位置、博物馆结伴信息、纹样采集口令与活动提醒。",
      confirmTitle: "加入前，请先确认",
      confirmText: "请确保自己有兴趣，且有时间来参加该活动。",
      qrAlt:
        "博物馆奇妙日·清迈 CMI·兰纳纹样微信群二维码，有效至 7 月 30 日",
      qrUnavailable: "群二维码更新中",
      qrUnavailableHelp:
        "请稍后刷新，或联系 CMI Community 获取最新二维码。",
      qrNotice:
        "当前二维码图片标注 7 月 30 日前有效；过期后将在此处直接更新。",
    },
    hero: {
      series: "AI 切磋大会 第 26 期",
      event: "博物馆奇妙日 · 清迈场",
      headlineBefore: "共同探寻兰纳",
      headlineAfter: "纹案的踪迹",
      subtitle: "用 AI 创作",
      initiator: "发起",
      venue: "CMI Community 主办 清迈线下场",
      timeLabel: "时间",
      time: "2026.07.26 · 12:30–17:30",
      placeLabel: "地点",
      locationLabel: "位置",
      location: "报名入群后获取详细信息",
      collect: "开始采集纹样",
      worksCue: "看看现场留下的作品",
      recapKicker: "FIELD NOTES / 活动回顾",
      recapTitle: "带着一枚纹样，重新认识我们生活的清迈",
      recapEdition: "清迈 · 2026.07",
      recapChapter: "从看见，到共同创造",
      recapPageTitle: "一枚纹样，如何长成一座共同的博物馆？",
      recapSummary:
        "从博物馆采集、现场围坐共创，到一座持续生长的线上兰纳纹样档案。这是这次活动留下的完整故事。",
      recapTopics: "博物馆采集 · AI 共创 · 纹样档案",
      recapCta: "翻开完整回顾",
      recapAria: "打开《带着一枚纹样，重新认识我们生活的清迈》完整活动回顾",
    },
    works: {
      kicker: "AFTER / 作品上墙",
      titleLine1: "这一天留下的，",
      titleLine2: "不只是纹样。",
      intro:
        "从博物馆里的真实观察出发，参与者把纹样继续做成网站、影像与新的体验。两篇来自同一小组的影像被并置呈现，也保留活动现场回顾作为独立记录。",
      previous: "查看上一件作品",
      next: "查看下一件作品",
      railLabel: "作品横向展示",
      footer: "左右滑动查看全部作品，更多作品确认署名后继续上墙。",
      creator: "创作者",
      open: "打开作品：{title}",
      play: "播放作品：{title}",
      coverAlt: "{title}封面",
      videoUnsupported: "你的浏览器暂不支持视频播放。",
      interactiveWebsite: "互动网站",
      videoWork: "影像作品",
      eventRecap: "现场回顾",
      gardenTitle: "织柱成林",
      gardenDescription:
        "以兰纳纹样为种子，把二维图案织进一座可漫游的数字柱林。观众可以转动、倾移、近看每根纹样柱，也能从档案中的真实纹样出发，重新组合色彩与结构，织出属于自己的柱子；每一次创作既保留来源，也为传统纹样打开新的观看与参与方式。",
      gardenCreator: "林可",
      microTitle1: "微观见宏观 · 影像篇章 01",
      microTitle2: "微观见宏观 · 影像篇章 02",
      microDescription1:
        "从博物馆展柜里某一条不起眼的漆金线条、螺旋褶皱，抑或木雕上的同心花盘一路追索，最终看见白象步入深山、跨越数百年时光的双龙寺传说，以及背后整个兰纳王国的文明图景——这正是",
      microEmphasis: "“微观见宏观”",
      microDescription2: "的魅力所在。",
      microDescription3:
        "纹路是时间的化石，也是文明的呼吸。看见了纹路，就看见了在辽阔历史舞台上，那些生生不息的人与魂。",
      recapTitle: "切磋大会回顾 · 90 秒",
      recapDescription:
        "从博物馆纹样采集到现场围坐共创，用 90 秒重新走过这一天：看见纹样如何被发现、拆解，又如何在人与 AI 的协作中生长为新的作品。",
      creatorPending: "创作者待补充",
    },
    manifesto: {
      kicker: "ABOUT / 这是一场什么活动",
      title1: "这不是一场坐着听完的讲座。",
      title2: "它从一枚让你停下来的",
      pattern: "兰纳纹样",
      title3: "开始。",
      intro:
        "AI 切磋大会由 WaytoAGI 发起，清迈场由 CMI Community 组织。活动前，你会走进两座博物馆中的一座，记录纹样的局部、完整文物与来源；7 月 26 日，再把它带回 CMI Studio，与伙伴一起用 AI 创作。",
      creative1: "从观察出发，把真实的文化细节做成",
      creative2: "网页、影像、智能体、游戏、3D 或亲子作品。",
      outcomeTitle: "最后留下的，不只是一个好看的图案。",
      outcome:
        "你会带走一张有编号、有来源、可下载的纹样卡；完成一件可以展示、分享并继续完善的 AI 作品；也让这次发现进入一座持续生长的清迈兰纳纹样档案。",
      credits:
        "WaytoAGI 发起 · CMI Community 组织清迈场 · 现场 CMI Studio",
      next: "接下来，看看这条参与路径如何展开",
    },
    journey: {
      kicker: "JOURNEY / 一次完整的参与路径",
      title: "从报名，到作品上墙",
      intro:
        "活动前先去看、去拍、去问；活动当天再把真实观察变成一件 AI 作品。所有时间均为清迈时间 GMT+7。",
      choose: "先选择你的博物馆",
    },
    museums: {
      kicker: "CHOOSE / 先选择你的博物馆",
      title: "两个入口，两种观察兰纳的方式",
      intro: "滑动或悬停查看两座馆；出发前可打开官网与地图确认信息。",
      sceneAlt: "{name}馆内场景",
      website: "查看官网",
      map: "打开地图",
      source: "图片来源：{source}",
    },
    collect: {
      step1Title: "选择来源",
      step1Description:
        "先告诉我们这枚纹样来自哪里。即使不知道作品全名，也可以填写“待确认”后继续。",
      step2Title: "采集图像",
      step2Description:
        "先拍吸引你的局部，再退后一步保留完整载体。每一类图片都可以从相册上传或直接拍摄。",
      step3Title: "观察与标注",
      step3Description:
        "写下你真实看到的、已经确认的，以及仍想追问的。最后用标签帮助大家重新找到它。",
      upload: "上传图片",
      capture: "拍摄采集",
      minimum: "至少 {count} 张",
      format: "JPEG、PNG 或 WebP · 自动压缩后单张不超过 1.5MB",
      remove: "移除 {name}",
      wizardLabel: "采集新纹样",
      kicker: "NEW PATTERN / 采集新纹样",
      title: "把这次发现，做成一张有来源的纹样卡",
      localPreview: "本地预览",
      museum: "来源博物馆",
      collectorName: "采集者展示名",
      collectorPlaceholder: "例如：小明 / 匿名",
      sourceTitle: "作品或展品名称",
      sourceTitlePlaceholder: "如果不知道，可以写“待确认”",
      location: "展区或拍摄位置",
      locationPlaceholder: "例如：二层织物展区",
      detailImage: "纹样局部图",
      detailHelp: "靠近一处真正吸引你的细节，可添加多张。",
      contextImage: "完整载体图",
      contextHelp: "退后一步，拍下完整文物、艺术作品或场景。",
      labelImage: "展签或来源图",
      labelHelp: "如果现场有展签、展区名称或其他来源线索，也请留下。",
      observation: "现场观察",
      observationPlaceholder: "你为什么停下来？它如何重复、延伸或连接？",
      verified: "来源信息",
      verifiedPlaceholder: "只写展签或可靠资料中已经确认的内容",
      unknown: "仍待了解",
      unknownPlaceholder: "你最想继续了解的问题是什么？",
      accessCode: "活动采集口令",
      accessCodePlaceholder: "请输入活动群中的口令",
      accessCodeHelp: "口令不区分大小写；正式提交由服务端验证。",
      previous: "上一步",
      progress: "共 3 页，已完成 {count} 页",
      next: "下一步",
      submitting: "正在提交",
      submit: "提交并生成编号卡",
      preview: "生成本地预览卡",
      imageRequired: "请至少添加 1 张纹样局部图和 1 张完整载体图。",
      observationRequired: "请写下你为什么注意到这枚纹样。",
      codeRequired: "请输入活动群中的采集口令。",
      uploading: "正在压缩图片并安全上传…",
      submitFailed: "提交失败，请保留页面并重试。",
      sectionKicker: "COLLECT / 收集兰纳纹样",
      sectionTitle: "现在，收集一枚属于你的兰纳纹样",
      sectionIntro:
        "看到让你停下来的细节，就把局部、完整作品与来源一起留下。点击入口后，用三步完成采集并生成一张可下载的编号卡。",
      cardTitle: "从一处细节出发，保留它完整的来处。",
      cardMeta: "三步采集 · 自动编号 · 生成下载卡片",
      newPattern: "采集新纹样",
      recentTitle: "已经收集进来的纹样",
      viewAll: "查看全部 {count} 枚",
      viewPattern: "查看 {number} {title}",
      empty: "档案正在等待第一枚真实纹样。",
    },
    taxonomy: {
      lannaMuseum: "兰纳民俗博物馆",
      famMuseum: "FAM Fahlanna Art Museum",
      otherSource: "其他清迈来源",
      carrier: "载体",
      position: "位置",
      structure: "结构",
      material: "材料",
      textile: "织物",
      object: "器物",
      architecture: "建筑",
      sculpture: "雕塑",
      mural: "壁画",
      weave: "编织结构",
      installation: "装置",
      center: "中心",
      edge: "边缘",
      bottom: "底部",
      surface: "表面",
      body: "身体",
      entrance: "入口",
      repeat: "重复",
      symmetry: "对称",
      interlace: "交织",
      surround: "环绕",
      radiate: "放射",
      extend: "延伸",
      layer: "层叠",
      wood: "木",
      ceramic: "陶",
      lacquer: "漆",
      metal: "金属",
      stone: "石材",
      bamboo: "竹",
      pigment: "颜料",
      choose: "选择{label}",
    },
    archive: {
      anonymous: "匿名采集者",
      collectedBy: "采集者 / COLLECTED BY",
      capturedAt: "采集于 {date}",
      footer1: "现场观察 · 来源信息 · 仍待了解 · 创意再表达",
      footer2: "WaytoAGI 发起 · CMI Community 清迈场",
      details: "{number} 纹样详情",
      generating: "正在生成",
      downloaded: "已下载，再下一张",
      download: "下载纹样卡",
      collector: "采集者",
      sourceMissing: "来源位置待补充",
      actualTime: "实际采集时间 {date}",
      previewLabel: "预览样本，不作为历史资料引用",
      idea: "拿它生成 IDEA",
      observation: "现场观察",
      emptyObservation: "未填写",
      verified: "来源信息",
      emptyVerified: "待补充",
      unknown: "仍待了解",
      emptyUnknown: "暂未填写",
      enlarge: "放大查看 {number} 采集图片 {index}",
      imageAlt: "{number} 采集图片 {index}",
      imagePreview: "{number} 图片预览",
      closePreview: "关闭图片预览",
      previousImage: "查看上一张图片",
      nextImage: "查看下一张图片",
      enlargedAlt: "{number} 放大图片 {index}",
      kicker: "ARCHIVE / 大家的纹样",
      title: "一座持续生长的兰纳纹样档案",
      intro:
        "从最新发现开始浏览。点击任何方格，打开它与完整文物、来源和采集问题之间的关系。",
      previewNotice:
        "当前展示 {count} 份体验预览素材；连接 Supabase 后，这里会自动切换为参与者的真实公开采集。",
      museumFilter: "博物馆",
      carrierFilter: "载体",
      structureFilter: "结构",
      count: "{count} 枚纹样",
      loading: "正在整理档案…",
      loadFailed: "档案暂时没有加载出来，请重试。",
      reload: "重新加载",
      tileCollector: "采集者 · {name}",
      noMatches: "还没有符合条件的纹样",
      noMatchesHelp: "换一个筛选条件，或者成为第一个提交的人。",
      start: "开始采集",
      exportFailed: "生成失败，请保留此窗口后重试",
    },
    ideas: {
      kicker: "IDEA LAB / AI 可能性生成器",
      title: "这枚纹样，还能变成什么？",
      intro:
        "不用先想完整。选一种媒介，或者把选择交给偶然，再生成一个可以开始动手的方向。",
      categoriesLabel: "选择 IDEA 类型",
      look: "LOOK / 从这个角度",
      use: "USE / 使用这些素材",
      make: "MAKE / 做一件这样的事",
      ai: "AI CAN HELP / AI 的价值",
      current: "CURRENT PATTERN / 当前纹样",
      unnamed: "未命名纹样",
      collector: "采集者 · {name}",
      change: "换一枚纹样",
      again: "再来一个 IDEA",
      reimagined: "REIMAGINED / 创意再表达",
    },
    video: {
      title: "一条已经发生的可能性",
      intro: "从一个文化线索出发，AI 可以帮助我们把想法变成影像。",
      creditLabel: "作品署名",
      creditBefore: "该作品由",
      creditName: "AIGC 创作者「锐童学」学员",
      creditAfter: "倾力创作。",
      example: "AI 创作示例",
      reimagined: "创意再表达",
      nonHistorical: "非历史影像",
      unsupported: "你的浏览器暂不支持视频播放。",
    },
    footer: {
      title: "带一枚让你停下来的纹样，来现场一起做出来。",
      intro: "用 AI 创作，共同探寻兰纳 Lanna 纹案的踪迹。",
      credits: "WaytoAGI 发起 · CMI Community 组织清迈场",
      location: "活动地点：CMI Studio · 详细位置入群获取",
    },
  },
  th: {
    close: "ปิด",
    optional: "ไม่บังคับ",
    navLabel: "เมนูหลัก",
    openNav: "เปิดเมนู",
    closeNav: "ปิดเมนู",
    language: "ภาษา",
    languageMenu: "เลือกภาษาที่แสดง",
    languageChanged: "เปลี่ยนภาษาเป็นภาษาไทยแล้ว",
    nav: {
      works: "ผลงาน",
      about: "กิจกรรม",
      journey: "กำหนดการ",
      museums: "พิพิธภัณฑ์",
      collect: "เก็บลวดลาย",
      archive: "คลังลวดลาย",
      ideas: "ไอเดีย",
      recap: "บันทึกกิจกรรม",
    },
    signup: {
      action: "สมัครและเข้ากลุ่ม",
      dialogLabel: "สมัครเข้าร่วมกลุ่มกิจกรรม",
      kicker: "REGISTER / สมัครเข้ากลุ่ม",
      title: "สแกนเพื่อเข้ากลุ่มกิจกรรมเชียงใหม่",
      description:
        "รับพิกัด CMI Studio ข้อมูลเพื่อนไปพิพิธภัณฑ์ รหัสส่งลวดลาย และข่าวสารกิจกรรมในกลุ่ม",
      confirmTitle: "โปรดยืนยันก่อนเข้าร่วม",
      confirmText: "โปรดแน่ใจว่าคุณสนใจและมีเวลาเข้าร่วมกิจกรรม",
      qrAlt:
        "คิวอาร์โค้ดกลุ่ม WeChat กิจกรรม Museum Day Chiang Mai CMI ลวดลายล้านนา ใช้ได้ถึง 30 กรกฎาคม",
      qrUnavailable: "กำลังอัปเดตคิวอาร์โค้ดกลุ่ม",
      qrUnavailableHelp:
        "โปรดลองรีเฟรชภายหลัง หรือติดต่อ CMI Community เพื่อรับคิวอาร์โค้ดล่าสุด",
      qrNotice:
        "คิวอาร์โค้ดนี้ระบุว่าใช้ได้ถึง 30 กรกฎาคม และจะอัปเดตที่นี่เมื่อหมดอายุ",
    },
    hero: {
      series: "กิจกรรมประลองฝีมือ AI ครั้งที่ 26",
      event: "วันมหัศจรรย์แห่งพิพิธภัณฑ์ · เชียงใหม่",
      headlineBefore: "ร่วมกันตามรอยลวดลาย",
      headlineAfter: "ไปด้วยกัน",
      subtitle: "สร้างสรรค์ด้วย AI",
      initiator: "ริเริ่มโดย",
      venue: "CMI Community จัดกิจกรรมภาคสนามที่เชียงใหม่",
      timeLabel: "เวลา",
      time: "26.07.2026 · 12:30–17:30 น.",
      placeLabel: "สถานที่",
      locationLabel: "พิกัด",
      location: "รับรายละเอียดหลังเข้ากลุ่ม",
      collect: "เริ่มเก็บลวดลาย",
      worksCue: "ชมผลงานที่เกิดขึ้นในวันนั้น",
      recapKicker: "FIELD NOTES / บันทึกกิจกรรม",
      recapTitle:
        "พกลวดลายหนึ่งชิ้น แล้วทำความรู้จักเชียงใหม่ที่เราอาศัยอยู่อีกครั้ง",
      recapEdition: "เชียงใหม่ · 2026.07",
      recapChapter: "จากการมองเห็น สู่การร่วมสร้าง",
      recapPageTitle: "ลวดลายหนึ่งชิ้น เติบโตเป็นพิพิธภัณฑ์ร่วมกันได้อย่างไร",
      recapSummary:
        "จากการเก็บลวดลายในพิพิธภัณฑ์ การร่วมสร้างรอบโต๊ะ ไปจนถึงคลังลวดลายล้านนาออนไลน์ที่ยังเติบโตต่อไป นี่คือเรื่องราวฉบับเต็มของกิจกรรมครั้งนี้",
      recapTopics: "สำรวจพิพิธภัณฑ์ · ร่วมสร้างกับ AI · คลังลวดลาย",
      recapCta: "เปิดอ่านบันทึกฉบับเต็ม",
      recapAria:
        "เปิดอ่านบันทึกกิจกรรมฉบับเต็มเกี่ยวกับลวดลายล้านนาและเชียงใหม่",
    },
    works: {
      kicker: "AFTER / จัดแสดงผลงาน",
      titleLine1: "สิ่งที่หลงเหลือจากวันนั้น",
      titleLine2: "ไม่ได้มีเพียงลวดลาย",
      intro:
        "ผู้เข้าร่วมเริ่มจากสิ่งที่สังเกตจริงในพิพิธภัณฑ์ แล้วต่อยอดลวดลายเป็นเว็บไซต์ ภาพเคลื่อนไหว และประสบการณ์ใหม่ ผลงานวิดีโอสองชิ้นจากทีมเดียวกันจัดแสดงคู่กัน พร้อมบันทึกกิจกรรมแยกเป็นอีกหนึ่งผลงาน",
      previous: "ดูผลงานก่อนหน้า",
      next: "ดูผลงานถัดไป",
      railLabel: "แถบแสดงผลงานแนวนอน",
      footer:
        "ปัดซ้ายหรือขวาเพื่อดูผลงานทั้งหมด ผลงานอื่นจะเพิ่มเข้ามาหลังยืนยันเครดิตผู้สร้างสรรค์",
      creator: "ผู้สร้างสรรค์",
      open: "เปิดผลงาน: {title}",
      play: "เล่นผลงาน: {title}",
      coverAlt: "ภาพปก {title}",
      videoUnsupported: "เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ",
      interactiveWebsite: "เว็บไซต์เชิงโต้ตอบ",
      videoWork: "ผลงานวิดีโอ",
      eventRecap: "บันทึกกิจกรรม",
      gardenTitle: "ถักทอเสาให้เป็นป่า",
      gardenDescription:
        "ใช้ลวดลายล้านนาเป็นเมล็ดพันธุ์ แล้วถักทอลวดลายสองมิติให้กลายเป็นป่าเสาดิจิทัลที่เดินสำรวจได้ ผู้ชมหมุน เอียง และมองเสาแต่ละต้นใกล้ ๆ ได้ ทั้งยังเริ่มจากลวดลายจริงในคลัง เพื่อนำสีและโครงสร้างมาจัดใหม่และสร้างเสาของตนเอง ทุกผลงานยังคงรักษาที่มาไว้ พร้อมเปิดวิธีใหม่ในการมองและมีส่วนร่วมกับลวดลายดั้งเดิม",
      gardenCreator: "Lin Ke",
      microTitle1: "จากจุลภาคสู่มหภาค · บทภาพเคลื่อนไหว 01",
      microTitle2: "จากจุลภาคสู่มหภาค · บทภาพเคลื่อนไหว 02",
      microDescription1:
        "เริ่มจากเส้นลงรักปิดทอง รอยพับเกลียว หรือดอกไม้ศูนย์ร่วมบนงานแกะไม้ที่อาจถูกมองข้ามในตู้จัดแสดง แล้วค่อย ๆ ตามรอยไปจนเห็นตำนานช้างเผือกเดินเข้าสู่ขุนเขา เรื่องราวหลายร้อยปีของวัดพระธาตุดอยสุเทพ และภาพอารยธรรมของอาณาจักรล้านนาที่อยู่เบื้องหลัง—นี่คือเสน่ห์ของ",
      microEmphasis: "“มองมหภาคผ่านจุลภาค”",
      microDescription2: "",
      microDescription3:
        "ลวดลายคือฟอสซิลของกาลเวลาและลมหายใจของอารยธรรม เมื่อมองเห็นลวดลาย เราก็มองเห็นผู้คนและจิตวิญญาณที่ยังคงดำรงอยู่บนเวทีอันกว้างใหญ่ของประวัติศาสตร์",
      recapTitle: "บันทึกกิจกรรมประลองฝีมือ · 90 วินาที",
      recapDescription:
        "ย้อนกลับไปตลอดทั้งวันใน 90 วินาที ตั้งแต่การเก็บลวดลายในพิพิธภัณฑ์ไปจนถึงการนั่งล้อมวงสร้างสรรค์ร่วมกัน ชมว่าลวดลายถูกค้นพบ แยกองค์ประกอบ และเติบโตเป็นผลงานใหม่ผ่านความร่วมมือระหว่างคนกับ AI อย่างไร",
      creatorPending: "รอยืนยันผู้สร้างสรรค์",
    },
    manifesto: {
      kicker: "ABOUT / กิจกรรมนี้คืออะไร",
      title1: "นี่ไม่ใช่การบรรยายที่คุณเพียงนั่งฟังจนจบ",
      title2: "ทุกอย่างเริ่มจาก",
      pattern: "ลวดลายล้านนา",
      title3: "หนึ่งลายที่ทำให้คุณหยุดมอง",
      intro:
        "กิจกรรมประลองฝีมือ AI ริเริ่มโดย WaytoAGI และกิจกรรมเชียงใหม่จัดโดย CMI Community ก่อนวันงาน คุณจะไปยังหนึ่งในสองพิพิธภัณฑ์ บันทึกลวดลายระยะใกล้ วัตถุทั้งชิ้น และข้อมูลที่มา จากนั้นในวันที่ 26 กรกฎาคม นำกลับมาที่ CMI Studio เพื่อสร้างสรรค์ด้วย AI ร่วมกับเพื่อน ๆ",
      creative1: "เริ่มจากการสังเกต แล้วเปลี่ยนรายละเอียดทางวัฒนธรรมที่มีอยู่จริงให้เป็น",
      creative2:
        "เว็บไซต์ วิดีโอ เอเจนต์ เกม งาน 3D หรือผลงานสำหรับครอบครัว",
      outcomeTitle: "สิ่งที่ได้กลับไป ไม่ใช่เพียงลวดลายสวย ๆ",
      outcome:
        "คุณจะได้การ์ดลวดลายที่มีหมายเลข ที่มา และดาวน์โหลดได้ พร้อมผลงาน AI ที่นำไปจัดแสดง แบ่งปัน และพัฒนาต่อได้ อีกทั้งยังช่วยให้สิ่งที่ค้นพบครั้งนี้เข้าไปอยู่ในคลังลวดลายล้านนาเชียงใหม่ที่เติบโตต่อเนื่อง",
      credits:
        "ริเริ่มโดย WaytoAGI · กิจกรรมเชียงใหม่จัดโดย CMI Community · ณ CMI Studio",
      next: "ดูว่าการมีส่วนร่วมตลอดเส้นทางนี้ดำเนินไปอย่างไร",
    },
    journey: {
      kicker: "JOURNEY / เส้นทางการมีส่วนร่วม",
      title: "ตั้งแต่สมัครจนถึงจัดแสดงผลงาน",
      intro:
        "ก่อนวันงาน ออกไปดู ถ่ายภาพ และตั้งคำถาม จากนั้นในวันกิจกรรม เปลี่ยนสิ่งที่สังเกตจริงให้เป็นผลงาน AI เวลาทั้งหมดเป็นเวลาเชียงใหม่ GMT+7",
      choose: "เลือกพิพิธภัณฑ์ของคุณ",
    },
    museums: {
      kicker: "CHOOSE / เลือกพิพิธภัณฑ์",
      title: "สองจุดเริ่มต้น สองวิธีมองล้านนา",
      intro:
        "ปัดหรือวางเมาส์เพื่อดูทั้งสองแห่ง และเปิดเว็บไซต์กับแผนที่เพื่อตรวจสอบข้อมูลก่อนเดินทาง",
      sceneAlt: "บรรยากาศภายใน {name}",
      website: "ดูเว็บไซต์",
      map: "เปิดแผนที่",
      source: "ที่มาของภาพ: {source}",
    },
    collect: {
      step1Title: "เลือกที่มา",
      step1Description:
        "บอกเราก่อนว่าลวดลายนี้มาจากที่ใด หากไม่ทราบชื่อผลงานเต็ม สามารถกรอก “รอยืนยัน” แล้วไปต่อได้",
      step2Title: "เก็บภาพ",
      step2Description:
        "ถ่ายรายละเอียดที่ดึงดูดคุณก่อน แล้วถอยออกมาเพื่อเก็บวัตถุหรือบริบททั้งหมด ภาพแต่ละประเภทเลือกจากอัลบั้มหรือถ่ายใหม่ได้",
      step3Title: "สังเกตและกำกับข้อมูล",
      step3Description:
        "เขียนสิ่งที่คุณเห็นจริง ข้อมูลที่ยืนยันแล้ว และคำถามที่ยังอยากค้นคว้า จากนั้นใช้แท็กช่วยให้ผู้อื่นค้นพบลวดลายนี้อีกครั้ง",
      upload: "อัปโหลดภาพ",
      capture: "ถ่ายภาพ",
      minimum: "อย่างน้อย {count} ภาพ",
      format: "JPEG, PNG หรือ WebP · บีบอัดอัตโนมัติไม่เกิน 1.5MB ต่อภาพ",
      remove: "ลบ {name}",
      wizardLabel: "เก็บลวดลายใหม่",
      kicker: "NEW PATTERN / เก็บลวดลายใหม่",
      title: "เปลี่ยนสิ่งที่ค้นพบให้เป็นการ์ดลวดลายที่มีที่มา",
      localPreview: "ตัวอย่างในเครื่อง",
      museum: "พิพิธภัณฑ์ต้นทาง",
      collectorName: "ชื่อผู้เก็บสำหรับแสดงผล",
      collectorPlaceholder: "เช่น Som / ไม่ระบุชื่อ",
      sourceTitle: "ชื่อผลงานหรือวัตถุจัดแสดง",
      sourceTitlePlaceholder: "หากไม่ทราบ ให้เขียนว่า “รอยืนยัน”",
      location: "ส่วนจัดแสดงหรือจุดถ่ายภาพ",
      locationPlaceholder: "เช่น ชั้น 2 ส่วนจัดแสดงสิ่งทอ",
      detailImage: "ภาพลวดลายระยะใกล้",
      detailHelp: "เข้าใกล้รายละเอียดที่ดึงดูดคุณ สามารถเพิ่มได้หลายภาพ",
      contextImage: "ภาพวัตถุหรือบริบททั้งหมด",
      contextHelp: "ถอยออกมาหนึ่งก้าว แล้วถ่ายวัตถุ งานศิลปะ หรือฉากทั้งหมด",
      labelImage: "ภาพป้ายหรือข้อมูลที่มา",
      labelHelp:
        "หากมีป้าย ชื่อส่วนจัดแสดง หรือเบาะแสที่มาอื่น ๆ โปรดบันทึกไว้",
      observation: "สิ่งที่สังเกต ณ สถานที่จริง",
      observationPlaceholder:
        "อะไรทำให้คุณหยุดมอง ลวดลายซ้ำ ต่อเนื่อง หรือเชื่อมโยงกันอย่างไร",
      verified: "ข้อมูลที่มา",
      verifiedPlaceholder:
        "เขียนเฉพาะข้อมูลที่ยืนยันแล้วจากป้ายหรือแหล่งข้อมูลที่น่าเชื่อถือ",
      unknown: "สิ่งที่ยังต้องค้นคว้า",
      unknownPlaceholder: "คำถามใดที่คุณอยากค้นคว้าต่อมากที่สุด",
      accessCode: "รหัสส่งลวดลายของกิจกรรม",
      accessCodePlaceholder: "กรอกรหัสจากกลุ่มกิจกรรม",
      accessCodeHelp:
        "รหัสไม่แยกตัวพิมพ์เล็ก-ใหญ่ และจะตรวจสอบโดยเซิร์ฟเวอร์เมื่อส่งจริง",
      previous: "ก่อนหน้า",
      progress: "ทั้งหมด 3 หน้า เสร็จแล้ว {count} หน้า",
      next: "ถัดไป",
      submitting: "กำลังส่ง",
      submit: "ส่งและสร้างการ์ดหมายเลข",
      preview: "สร้างการ์ดตัวอย่างในเครื่อง",
      imageRequired:
        "โปรดเพิ่มภาพลวดลายระยะใกล้อย่างน้อย 1 ภาพ และภาพบริบททั้งหมดอย่างน้อย 1 ภาพ",
      observationRequired: "โปรดเขียนว่าเหตุใดลวดลายนี้จึงดึงดูดความสนใจของคุณ",
      codeRequired: "โปรดกรอกรหัสส่งลวดลายจากกลุ่มกิจกรรม",
      uploading: "กำลังบีบอัดและอัปโหลดภาพอย่างปลอดภัย…",
      submitFailed: "ส่งไม่สำเร็จ โปรดเปิดหน้านี้ไว้แล้วลองอีกครั้ง",
      sectionKicker: "COLLECT / เก็บลวดลายล้านนา",
      sectionTitle: "เก็บลวดลายล้านนาที่เป็นของคุณสักหนึ่งลาย",
      sectionIntro:
        "เมื่อพบรายละเอียดที่ทำให้คุณหยุดมอง ให้เก็บทั้งภาพระยะใกล้ วัตถุทั้งชิ้น และที่มา เปิดทางเข้านี้แล้วทำสามขั้นตอนเพื่อสร้างการ์ดหมายเลขที่ดาวน์โหลดได้",
      cardTitle: "เริ่มจากรายละเอียดหนึ่งจุด และรักษาบริบททั้งหมดที่มันจากมา",
      cardMeta: "เก็บ 3 ขั้นตอน · ออกหมายเลขอัตโนมัติ · สร้างการ์ดดาวน์โหลด",
      newPattern: "เก็บลวดลายใหม่",
      recentTitle: "ลวดลายที่เก็บเข้ามาแล้ว",
      viewAll: "ดูทั้งหมด {count} ลาย",
      viewPattern: "ดู {number} {title}",
      empty: "คลังกำลังรอลวดลายจริงชิ้นแรก",
    },
    taxonomy: {
      lannaMuseum: "พิพิธภัณฑ์พื้นถิ่นล้านนา",
      famMuseum: "พิพิธภัณฑ์ศิลปะฟ้าล้านนา",
      otherSource: "แหล่งอื่นในเชียงใหม่",
      carrier: "วัตถุรองรับลวดลาย",
      position: "ตำแหน่ง",
      structure: "โครงสร้าง",
      material: "วัสดุ",
      textile: "สิ่งทอ",
      object: "ภาชนะหรือวัตถุ",
      architecture: "สถาปัตยกรรม",
      sculpture: "ประติมากรรม",
      mural: "จิตรกรรมฝาผนัง",
      weave: "โครงสร้างจักสาน",
      installation: "ศิลปะจัดวาง",
      center: "กึ่งกลาง",
      edge: "ขอบ",
      bottom: "ด้านล่าง",
      surface: "พื้นผิว",
      body: "ตัววัตถุ",
      entrance: "ทางเข้า",
      repeat: "ซ้ำ",
      symmetry: "สมมาตร",
      interlace: "สอดประสาน",
      surround: "โอบล้อม",
      radiate: "แผ่ออกจากศูนย์กลาง",
      extend: "ต่อเนื่อง",
      layer: "ซ้อนชั้น",
      wood: "ไม้",
      ceramic: "เซรามิก",
      lacquer: "รัก",
      metal: "โลหะ",
      stone: "หิน",
      bamboo: "ไม้ไผ่",
      pigment: "สี",
      choose: "เลือก{label}",
    },
    archive: {
      anonymous: "ผู้เก็บไม่ระบุชื่อ",
      collectedBy: "ผู้เก็บ / COLLECTED BY",
      capturedAt: "เก็บเมื่อ {date}",
      footer1:
        "สิ่งที่สังเกต ณ สถานที่จริง · ข้อมูลที่มา · สิ่งที่ยังต้องค้นคว้า · การตีความสร้างสรรค์ใหม่",
      footer2: "ริเริ่มโดย WaytoAGI · กิจกรรมเชียงใหม่โดย CMI Community",
      details: "รายละเอียดลวดลาย {number}",
      generating: "กำลังสร้าง",
      downloaded: "ดาวน์โหลดแล้ว ดาวน์โหลดอีกครั้ง",
      download: "ดาวน์โหลดการ์ดลวดลาย",
      collector: "ผู้เก็บ",
      sourceMissing: "รอเพิ่มตำแหน่งที่มา",
      actualTime: "เก็บจริงเมื่อ {date}",
      previewLabel: "ตัวอย่างเพื่อทดลอง ไม่ใช้เป็นข้อมูลอ้างอิงทางประวัติศาสตร์",
      idea: "สร้าง IDEA จากลายนี้",
      observation: "สิ่งที่สังเกต ณ สถานที่จริง",
      emptyObservation: "ไม่ได้กรอก",
      verified: "ข้อมูลที่มา",
      emptyVerified: "รอเพิ่มเติม",
      unknown: "สิ่งที่ยังต้องค้นคว้า",
      emptyUnknown: "ยังไม่ได้กรอก",
      enlarge: "ขยายภาพที่เก็บของ {number} ภาพที่ {index}",
      imageAlt: "ภาพที่เก็บของ {number} ภาพที่ {index}",
      imagePreview: "ตัวอย่างภาพ {number}",
      closePreview: "ปิดภาพตัวอย่าง",
      previousImage: "ดูภาพก่อนหน้า",
      nextImage: "ดูภาพถัดไป",
      enlargedAlt: "ภาพขยาย {number} ลำดับที่ {index}",
      kicker: "ARCHIVE / ลวดลายของทุกคน",
      title: "คลังลวดลายล้านนาที่เติบโตต่อเนื่อง",
      intro:
        "เริ่มชมจากสิ่งที่ค้นพบล่าสุด กดที่ช่องใดก็ได้เพื่อดูความสัมพันธ์ระหว่างลวดลาย วัตถุทั้งชิ้น ที่มา และคำถามของผู้เก็บ",
      previewNotice:
        "ขณะนี้แสดงตัวอย่างทดลอง {count} รายการ เมื่อเชื่อมต่อ Supabase แล้ว ระบบจะเปลี่ยนเป็นผลงานสาธารณะจริงของผู้เข้าร่วมโดยอัตโนมัติ",
      museumFilter: "พิพิธภัณฑ์",
      carrierFilter: "วัตถุรองรับลวดลาย",
      structureFilter: "โครงสร้าง",
      count: "{count} ลาย",
      loading: "กำลังจัดระเบียบคลัง…",
      loadFailed: "ยังโหลดคลังไม่ได้ โปรดลองอีกครั้ง",
      reload: "โหลดอีกครั้ง",
      tileCollector: "ผู้เก็บ · {name}",
      noMatches: "ไม่พบลวดลายที่ตรงกับเงื่อนไข",
      noMatchesHelp: "ลองเปลี่ยนตัวกรอง หรือเป็นคนแรกที่ส่งลวดลาย",
      start: "เริ่มเก็บลวดลาย",
      exportFailed: "สร้างไม่สำเร็จ โปรดเปิดหน้าต่างนี้ไว้แล้วลองอีกครั้ง",
    },
    ideas: {
      kicker: "IDEA LAB / ตัวสร้างความเป็นไปได้ด้วย AI",
      title: "ลวดลายนี้ยังกลายเป็นอะไรได้อีก",
      intro:
        "ไม่ต้องคิดให้ครบตั้งแต่แรก เลือกสื่อหนึ่งชนิดหรือปล่อยให้ความบังเอิญเลือก แล้วสร้างทิศทางที่เริ่มลงมือได้ทันที",
      categoriesLabel: "เลือกประเภท IDEA",
      look: "LOOK / มองจากมุมนี้",
      use: "USE / ใช้วัสดุเหล่านี้",
      make: "MAKE / สร้างสิ่งนี้",
      ai: "AI CAN HELP / คุณค่าของ AI",
      current: "CURRENT PATTERN / ลวดลายปัจจุบัน",
      unnamed: "ลวดลายไม่มีชื่อ",
      collector: "ผู้เก็บ · {name}",
      change: "เปลี่ยนลวดลาย",
      again: "สร้าง IDEA อีกหนึ่งแบบ",
      reimagined: "REIMAGINED / การตีความสร้างสรรค์ใหม่",
    },
    video: {
      title: "หนึ่งความเป็นไปได้ที่เกิดขึ้นจริงแล้ว",
      intro: "จากเบาะแสทางวัฒนธรรมหนึ่งจุด AI ช่วยให้เราเปลี่ยนแนวคิดเป็นภาพเคลื่อนไหวได้",
      creditLabel: "เครดิตผลงาน",
      creditBefore: "ผลงานนี้สร้างสรรค์โดย",
      creditName: "นักสร้างสรรค์ AIGC จากกลุ่มนักเรียน “Ruitongxue”",
      creditAfter: "",
      example: "ตัวอย่างผลงาน AI",
      reimagined: "การตีความสร้างสรรค์ใหม่",
      nonHistorical: "ไม่ใช่ภาพเหตุการณ์ทางประวัติศาสตร์",
      unsupported: "เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ",
    },
    footer: {
      title: "นำลวดลายที่ทำให้คุณหยุดมองมาสร้างร่วมกัน",
      intro: "สร้างสรรค์ด้วย AI และร่วมกันตามรอยลวดลายล้านนา",
      credits: "ริเริ่มโดย WaytoAGI · กิจกรรมเชียงใหม่จัดโดย CMI Community",
      location: "สถานที่: CMI Studio · รับพิกัดโดยละเอียดในกลุ่ม",
    },
  },
  en: {
    close: "Close",
    optional: "Optional",
    navLabel: "Main navigation",
    openNav: "Open navigation",
    closeNav: "Close navigation",
    language: "Language",
    languageMenu: "Choose display language",
    languageChanged: "Display language changed to English",
    nav: {
      works: "Works",
      about: "About",
      journey: "Journey",
      museums: "Museums",
      collect: "Collect",
      archive: "Pattern archive",
      ideas: "Ideas",
      recap: "Event recap",
    },
    signup: {
      action: "Register & join",
      dialogLabel: "Register for the activity group",
      kicker: "REGISTER / Join the group",
      title: "Scan to join the Chiang Mai activity group",
      description:
        "Get the exact CMI Studio location, museum visit coordination, pattern collection access code, and activity updates in the group.",
      confirmTitle: "Before joining, please confirm",
      confirmText: "Please make sure you are interested and have time to attend.",
      qrAlt:
        "WeChat group QR code for Museum Day Chiang Mai CMI Lanna Patterns, valid through July 30",
      qrUnavailable: "Group QR code is being updated",
      qrUnavailableHelp:
        "Refresh later or contact CMI Community for the latest QR code.",
      qrNotice:
        "The current QR image is marked valid through July 30. It will be updated here after it expires.",
    },
    hero: {
      series: "AI Skills Exchange · Session 26",
      event: "Museum Day · Chiang Mai",
      headlineBefore: "Tracing",
      headlineAfter: "patterns together",
      subtitle: "Create with AI",
      initiator: "Initiated by",
      venue: "Chiang Mai gathering hosted by CMI Community",
      timeLabel: "Time",
      time: "2026.07.26 · 12:30–17:30",
      placeLabel: "Venue",
      locationLabel: "Location",
      location: "Details available after joining the group",
      collect: "Start collecting",
      worksCue: "See the works created that day",
      recapKicker: "FIELD NOTES / EVENT RECAP",
      recapTitle: "Carry one pattern, and meet the Chiang Mai we live in again",
      recapEdition: "Chiang Mai · 2026.07",
      recapChapter: "From noticing to making together",
      recapPageTitle: "How can one pattern grow into a shared museum?",
      recapSummary:
        "From museum fieldwork and making together around a table to a growing online archive of Lanna patterns—this is the full story of the gathering.",
      recapTopics: "Museum fieldwork · AI co-creation · Pattern archive",
      recapCta: "Open the full story",
      recapAria:
        "Open the full event recap, Carry one pattern and meet Chiang Mai again",
    },
    works: {
      kicker: "AFTER / Works on view",
      titleLine1: "What remained that day",
      titleLine2: "was more than patterns.",
      intro:
        "Starting from real observations in museums, participants developed patterns into websites, moving images, and new experiences. Two videos by the same group are shown side by side, with the event recap retained as a separate record.",
      previous: "View previous work",
      next: "View next work",
      railLabel: "Horizontal works showcase",
      footer:
        "Swipe left or right to view every work. More will be added once creator credits are confirmed.",
      creator: "Creator",
      open: "Open work: {title}",
      play: "Play work: {title}",
      coverAlt: "{title} cover",
      videoUnsupported: "Your browser does not support video playback.",
      interactiveWebsite: "Interactive website",
      videoWork: "Video work",
      eventRecap: "Event recap",
      gardenTitle: "Weaving Pillars into a Forest",
      gardenDescription:
        "Using Lanna patterns as seeds, this work weaves two-dimensional motifs into a navigable digital forest of pillars. Visitors can rotate, tilt, and inspect each patterned pillar, or begin with a real pattern from the archive, recombine its colors and structure, and weave a pillar of their own. Every creation retains its source while opening new ways to see and participate in traditional patterns.",
      gardenCreator: "Lin Ke",
      microTitle1: "Seeing the Macro through the Micro · Chapter 01",
      microTitle2: "Seeing the Macro through the Micro · Chapter 02",
      microDescription1:
        "Starting with an easily overlooked gilt-lacquer line, spiral fold, or concentric floral disc in a museum display, the work follows the thread until it reaches the legend of a white elephant entering the mountains, the centuries-spanning story of Wat Phra That Doi Suthep, and the wider civilization of the Lanna Kingdom—the appeal of",
      microEmphasis: "“seeing the macro through the micro”",
      microDescription2: ".",
      microDescription3:
        "Patterns are fossils of time and the breath of civilization. To see a pattern is to see the people and spirit that continue to live across history’s vast stage.",
      recapTitle: "AI Skills Exchange Recap · 90 Seconds",
      recapDescription:
        "In 90 seconds, retrace the day from collecting museum patterns to creating together around the table. See how patterns were discovered, taken apart, and grown into new works through collaboration between people and AI.",
      creatorPending: "Creator credit pending",
    },
    manifesto: {
      kicker: "ABOUT / What kind of activity is this?",
      title1: "This is not a lecture you sit through.",
      title2: "It begins with one",
      pattern: "Lanna pattern",
      title3: "that makes you stop and look.",
      intro:
        "The AI Skills Exchange was initiated by WaytoAGI, with the Chiang Mai gathering organized by CMI Community. Before the activity, you visit one of two museums and record a pattern close-up, its complete object, and its source. On July 26, you bring it back to CMI Studio and create with AI alongside others.",
      creative1: "Begin with observation and turn real cultural details into",
      creative2:
        "websites, moving images, agents, games, 3D pieces, or family works.",
      outcomeTitle: "What remains is more than a beautiful motif.",
      outcome:
        "You leave with a numbered, sourced, downloadable pattern card; an AI work that can be exhibited, shared, and developed further; and a discovery that becomes part of a growing Chiang Mai Lanna pattern archive.",
      credits:
        "Initiated by WaytoAGI · Chiang Mai gathering organized by CMI Community · At CMI Studio",
      next: "See how the full participation journey unfolds",
    },
    journey: {
      kicker: "JOURNEY / A complete participation path",
      title: "From registration to works on view",
      intro:
        "Before the activity, go look, photograph, and ask. On the day, turn a real observation into an AI work. All times are Chiang Mai time, GMT+7.",
      choose: "Choose your museum",
    },
    museums: {
      kicker: "CHOOSE / Choose your museum",
      title: "Two entrances, two ways to observe Lanna",
      intro:
        "Swipe or hover to view both museums. Open their websites and maps to confirm details before visiting.",
      sceneAlt: "Interior view of {name}",
      website: "View website",
      map: "Open map",
      source: "Image source: {source}",
    },
    collect: {
      step1Title: "Choose the source",
      step1Description:
        "First tell us where this pattern came from. If you do not know the full title, enter “To be confirmed” and continue.",
      step2Title: "Capture images",
      step2Description:
        "Photograph the detail that draws you in, then step back to preserve the complete object or context. Each image type can be uploaded or photographed directly.",
      step3Title: "Observe & label",
      step3Description:
        "Record what you actually saw, what has been confirmed, and what you still want to ask. Finally, add tags so others can find it again.",
      upload: "Upload images",
      capture: "Take a photo",
      minimum: "At least {count}",
      format: "JPEG, PNG, or WebP · Auto-compressed to no more than 1.5MB each",
      remove: "Remove {name}",
      wizardLabel: "Collect a new pattern",
      kicker: "NEW PATTERN / Collect a new pattern",
      title: "Turn this discovery into a pattern card with a traceable source",
      localPreview: "Local preview",
      museum: "Source museum",
      collectorName: "Collector display name",
      collectorPlaceholder: "For example: Alex / Anonymous",
      sourceTitle: "Work or exhibit title",
      sourceTitlePlaceholder: "If unknown, enter “To be confirmed”",
      location: "Gallery or photo location",
      locationPlaceholder: "For example: Textile gallery, second floor",
      detailImage: "Pattern close-up",
      detailHelp: "Move close to a detail that truly draws you in. You can add several.",
      contextImage: "Complete object or context",
      contextHelp: "Step back and photograph the complete object, artwork, or scene.",
      labelImage: "Label or source image",
      labelHelp:
        "If there is a label, gallery name, or another source clue, record it too.",
      observation: "On-site observation",
      observationPlaceholder: "Why did you stop? How does it repeat, extend, or connect?",
      verified: "Source information",
      verifiedPlaceholder:
        "Only include information confirmed by a label or reliable source",
      unknown: "Still to learn",
      unknownPlaceholder: "What question would you most like to explore next?",
      accessCode: "Activity collection access code",
      accessCodePlaceholder: "Enter the code from the activity group",
      accessCodeHelp:
        "The code is not case-sensitive. Final submissions are validated server-side.",
      previous: "Previous",
      progress: "3 pages total · {count} completed",
      next: "Next",
      submitting: "Submitting",
      submit: "Submit & generate numbered card",
      preview: "Generate local preview card",
      imageRequired:
        "Add at least one pattern close-up and one complete object or context image.",
      observationRequired: "Tell us why this pattern caught your attention.",
      codeRequired: "Enter the collection access code from the activity group.",
      uploading: "Compressing and securely uploading images…",
      submitFailed: "Submission failed. Keep this page open and try again.",
      sectionKicker: "COLLECT / Collect Lanna patterns",
      sectionTitle: "Now collect a Lanna pattern of your own",
      sectionIntro:
        "When a detail makes you stop, keep the close-up, complete work, and source together. Open the portal and complete three steps to generate a downloadable numbered card.",
      cardTitle: "Begin with one detail and preserve the whole context it came from.",
      cardMeta: "Three-step collection · Automatic numbering · Downloadable card",
      newPattern: "Collect a new pattern",
      recentTitle: "Patterns collected so far",
      viewAll: "View all {count}",
      viewPattern: "View {number} {title}",
      empty: "The archive is waiting for its first real pattern.",
    },
    taxonomy: {
      lannaMuseum: "Lanna Folklife Centre",
      famMuseum: "FAM Fahlanna Art Museum",
      otherSource: "Other Chiang Mai source",
      carrier: "Carrier",
      position: "Position",
      structure: "Structure",
      material: "Material",
      textile: "Textile",
      object: "Object",
      architecture: "Architecture",
      sculpture: "Sculpture",
      mural: "Mural",
      weave: "Woven structure",
      installation: "Installation",
      center: "Center",
      edge: "Edge",
      bottom: "Bottom",
      surface: "Surface",
      body: "Body",
      entrance: "Entrance",
      repeat: "Repetition",
      symmetry: "Symmetry",
      interlace: "Interlacing",
      surround: "Encircling",
      radiate: "Radiating",
      extend: "Extension",
      layer: "Layering",
      wood: "Wood",
      ceramic: "Ceramic",
      lacquer: "Lacquer",
      metal: "Metal",
      stone: "Stone",
      bamboo: "Bamboo",
      pigment: "Pigment",
      choose: "Choose {label}",
    },
    archive: {
      anonymous: "Anonymous collector",
      collectedBy: "COLLECTED BY",
      capturedAt: "Collected on {date}",
      footer1:
        "ON-SITE OBSERVATION · SOURCE INFORMATION · STILL TO LEARN · REIMAGINED",
      footer2: "Initiated by WaytoAGI · CMI Community Chiang Mai",
      details: "{number} pattern details",
      generating: "Generating",
      downloaded: "Downloaded · Get another copy",
      download: "Download pattern card",
      collector: "Collector",
      sourceMissing: "Source location to be added",
      actualTime: "Actually collected on {date}",
      previewLabel: "Preview sample · Not a historical reference",
      idea: "Generate an IDEA from this",
      observation: "On-site observation",
      emptyObservation: "Not provided",
      verified: "Source information",
      emptyVerified: "To be added",
      unknown: "Still to learn",
      emptyUnknown: "Not provided",
      enlarge: "Enlarge {number} collection image {index}",
      imageAlt: "{number} collection image {index}",
      imagePreview: "{number} image preview",
      closePreview: "Close image preview",
      previousImage: "View previous image",
      nextImage: "View next image",
      enlargedAlt: "{number} enlarged image {index}",
      kicker: "ARCHIVE / Everyone’s patterns",
      title: "A growing archive of Lanna patterns",
      intro:
        "Browse from the newest discovery. Select any tile to open its relationship to the complete object, source, and collector’s question.",
      previewNotice:
        "Currently showing {count} experience-preview records. Once Supabase is connected, participant submissions published for public viewing will appear automatically.",
      museumFilter: "Museum",
      carrierFilter: "Carrier",
      structureFilter: "Structure",
      count: "{count} patterns",
      loading: "Organizing the archive…",
      loadFailed: "The archive did not load. Please try again.",
      reload: "Reload",
      tileCollector: "Collector · {name}",
      noMatches: "No patterns match these filters",
      noMatchesHelp: "Try another filter, or become the first person to submit.",
      start: "Start collecting",
      exportFailed: "Generation failed. Keep this window open and try again.",
    },
    ideas: {
      kicker: "IDEA LAB / AI possibility generator",
      title: "What else could this pattern become?",
      intro:
        "You do not need a complete idea first. Choose a medium—or leave it to chance—and generate one direction you can start making.",
      categoriesLabel: "Choose an IDEA type",
      look: "LOOK / Take this angle",
      use: "USE / Work with these materials",
      make: "MAKE / Create this",
      ai: "AI CAN HELP / The value of AI",
      current: "CURRENT PATTERN",
      unnamed: "Untitled pattern",
      collector: "Collector · {name}",
      change: "Change pattern",
      again: "Another IDEA",
      reimagined: "REIMAGINED / Creative reinterpretation",
    },
    video: {
      title: "One possibility already brought to life",
      intro: "Starting from a cultural clue, AI can help us turn an idea into moving images.",
      creditLabel: "Work credit",
      creditBefore: "Created by",
      creditName: "AIGC creators from the “Ruitongxue” student group",
      creditAfter: ".",
      example: "AI creative example",
      reimagined: "Creative reinterpretation",
      nonHistorical: "Not historical footage",
      unsupported: "Your browser does not support video playback.",
    },
    footer: {
      title: "Bring a pattern that makes you stop and make something together.",
      intro: "Create with AI and trace Lanna patterns together.",
      credits:
        "Initiated by WaytoAGI · Chiang Mai gathering organized by CMI Community",
      location: "Venue: CMI Studio · Exact location available in the group",
    },
  },
};

function getByPath(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

function interpolate(template, variables = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) =>
    variables[key] === undefined ? `{${key}}` : String(variables[key]),
  );
}

function readInitialLanguage() {
  if (typeof window === "undefined") {
    return "zh";
  }

  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  if (languageOptions.some(({ code }) => code === queryLanguage)) {
    return queryLanguage;
  }

  const savedLanguage = window.localStorage.getItem("lanna-site-language");
  if (languageOptions.some(({ code }) => code === savedLanguage)) {
    return savedLanguage;
  }

  return "zh";
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(readInitialLanguage);

  const setLanguage = (nextLanguage) => {
    if (!languageOptions.some(({ code }) => code === nextLanguage)) {
      return;
    }
    setLanguageState(nextLanguage);
  };

  const value = useMemo(() => {
    const t = (key, variables) => {
      const translated = getByPath(messages[language], key);
      const fallback = getByPath(messages.zh, key);
      return interpolate(translated ?? fallback ?? key, variables);
    };

    return { language, setLanguage, t };
  }, [language]);

  useEffect(() => {
    document.documentElement.lang =
      language === "zh" ? "zh-CN" : language === "th" ? "th" : "en";
    document.documentElement.dataset.language = language;
    window.localStorage.setItem("lanna-site-language", language);

    const url = new URL(window.location.href);
    if (language === "zh") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", language);
    }
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);

    const isRecapPage =
      window.location.pathname.replace(/\/+$/, "") === "/recap";
    const titles = isRecapPage
      ? {
          zh: "带着一枚纹样，重新认识我们生活的清迈｜活动回顾",
          th: "บันทึกกิจกรรมลวดลายล้านนาและเชียงใหม่｜CMI FIELD NOTES",
          en: "Carry one pattern, and meet Chiang Mai again | CMI Field Notes",
        }
      : {
          zh: "7月26日 AI 切磋大会｜博物馆奇妙日 · CMI STUDIO",
          th: "กิจกรรมประลองฝีมือ AI · วันมหัศจรรย์แห่งพิพิธภัณฑ์ เชียงใหม่ · CMI STUDIO",
          en: "AI Skills Exchange · Museum Day Chiang Mai · CMI STUDIO",
        };
    const descriptions = isRecapPage
      ? {
          zh: "从博物馆采集、AI 共创，到一座持续生长的线上兰纳纹样档案。",
          th: "จากการเก็บลวดลายในพิพิธภัณฑ์ การร่วมสร้างกับ AI สู่คลังลวดลายล้านนาออนไลน์ที่เติบโตต่อไป",
          en: "From museum fieldwork and AI co-creation to a growing online archive of Lanna patterns.",
        }
      : {
          zh: "走进清迈博物馆采集兰纳纹样，用 AI 把真实观察变成网页、影像、智能体、游戏与更多共创作品。",
          th: "สำรวจพิพิธภัณฑ์เชียงใหม่ เก็บลวดลายล้านนา และใช้ AI เปลี่ยนสิ่งที่สังเกตจริงให้เป็นเว็บไซต์ วิดีโอ เอเจนต์ เกม และผลงานร่วมสร้างสรรค์",
          en: "Explore Chiang Mai museums, collect Lanna patterns, and use AI to turn real observations into websites, moving images, agents, games, and collaborative works.",
        };
    document.title = titles[language];
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", descriptions[language]);
  }, [language]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
