import { PostBody } from "@/components/ui/Post/PostBody";
import { PostHeader } from "@/components/ui/Post/PostHeader";
import markdownToHtml, { getPostBySlug } from "@/utils/post/helper";

export default async function Privacy() {
    const post = getPostBySlug('privacy');
    const content = await markdownToHtml(post.content || "");

    return (<article className="mb-32 pt-24">
    <PostHeader
      title={post.title}
      date={post.date}
    />
    <PostBody content={content} />
  </article>)
}