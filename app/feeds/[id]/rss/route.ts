import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request,{ params }: { params: { id: string } }) {

  console.log(params.id);
  const supabase = await createClient();


  const { data: feed, error } = await supabase
    .from('feeds')
    .select('*').eq('uuid', params.id)
    .single();

  if (error) {
    console.log(error);
    return new Response(null, {status: 404});
  }

  if(!feed) {
    console.info('no feed found')
    return new Response(null, {status: 404});
  }

  // Response.send(feed.rss.rss);
  const header = new Headers({
    "Content-Type": "text/xml",
  });
  return new Response(feed.rss, {headers: header});
}