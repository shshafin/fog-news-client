import type {
  Article,
  Poll,
  Quiz,
  Media,
  NewsletterSubscriber,
  Ad,
  MenuItem,
  SiteSettings,
  Comment, // Make sure Comment is imported from your content-models
} from "./content-models";

// Base service class for localStorage operations
class LocalStorageService<T extends { id: string }> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  initialize(initialData: T[] = []): void {
    if (typeof window === "undefined") return;

    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  getAll(): Promise<T[]> {
    return new Promise((resolve) => {
      const data = JSON.parse(
        localStorage.getItem(this.storageKey) || "[]"
      ) as T[];
      resolve(data);
    });
  }

  getById(id: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const data = JSON.parse(
        localStorage.getItem(this.storageKey) || "[]"
      ) as T[];
      const item = data.find((item) => item.id === id);
      if (item) {
        resolve(item);
      } else {
        reject(new Error(`Item with id ${id} not found`));
      }
    });
  }

  create(item: Omit<T, "id">): Promise<T> {
    return new Promise((resolve) => {
      const data = JSON.parse(
        localStorage.getItem(this.storageKey) || "[]"
      ) as T[];
      const newItem = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      } as T;
      data.push(newItem);
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      resolve(newItem);
    });
  }

  update(id: string, updates: Partial<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const data = JSON.parse(
        localStorage.getItem(this.storageKey) || "[]"
      ) as T[];
      const index = data.findIndex((item) => item.id === id);
      if (index !== -1) {
        data[index] = { ...data[index], ...updates };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        resolve(data[index]);
      } else {
        reject(new Error(`Item with id ${id} not found`));
      }
    });
  }

  delete(id: string): Promise<void> {
    return new Promise((resolve) => {
      const data = JSON.parse(
        localStorage.getItem(this.storageKey) || "[]"
      ) as T[];
      const filteredData = data.filter((item) => item.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredData));
      resolve();
    });
  }
}

