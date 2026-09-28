export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "الرئيسية", href: "#hero" },
  { label: "المكتبة", href: "#library" },
  { label: "الأنشطة", href: "#activities" },
  { label: "المقالات", href: "#articles" },
  { label: "من نحن", href: "#about" },
  { label: "تواصل معنا", href: "#contact" },
];

export interface SocialLink {
  src: string;
  size: number;
  alt: string;
  href: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { src: "/assets/d0ed9.svg", size: 22.752, alt: "Linktree", href: "#" },
  { src: "/assets/a0434.svg", size: 28.739, alt: "Instagram", href: "#" },
  { src: "/assets/b6fc4.svg", size: 28.739, alt: "TikTok", href: "#" },
  { src: "/assets/bea32.svg", size: 32.331, alt: "LinkedIn", href: "#" },
  { src: "/assets/8bac5.svg", size: 27.541, alt: "Facebook", href: "#" },
];
