// Content data models
export interface IUser {
  exp: number;
  iat: number;
  role: string;
  userEmail: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "editor" | "reporter" | "user";
  language: "en" | "bn";
  phone: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  createdAt?: string;
}
export interface IArticle {
  _id: string;
  title: string;
  media?: string[];
  author?: string;
  category: string | Category; // ✅ fix is here
  publishDate?: string;
  subTitle?: string;
  tags?: string[];
  description?: string;
  language?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface Article {
  _id: string;
  title: string;
  subTitle: string;
  description: string;
  author: string;
  category: string;
  publishDate: string;
  status: "published" | "archived";
  // type: "news" | "opinion" | "analysis" | "feature";
  feature: boolean;
  tags: string[];
  media: string[];
  language?: "en" | "bn";
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  language: "en" | "bn";
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  language: "en" | "bn";
}

export interface IMultimedia {
  _id?: string;
  title: string;
  videoId: string;
  isActive: boolean;
}
interface PollOption {
  option: string;
  votes: number;
}

// Poll Interface
export interface IPoll {
  _id?: string;
  question: string;
  options: PollOption[];
}
export interface IOption {
  text: string;
  isCorrect: boolean;
}

export interface IQuestion {
  question: string;
  options: IOption[];
  explanation: string;
  points: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  language: "en" | "bn";
}

export interface IQuiz {
  _id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  passingScore: number; // percentage
  language: "en" | "bn";
  questions: IQuestion[];
}

export interface IEpaper {
  _id?: string;
  title: string;
  date: Date | string;
  file: string;
  edition?: string; // e.g., "National", "International"
  isActive?: boolean;
  thumbnail?: string;
}
export interface WeatherSettings {
  apiKey: string;
  locations: string[];
  refreshInterval: number;
}

export interface ClimateSettings {
  co2: number;
  tempRise: number;
  seaLevel: number;
  arcticIce: number;
  tempData: {
    year: number;
    temp: number;
  }[];
}
export interface IJobPost {
  _id?: string;
  title: string;
  description: string;
  requirements: string[];
  company: string;
  location: string;
  salary: string;
  applicationDeadline: Date;
  contactEmail: string;
  jobType: "full-time" | "part-time" | "contract" | "freelance" | "internship";
  category: string;
  experienceLevel: "entry" | "mid" | "senior" | "executive";
  education?: string[];
  skills?: string[];
  image?: string;
  isActive: boolean;
  createdAt?: any;
  filter?: any;
}
export interface MarketSettings {
  markets: {
    id: string;
    name: string;
    refreshInterval: number;
  }[];
  stocks: {
    symbol: string;
    name: string;
    market: string;
  }[];
}

export interface NewsletterSubscriber {
  email: string;
  isSubscribed: boolean;
  createdAt?: string;
}
export interface IAd {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  targetUrl: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  type: "banner" | "sidebar" | "popup" | "inline" | "sponsored";
  status: "active" | "inactive" | "pending" | "rejected" | "expired";
  startDate: Date;
  endDate: Date;
  priority: number;
}

export interface Ad {
  id: string;
  title: string;
  name: string;
  targetUrl: string;
  type: "banner" | "sidebar" | "in-article";
  imageUrl: string;
  position: string;
  impressions: number;
  clicks: number;
  status: "active" | "inactive";
  linkUrl: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface Comment {
  _id: string;
  news: string;
  comment: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface SiteSettings {
  id: string;
  siteName: {
    en: string;
    bn: string;
  };
  siteDescription: {
    en: string;
    bn: string;
  };
  logo: string;
  favicon: string;
  contactEmail: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  seoSettings: {
    defaultTitle: string;
    defaultDescription: string;
    defaultKeywords: string;
    googleAnalyticsId: string;
  };
  themeSettings: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  commentSettings: {
    enabled: boolean;
    requireApproval: boolean;
    allowGuests: boolean;
  };
  defaultLanguage: "en" | "bn";
}
