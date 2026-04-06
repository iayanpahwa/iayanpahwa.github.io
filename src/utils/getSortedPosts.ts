import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";

const getSortedPosts = (
  posts: CollectionEntry<"blog">[],
  sortBy: "published" | "modified" = "modified"
) => {
  return posts.filter(postFilter).sort((a, b) => {
    const da =
      sortBy === "published"
        ? new Date(a.data.pubDatetime)
        : new Date(a.data.modDatetime ?? a.data.pubDatetime);
    const db =
      sortBy === "published"
        ? new Date(b.data.pubDatetime)
        : new Date(b.data.modDatetime ?? b.data.pubDatetime);
    return Math.floor(db.getTime() / 1000) - Math.floor(da.getTime() / 1000);
  });
};

export default getSortedPosts;
