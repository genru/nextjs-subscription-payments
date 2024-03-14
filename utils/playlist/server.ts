import { Feed, Item } from 'podcast';
import youtube from "./youtube";
import { getURL } from '../helpers';

export interface PodInfo {
    feed: Feed,
    items: Item[],
}

export interface FeedInfo {
    title: string,
    description: string,
    cover: string,
    author: string,
    xml?: string,
}
// export type { Feed, Item } from 'podcast';

export async function parsePlaylist(playlist_id:string): Promise<PodInfo> {
    // youtube.playlists.list()
    const listresp = await youtube.playlists.list({
        part: ["snippet"],
        "id": [
            playlist_id
        ],
        maxResults: 5
    })

    const i = listresp.data.items?.[0].snippet;
    // console.info(i)
    // console.info(i?.thumbnails?.high?.url)
    const hostUrl = getURL();
    const feedUrl = getURL('feed.xml');
    const feedInfo: Feed = {
        title: i?.title || '',
        description: i?.description || '',
        feedUrl: feedUrl,
        imageUrl: i?.thumbnails?.high?.url || '',
        siteUrl: hostUrl,
        author: i?.channelTitle || '',
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
        itunesImage: i?.thumbnails?.high?.url || 'https://pub-864077fe49bd4dcc9c269108cb2dbbe3.r2.dev/itunes-default-thumbnail.png',
        customNamespaces: {},
        customElements: []
    }
    const feedItem: Item[] = [];

    const resp = await youtube.playlistItems.list({
        part: ['snippet', 'id', 'contentDetails'],
        playlistId: playlist_id,
        maxResults: 15,
    });
    const snippet = resp.data.items?.map((i) => i.snippet)
    const resources = snippet?.filter(i => i?.title!=='Private video')
    // console.info(resources)
    if (resources && resources.length > 0) {
        for (const i of resources) {
            // const vid = i?.resourceId?.videoId;
            feedItem.push({
                title: i?.title || '',
                description: i?.description || '',
                url: 'https://cdn.listenbox.app/a/pO_zFgNFmW9.m4a?show_id=Mv8WH2tRjoeO',
                guid: i?.resourceId?.videoId || '',
                date: i?.publishedAt || '',
                author: i?.channelTitle || '',
                enclosure: {
                    url: 'https://cdn.listenbox.app/a/pO_zFgNFmW9.m4a?show_id=Mv8WH2tRjoeO',
                    type: 'audio/x-m4a',
                    size: 0,
                },
                itunesImage: i?.thumbnails?.high?.url || 'https://pub-864077fe49bd4dcc9c269108cb2dbbe3.r2.dev/itunes-default-thumbnail.png',
                itunesTitle: i?.title || '',
                itunesAuthor: i?.videoOwnerChannelTitle || 'Max Nowack',
                itunesExplicit: false,
                itunesSubtitle: 'I am a sub title',
                itunesSummary: i?.description || 'I am a summary',
                itunesDuration: 12345,
                itunesNewFeedUrl: 'https://newlocation.com/example.rss',
            });
        }

    }
    return {feed: feedInfo, items:feedItem};
}