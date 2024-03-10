import { getURL } from "@/utils/helpers";
import { findFeedMedia } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { Podcast } from "podcast";
import { cache } from "react";

const loadRss = cache(async (feed_uuid: string) => {
  console.info(feed_uuid)
  const supabase = await createClient();

  const { data: feed, error } = await supabase
    .from('feeds')
    .select('*').eq('uuid', feed_uuid)
    .single();

  if (error) {
    console.log(error);
    return new Response(null, {status: 404});
  }

  if(!feed) {
    console.info('no feed found')
    return new Response(null, {status: 404});
  }
  const medias = await findFeedMedia(feed.uuid);
  const hostUrl = getURL();
  const feedUrl = getURL('feed.xml');

  const pod = new Podcast({
      title: feed?.title || '',
      description: feed?.description || '',
      feedUrl: feedUrl,
      imageUrl: feed?.cover || '',
      siteUrl: hostUrl,
      author: feed.author || '',
      // categories: ['News', 'Sports'],
      language: 'en',
      // explicit: false,
      itunesAuthor: 'poddiy',
      itunesSubtitle: 'I am a sub title',
      itunesSummary: 'I am a summary',
      itunesOwner: { name: 'poddy', email: 'hi@poddiy.io' },
      itunesExplicit: false,
      itunesCategory: [{
          text: 'Entertainment',
          subcats: [{
              text: 'Television'
          }]
      }],
      itunesImage: feed?.cover || 'https://pub-864077fe49bd4dcc9c269108cb2dbbe3.r2.dev/itunes-default-thumbnail.png',
      customNamespaces: {},
      customElements: []
  })
  medias.forEach(i => {
    pod.addItem({
      title: i?.title || '',
      description: i?.description || '',
      url: `https://www.youtube.com/watch?v=${i.guid}` || '',
      guid: i?.guid || '',
      date: i?.created_at || '',
      author: i?.author || '',
      enclosure: {
          url: i.url || 'https://cdn.listenbox.app/a/pO_zFgNFmW9.m4a?show_id=Mv8WH2tRjoeO',
          type: 'audio/x-m4a',
          size: 0,
      },
      itunesImage: i?.cover || 'https://pub-864077fe49bd4dcc9c269108cb2dbbe3.r2.dev/itunes-default-thumbnail.png',
      itunesTitle: i?.title || '',
      itunesAuthor: i?.author || 'Max Nowack',
      itunesExplicit: false,
      itunesSubtitle: 'I am a sub title',
      itunesSummary: i?.description || 'I am a summary',
      itunesDuration: i.duration_in_sec,
      itunesNewFeedUrl: 'https://newlocation.com/example.rss',
    });
  });
  feed.rss = pod.buildXml();
  // Response.send(feed.rss.rss);
  const header = new Headers({
    "Content-Type": "text/xml",
  });
  return new Response(feed.rss, {headers: header});

})
export async function GET(request: Request,{ params }: { params: { id: string } }) {

  return loadRss(params.id);
}