// Sample initial data for articles
const initialArticles: Article[] = [
  {
    id: "1",
    title: "Breaking News: Major Development in Technology",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    subTitle: "A major breakthrough in technology has been announced today...",
    author: "John Doe",
    category: "Technology",
    tags: ["tech", "innovation", "breakthrough"],
    status: "published",
    language: "en",
    feature: true,
    media: ["/placeholder.svg?height=400&width=600"],
    seo: {
      metaTitle: "HELLO",
      metaDescription: "OKSY",
    },
    publishDate: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Sports Update: Championship Results Revealed",
    description:
      "The finals concluded with an unexpected twist as the underdogs took the win.",
    subTitle: "An unforgettable match that left fans in awe.",
    author: "Jane Smith",
    category: "Sports",
    tags: ["sports", "championship", "finals"],
    status: "published",
    language: "en",
    feature: false,
    media: ["/sports.jpg"],
    seo: {
      metaTitle: "Sports Championship",
      metaDescription: "Unexpected outcome in the finals.",
    },
    publishDate: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Health Tips: Boost Your Immunity Naturally",
    description:
      "Experts share proven methods to strengthen your immune system through diet and lifestyle.",
    subTitle: "Healthy living starts with small changes.",
    author: "Emily Johnson",
    category: "Health",
    tags: ["health", "immunity", "wellness"],
    status: "published",
    language: "en",
    feature: true,
    media: ["/health.jpg"],
    seo: {
      metaTitle: "Boost Immunity",
      metaDescription: "Natural ways to strengthen your immune system.",
    },
    publishDate: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Entertainment: New Movie Breaks Box Office Records",
    description:
      "The latest blockbuster sets a new record with its opening weekend sales.",
    subTitle: "Fans flock to theaters for the must-see movie of the year.",
    author: "Robert Lee",
    category: "Entertainment",
    tags: ["movies", "box office", "records"],
    status: "published",
    language: "en",
    feature: false,
    media: ["/entertainment.jpg"],
    seo: {
      metaTitle: "Box Office Smash",
      metaDescription: "A new record-breaking movie hits theaters.",
    },
    publishDate: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Business Insight: Market Trends for 2025",
    description:
      "Analysts reveal key trends shaping the global market in the coming year.",
    subTitle: "Stay ahead with expert financial insights.",
    author: "Sarah Walker",
    category: "Business",
    tags: ["finance", "market", "trends"],
    status: "published",
    language: "en",
    feature: true,
    media: ["/business.jpg"],
    seo: {
      metaTitle: "Market Trends 2025",
      metaDescription: "Top trends to watch in the business world.",
    },
    publishDate: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Travel Guide: Top Destinations for Solo Travelers",
    description:
      "Explore safe and exciting places ideal for your next solo adventure.",
    subTitle: "Wanderlust awaits with these hidden gems.",
    author: "Laura Green",
    category: "Travel",
    tags: ["travel", "solo", "destinations"],
    status: "published",
    language: "en",
    feature: false,
    media: ["/travel.jpg"],
    seo: {
      metaTitle: "Solo Travel Tips",
      metaDescription: "Best places to travel alone in 2025.",
    },
    publishDate: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Science Update: Climate Change Breakthrough",
    description:
      "Scientists unveil new data that may lead to actionable climate solutions.",
    subTitle: "A ray of hope in the fight against climate change.",
    author: "Michael Brown",
    category: "Science",
    tags: ["science", "climate", "research"],
    status: "published",
    language: "en",
    feature: true,
    media: ["/climate.jpg"],
    seo: {
      metaTitle: "Climate Science",
      metaDescription: "Groundbreaking research on climate change.",
    },
    publishDate: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Education: AI in the Classroom",
    description:
      "How artificial intelligence is transforming the future of education.",
    subTitle: "From personalized learning to intelligent tutors.",
    author: "Anna Davis",
    category: "Education",
    tags: ["education", "AI", "learning"],
    status: "published",
    language: "en",
    feature: false,
    media: ["/education.jpg"],
    seo: {
      metaTitle: "AI and Education",
      metaDescription: "New trends in EdTech powered by AI.",
    },
    publishDate: new Date().toISOString(),
  },
  {
    id: "9",
    title: "Lifestyle: Minimalism for Mental Clarity",
    description:
      "Why less is more: the benefits of a minimalist lifestyle on your mental health.",
    subTitle: "Declutter your space, clear your mind.",
    author: "Natalie Perez",
    category: "Lifestyle",
    tags: ["minimalism", "mental health", "lifestyle"],
    status: "published",
    language: "en",
    feature: true,
    media: ["/minimalism.jpg"],
    seo: {
      metaTitle: "Minimalist Living",
      metaDescription: "Mental clarity through a minimalist approach.",
    },
    publishDate: new Date().toISOString(),
  },
  {
    id: "10",
    title: "Politics: Election Results Shake the Nation",
    description:
      "Unexpected outcomes from the latest election cause waves across the country.",
    subTitle: "What this means for the political landscape.",
    author: "Daniel White",
    category: "Politics",
    tags: ["election", "politics", "news"],
    status: "published",
    language: "en",
    feature: false,
    media: ["/politics.jpg"],
    seo: {
      metaTitle: "Election Results",
      metaDescription: "Nation reacts to surprising election outcome.",
    },
    publishDate: new Date().toISOString(),
  },
  {
    id: "11",
    title: "Fashion Trends: What's Hot This Summer",
    description:
      "Designers reveal the top styles to watch this season.",
    subTitle: "Bold colors and breezy fits are in.",
    author: "Samantha King",
    category: "Fashion",
    tags: ["fashion", "trends", "summer"],
    status: "published",
    language: "en",
    feature: true,
    media: ["/fashion.jpg"],
    seo: {
      metaTitle: "Summer Fashion",
      metaDescription: "Trending looks for the upcoming summer.",
    },
    publishDate: new Date().toISOString(),
  },

];

