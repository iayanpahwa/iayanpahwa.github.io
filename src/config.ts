export const SITE = {
  website: "https://codensolder.com/",
  author: "Ayan Pahwa",
  profile: "https://codensolder.com/about/",
  desc: "Ayan Pahwa is a Developer Advocate writing about agentic AI systems and the live web-data layer they run on. Founder of APxTools. Work featured on Hackaday, O'Reilly, and HackerNews.",
  title: "CodeNSolder",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 5,
  postPerPage: 7,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "UTC",
} as const;

export const GISCUS = {
  repo: "iayanpahwa/iayanpahwa.github.io" as const,
  repoId: "R_kgDOR5dMwQ",
  category: "Announcements",
  categoryId: "DIC_kwDOR5dMwc4C6qWJ",
  mapping: "pathname" as const,
  strict: false,
  reactionsEnabled: true,
  emitMetadata: false,
  inputPosition: "bottom" as const,
  lightTheme: "noborder_light",
  darkTheme: "noborder_dark",
  lang: "en",
} as const;
