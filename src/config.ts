export const SITE = {
  website: "https://codensolder.com/",
  author: "Ayan Pahwa",
  profile: "https://codensolder.com/about/",
  desc: "Maker projects and hardware hacking: IoT, embedded Linux, CircuitPython, and DIY electronics by Ayan Pahwa.",
  title: "CodeNSolder",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 5,
  postPerPage: 5,
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
