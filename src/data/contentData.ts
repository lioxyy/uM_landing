export interface BookItem {
  id: string;
  available: boolean;
  title: string;
  author: string;
  tags: string[];
  coverImg?: string;
}

export const BOOKS_DATA: BookItem[] = [
  {
    id: "book-1",
    available: true,
    title: "مختصر تفسير ابن كثير",
    author: "محمد كريم راجح",
    tags: ["قرآن", "تفسير"],
  },
  {
    id: "book-2",
    available: true,
    title: "مختصر تفسير ابن كثير",
    author: "محمد كريم راجح",
    tags: ["قرآن", "تفسير"],
  },
  {
    id: "book-3",
    available: true,
    title: "مختصر تفسير ابن كثير",
    author: "محمد كريم راجح",
    tags: ["قرآن", "تفسير"],
  },
  {
    id: "book-4",
    available: true,
    title: "مختصر تفسير ابن كثير",
    author: "محمد كريم راجح",
    tags: ["قرآن", "تفسير"],
  },
];

export interface ActivityItem {
  id: string;
  title: string;
  desc?: string;
  img: string;
  featured?: boolean;
  badge?: string;
}

export const ACTIVITIES_DATA: {
  list: ActivityItem[];
  featured: ActivityItem;
} = {
  list: [
    {
      id: "act-1",
      title: "مكتبة",
      desc: "حلقات أسبوعية لحفظ وتدبر القرآن الكريم.",
      img: "/assets/a46cc.png",
    },
    {
      id: "act-2",
      title: "نشاط مسعى",
      img: "/assets/08c91.png",
    },
    {
      id: "act-3",
      title: "المسابقة الرمضانية",
      img: "/assets/cc7e1.png",
    },
  ],
  featured: {
    id: "act-featured",
    title: "حلقات القرآن",
    desc: "حلقات أسبوعية لحفظ وتدبر القرآن الكريم.",
    img: "/assets/c1371.png",
    featured: true,
    badge: "الأكثر إقبالا",
  },
};

export interface ArticleItem {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  tags: string[];
  img?: string;
}

export const ARTICLES_DATA: ArticleItem[] = [
  {
    id: "art-1",
    date: "14/10/2025",
    title: "منارة العلم والإيمان في حياة الجامعة",
    excerpt: "يُعَدّ مصلى الجامعة أكثر من مجرد مكانٍ للصلاة، فهو منارةٌ للعلم والتزكية والتواصل بين طلاب الجامعة وأساتذتها.",
    tags: ["مقال", "المسجد"],
  },
  {
    id: "art-2",
    date: "14/10/2025",
    title: "منارة العلم والإيمان في حياة الجامعة",
    excerpt: "يُعَدّ مصلى الجامعة أكثر من مجرد مكانٍ للصلاة، فهو منارةٌ للعلم والتزكية والتواصل بين طلاب الجامعة وأساتذتها.",
    tags: ["مقال", "المسجد"],
  },
  {
    id: "art-3",
    date: "14/10/2025",
    title: "منارة العلم والإيمان في حياة الجامعة",
    excerpt: "يُعَدّ مصلى الجامعة أكثر من مجرد مكانٍ للصلاة، فهو منارةٌ للعلم والتزكية والتواصل بين طلاب الجامعة وأساتذتها.",
    tags: ["مقال", "المسجد"],
  },
];

export const MOSQUE_INFO = {
  about: {
    heading: "لبنة المجتمع",
    description:
      "إن من الملفت للنظر أن أول عمل قام به الرسول ﷺ في قباء وفي المدينة كان بناء مسجد في كل منهما، وهذا الأمر لم يكن على سبيل المصادفة، ولم يكن مجرد إشارة عابرة، بل هذا منهج أصيل، فلا قيام لأمة إسلامية بغير المسجد.",
    cardTitle: "\"نور الهداية\"",
    cardQuote:
      "فِي بُيُوتٍ أَذِنَ اللهُ أَنْ تُرْفَعَ وَيُذْكَرَ فِيهَا اسْمُهُ يُسَبِّحُ لَهُ فِيهَا بِالْغُدُوِّ وَالْآصَالِ.",
  },
  mission: {
    heading: "رسالة علمية وإيمانية",
    description:
      "يعتبر مسجد جامعة باب الزوار جسراً معرفياً يربط بين العلوم التجريبية  والقيم الروحية. نهدف إلى توفير بيئة هادئة ومحفزة للطلاب والباحثين، تساهم في بناء جيل متوازن علمياً وفكرياً.",
    cardTitle: "\"منارة الإيمان\"",
    cardQuote:
      "المسجد منارة تُنير القلوب بالإيمان وتجمع المسلمين على الخير والمحبة.",
    stats: [
      { count: "+8", label: "نشاط سنويا" },
      { count: "+5000", label: "كتاب ومرجع" },
    ],
  },
  cta: {
    heading: "هل أنت مستعد لبدء رحلتك المعرفية؟",
    subtitle:
      "انضم إلى آلاف الطلاب والباحثين واستفد من خدمات الاستعارة والأنشطة العلمية.",
    buttonText: "سجل الآن",
  },
};