// Sample initial data for polls
const initialPolls: Poll[] = [
  {
    id: "1",
    question: "What is your favorite technology?",
    options: [
      { id: "1", text: "Artificial Intelligence", votes: 42 },
      { id: "2", text: "Blockchain", votes: 28 },
      { id: "3", text: "Virtual Reality", votes: 35 },
      { id: "4", text: "Quantum Computing", votes: 15 },
    ],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    status: "active",
    language: "en",
    totalVotes: 120,
  },
  {
    id: "2",
    question: "আপনার পছন্দের প্রযুক্তি কোনটি?",
    options: [
      { id: "1", text: "কৃত্রিম বুদ্ধিমত্তা", votes: 38 },
      { id: "2", text: "ব্লকচেইন", votes: 22 },
      { id: "3", text: "ভার্চুয়াল রিয়েলিটি", votes: 31 },
      { id: "4", text: "কোয়ান্টাম কম্পিউটিং", votes: 12 },
    ],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    status: "active",
    language: "bn",
    totalVotes: 103,
  },
];

// Sample initial data for quizzes
const initialQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Technology Knowledge Quiz",
    description: "Test your knowledge about the latest technology trends",
    questions: [
      {
        id: "1",
        text: "What does AI stand for?",
        options: [
          { id: "1", text: "Artificial Intelligence", isCorrect: true },
          { id: "2", text: "Automated Interface", isCorrect: false },
          { id: "3", text: "Advanced Integration", isCorrect: false },
          { id: "4", text: "Alternate Input", isCorrect: false },
        ],
        correctAnswer: "1",
      },
      {
        id: "2",
        text: "Which company created ChatGPT?",
        options: [
          { id: "1", text: "Google", isCorrect: false },
          { id: "2", text: "Microsoft", isCorrect: false },
          { id: "3", text: "OpenAI", isCorrect: true },
          { id: "4", text: "Facebook", isCorrect: false },
        ],
        correctAnswer: "3",
      },
    ],
    status: "active",
    language: "en",
    completions: 87,
  },
];

// Sample initial data for media
const initialMedia: Media[] = [
  {
    id: "1",
    title: "Technology Image",
    name: "Technology Image",
    type: "image",
    url: "/placeholder.svg?height=400&width=600",
    alt: "Technology illustration",
    uploadedBy: "admin-1",
    uploadDate: new Date().toISOString(),
    uploadedAt: new Date().toISOString(),
    size: 245000,
    dimensions: { width: 600, height: 400 },
  },
  {
    id: "2",
    title: "Business Chart",
    name: "Business Chart",
    type: "image",
    url: "/placeholder.svg?height=400&width=600",
    alt: "Business growth chart",
    uploadedBy: "admin-1",
    uploadDate: new Date().toISOString(),
    uploadedAt: new Date().toISOString(),
    size: 180000,
    dimensions: { width: 600, height: 400 },
  },
];

// Sample initial data for newsletter subscribers
const initialSubscribers: NewsletterSubscriber[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    name: "John Doe",
    subscriptionDate: new Date().toISOString(),
    status: "active",
    preferences: ["daily", "technology", "business"],
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    subscriptionDate: new Date().toISOString(),
    status: "active",
    preferences: ["weekly", "politics", "entertainment"],
  },
  {
    id: "3",
    email: "bob.johnson@example.com",
    name: "Bob Johnson",
    subscriptionDate: new Date().toISOString(),
    status: "inactive",
    preferences: ["daily", "sports", "technology"],
  },
];

// Sample initial data for comments
const initialComments: Comment[] = [
  {
    id: "1",
    articleId: "1",
    author: "John Reader",
    email: "john.reader@example.com",
    content: "Great article! Very informative.",
    date: new Date().toISOString(),
    status: "approved",
    approved: true,
    likes: 5,
    replies: [
      {
        id: "1-1",
        commentId: "1",
        author: "Jane Author",
        email: "jane.author@example.com",
        content: "Thank you for your feedback!",
        date: new Date().toISOString(),
        status: "approved",
      },
    ],
  },
];

// Sample initial data for ads
const initialAds: Ad[] = [
  {
    id: "1",
    title: "Premium Subscription Ad",
    name: "Premium Subscription", // Added property
    type: "banner",
    imageUrl: "/placeholder.svg?height=200&width=800",
    targetUrl: "https://example.com/subscribe",
    linkUrl: "https://example.com/subscribe", // Added property
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days from now
    status: "active",
    active: true, // Added property
    position: "header",
    impressions: 1250,
    clicks: 75,
  },
];

