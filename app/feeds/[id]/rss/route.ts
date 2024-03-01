import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export async function GET(request: Request,{ params }: { params: { id: string } }) {

  const { searchParams } = new URL(request.url)
  console.log(params.id);
  console.log(searchParams);
  const supabase = await createClient();


  const { data: feed, error } = await supabase
    .from('feeds')
    .select('*').eq('uuid', params.id)
    .single();

  if (error) {
    console.log(error);
    // return Response.error({status: 404})
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