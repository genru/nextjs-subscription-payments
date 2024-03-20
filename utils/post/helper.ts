// import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

import { join } from "path";

// const postsDirectory = join(process.cwd(), "_posts");

export type Post = {
    slug: string;
    title: string;
    date: string;
    coverImage: string;
    // author: Author;
    excerpt: string;
    ogImage: {
      url: string;
    };
    content: string;
    preview?: boolean;
  };
export function getPostSlugs(rootDir: string="_posts") {
  return fs.readdirSync(join(process.cwd(), rootDir));
}

export function getPostBySlug(slug: string, rootDir: string="_posts") {
  const realSlug = slug.replace(/\.md$/, "");
  const postsDirectory = join(process.cwd(), rootDir);
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Post;
}

export function getAllPosts(rootDir: string="_posts"): Post[] {
  const slugs = getPostSlugs(rootDir);
  const posts = slugs
    .map((slug) => getPostBySlug(slug, rootDir))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export default async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}