// Sample initial data for menu items
const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    title: "Home",
    url: "/",
    order: 1,
    parent: null,
    language: "en",
  },
  {
    id: "2",
    title: "News",
    url: "/news",
    order: 2,
    parent: null,
    language: "en",
  },
  {
    id: "3",
    title: "Politics",
    url: "/politics",
    order: 3,
    parent: null,
    language: "en",
  },
  {
    id: "4",
    title: "Business",
    url: "/business",
    order: 4,
    parent: null,
    language: "en",
  },
  {
    id: "5",
    title: "Technology",
    url: "/technology",
    order: 5,
    parent: null,
    language: "en",
  },
  {
    id: "6",
    title: "Entertainment",
    url: "/entertainment",
    order: 6,
    parent: null,
    language: "en",
  },
  {
    id: "7",
    title: "Sports",
    url: "/sports",
    order: 7,
    parent: null,
    language: "en",
  },
  {
    id: "8",
    title: "Lifestyle",
    url: "/lifestyle",
    order: 8,
    parent: null,
    language: "en",
  },
  {
    id: "9",
    title: "Opinion",
    url: "/opinion",
    order: 9,
    parent: null,
    language: "en",
  },
  {
    id: "10",
    title: "E-Paper",
    url: "/epaper",
    order: 10,
    parent: null,
    language: "en",
  },
  // Bangla menu items
  {
    id: "11",
    title: "হোম",
    url: "/",
    order: 1,
    parent: null,
    language: "bn",
  },
  {
    id: "12",
    title: "সংবাদ",
    url: "/news",
    order: 2,
    parent: null,
    language: "bn",
  },
  {
    id: "13",
    title: "রাজনীতি",
    url: "/politics",
    order: 3,
    parent: null,
    language: "bn",
  },
  {
    id: "14",
    title: "ব্যবসা",
    url: "/business",
    order: 4,
    parent: null,
    language: "bn",
  },
  {
    id: "15",
    title: "প্রযুক্তি",
    url: "/technology",
    order: 5,
    parent: null,
    language: "bn",
  },
  {
    id: "16",
    title: "বিনোদন",
    url: "/entertainment",
    order: 6,
    parent: null,
    language: "bn",
  },
  {
    id: "17",
    title: "খেলাধুলা",
    url: "/sports",
    order: 7,
    parent: null,
    language: "bn",
  },
  {
    id: "18",
    title: "জীবনযাপন",
    url: "/lifestyle",
    order: 8,
    parent: null,
    language: "bn",
  },
  {
    id: "19",
    title: "মতামত",
    url: "/opinion",
    order: 9,
    parent: null,
    language: "bn",
  },
  {
    id: "20",
    title: "ই-পেপার",
    url: "/epaper",
    order: 10,
    parent: null,
    language: "bn",
  },
];

// Sample initial site settings
const initialSiteSettings: SiteSettings = {
  id: "1",
  siteName: {
    en: "The Fog News",
    bn: "দ্য চোখ ইনসাইট",
  },
  siteDescription: {
    en: "Your trusted source for news and insights",
    bn: "আপনার বিশ্বস্ত সংবাদ ও বিশ্লেষণের উৎস",
  },
  logo: "/placeholder.svg?height=60&width=200",
  favicon: "/favicon.ico",
  contactEmail: "info@thechokh.com",
  socialLinks: {
    facebook: "https://facebook.com/thechokh",
    twitter: "https://twitter.com/thechokh",
    instagram: "https://instagram.com/thechokh",
    youtube: "https://youtube.com/thechokh",
  },
  seoSettings: {
    defaultTitle: "The Fog News - Your Trusted News Source",
    defaultDescription:
      "The Fog News provides the latest news, analysis, and insights on politics, business, technology, and more.",
    defaultKeywords:
      "news, politics, business, technology, entertainment, sports",
    googleAnalyticsId: "UA-XXXXXXXXX-X",
  },
  themeSettings: {
    primaryColor: "#ef4444",
    secondaryColor: "#3b82f6",
    fontFamily: "Inter, sans-serif",
  },
  commentSettings: {
    enabled: true,
    requireApproval: true,
    allowGuests: false,
  },
  defaultLanguage: "en",
};

