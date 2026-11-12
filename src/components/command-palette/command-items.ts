import { siteConfig } from "@/data/site-config";
import {
  Home,
  FolderGit2,
  FlaskConical,
  BookOpen,
  Mail,
  Sun,
  Moon,
  Laptop,
  Copy,
  Download,
  Github,
} from "lucide-react";

export interface CommandAction {
  id: string;
  title: string;
  keywords?: string[];
  icon: React.ComponentType<{ className?: string }>;
  group: "navigation" | "theme" | "actions";
  shortcut?: string;
  perform: (helpers: {
    router: { push: (url: string) => void };
    setTheme: (theme: "light" | "dark" | "system") => void;
    copy: (text: string) => Promise<boolean>;
    close: () => void;
  }) => void;
}

export const commandItems: CommandAction[] = [
  // Navigation
  {
    id: "nav-home",
    title: "Về Trang chủ",
    keywords: ["home", "trang chu", "chinh"],
    icon: Home,
    group: "navigation",
    perform: ({ router, close }) => {
      router.push("/");
      close();
    },
  },
  {
    id: "nav-projects",
    title: "Xem Dự án",
    keywords: ["projects", "du an", "case study", "portfolio"],
    icon: FolderGit2,
    group: "navigation",
    perform: ({ router, close }) => {
      router.push("/projects");
      close();
    },
  },
  {
    id: "nav-lab",
    title: "Component Lab",
    keywords: ["lab", "component", "ui", "playground", "thu nghiem"],
    icon: FlaskConical,
    group: "navigation",
    perform: ({ router, close }) => {
      router.push("/lab");
      close();
    },
  },
  {
    id: "nav-guestbook",
    title: "Sổ lưu niệm (Guestbook)",
    keywords: ["guestbook", "so luu niem", "loi nhan"],
    icon: BookOpen,
    group: "navigation",
    perform: ({ router, close }) => {
      router.push("/guestbook");
      close();
    },
  },
  {
    id: "nav-contact",
    title: "Liên hệ",
    keywords: ["contact", "lien he", "email", "gui tin"],
    icon: Mail,
    group: "navigation",
    perform: ({ router, close }) => {
      router.push("/contact");
      close();
    },
  },

  // Theme
  {
    id: "theme-light",
    title: "Giao diện sáng (Light Mode)",
    keywords: ["light", "sang", "trang", "theme"],
    icon: Sun,
    group: "theme",
    perform: ({ setTheme, close }) => {
      setTheme("light");
      close();
    },
  },
  {
    id: "theme-dark",
    title: "Giao diện tối (Dark Mode)",
    keywords: ["dark", "toi", "den", "theme"],
    icon: Moon,
    group: "theme",
    perform: ({ setTheme, close }) => {
      setTheme("dark");
      close();
    },
  },
  {
    id: "theme-system",
    title: "Theo hệ thống (System)",
    keywords: ["system", "he thong", "tu dong", "theme"],
    icon: Laptop,
    group: "theme",
    perform: ({ setTheme, close }) => {
      setTheme("system");
      close();
    },
  },

  // Actions
  {
    id: "action-copy-email",
    title: "Sao chép địa chỉ Email",
    keywords: ["copy", "email", "sao chep", "mail"],
    icon: Copy,
    group: "actions",
    perform: async ({ copy, close }) => {
      await copy(siteConfig.email);
      close();
    },
  },
  {
    id: "action-download-resume",
    title: "Tải bản CV (PDF)",
    keywords: ["cv", "resume", "tai", "download", "pdf"],
    icon: Download,
    group: "actions",
    perform: ({ close }) => {
      const link = document.createElement("a");
      link.href = siteConfig.resumePath;
      link.download = siteConfig.resumeFileName;
      link.click();
      close();
    },
  },
  {
    id: "action-github",
    title: "Mở GitHub Profile",
    keywords: ["github", "profile", "git", "source"],
    icon: Github,
    group: "actions",
    perform: ({ close }) => {
      window.open(siteConfig.social.github, "_blank", "noreferrer");
      close();
    },
  },
];
