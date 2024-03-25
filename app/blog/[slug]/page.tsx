import { PostBody } from "@/components/ui/Post/PostBody";
import { BlogHeader } from "@/components/ui/Blog/BlogHeader";
import markdownToHtml, { getPostBySlug } from "@/utils/post/helper";

export default async function Blog({params}: {params: {slug: string}}) {
    const post = getPostBySlug(params.slug, "_blogs");
    const content = await markdownToHtml(post.content || "");

    return (<article className="mb-32 pt-24">
    <BlogHeader
      title={post.title}
      date={post.date}
    />
    <PostBody content={content} />
  </article>)

}