// Create service instances
export const articleService = new LocalStorageService<Article>(
  "chokh_articles"
);
export const pollService = new LocalStorageService<Poll>("chokh_polls");
export const quizService = new LocalStorageService<Quiz>("chokh_quizzes");
export const mediaService = new LocalStorageService<Media>("chokh_media");
export const newsletterService = new LocalStorageService<NewsletterSubscriber>(
  "chokh_subscribers"
);
export const commentService = new LocalStorageService<Comment>(
  "chokh_comments"
);
// export const commentService = new LocalStorageService<Comment>("chokh_comments")
export const menuService = new LocalStorageService<MenuItem>("chokh_menu");

// Initialize services with initial data
articleService.initialize(initialArticles);
pollService.initialize(initialPolls);
quizService.initialize(initialQuizzes);
mediaService.initialize(initialMedia);
newsletterService.initialize(initialSubscribers);
commentService.initialize(initialComments);
// commentService.initialize(initialComments)
menuService.initialize(initialMenuItems);

// Site settings service (singleton)
export const siteSettingsService = {
  get: (): Promise<SiteSettings> => {
    return new Promise((resolve) => {
      const settings = JSON.parse(
        localStorage.getItem("chokh_site_settings") ||
          JSON.stringify(initialSiteSettings)
      );
      resolve(settings);
    });
  },
  update: (updates: Partial<SiteSettings>): Promise<SiteSettings> => {
    return new Promise((resolve) => {
      const settings = JSON.parse(
        localStorage.getItem("chokh_site_settings") ||
          JSON.stringify(initialSiteSettings)
      );
      const updatedSettings = { ...settings, ...updates };
      localStorage.setItem(
        "chokh_site_settings",
        JSON.stringify(updatedSettings)
      );
      resolve(updatedSettings);
    });
  },
  initialize: () => {
    if (typeof window === "undefined") return;

    const existingSettings = localStorage.getItem("chokh_site_settings");
    if (!existingSettings) {
      localStorage.setItem(
        "chokh_site_settings",
        JSON.stringify(initialSiteSettings)
      );
    }
  },
};

// Sitemap generator service
export const sitemapService = {
  generate: async (): Promise<string> => {
    const articles = await articleService.getAll();
    const categories = [
      ...new Set(articles.map((article) => article.category)),
    ];

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add homepage
    sitemap += "  <url>\n";
    sitemap += "    <loc>https://thechokh.com/</loc>\n";
    sitemap += "    <changefreq>daily</changefreq>\n";
    sitemap += "    <priority>1.0</priority>\n";
    sitemap += "  </url>\n";

    // Add category pages
    for (const category of categories) {
      sitemap += "  <url>\n";
      sitemap += `    <loc>https://thechokh.com/${category.toLowerCase()}</loc>\n`;
      sitemap += "    <changefreq>daily</changefreq>\n";
      sitemap += "    <priority>0.8</priority>\n";
      sitemap += "  </url>\n";
    }

    // Add article pages
    for (const article of articles) {
      if (article.status === "published") {
        sitemap += "  <url>\n";
        sitemap += `    <loc>https://thechokh.com/news/${article.id}</loc>\n`;
        sitemap += `    <lastmod>${
          new Date(article.date).toISOString().split("T")[0]
        }</lastmod>\n`;
        sitemap += "    <changefreq>weekly</changefreq>\n";
        sitemap += "    <priority>0.6</priority>\n";
        sitemap += "  </url>\n";
      }
    }

    sitemap += "</urlset>";
    return sitemap;
  },
};

// Export all services
export {
  LocalStorageService,
  initialArticles,
  initialPolls,
  initialQuizzes,
  initialMedia,
  initialSubscribers,
  initialComments,
  // initialComments,
  initialMenuItems,
  initialSiteSettings,
};
