import { youtube_v3, Common } from 'googleapis';
// import { OAuth2Client } from 'googleapis-common';

if (!process.env.YOUTUBE_API_KEY) {
    console.error('not found YOUTUBE_API_KEY');
}
const youtube = new youtube_v3.Youtube({
    auth: process.env.YOUTUBE_API_KEY
});

export type ChannelInfo = {
    channelTitle?: string,
    publishedAt?: string,
    imageUrl?: string,
    playlistId?: string,
}

export async function channleList(oauth2Client: Common.OAuth2Client) {
    const {data} = await youtube.channels.list({
        auth: oauth2Client,
        "part": [
            "contentDetails",
            "snippet"
          ],
          "mine": true
    });
    const channel = data.items && data.items[0];
    let channelTitle = channel?.snippet?.title || undefined;
    let publishedAt = channel?.snippet?.publishedAt || undefined;
    let imageUrl = channel?.snippet?.thumbnails?.high?.url || undefined;
    let playlistId = channel?.contentDetails?.relatedPlaylists?.uploads || undefined;
    // const channel = items[0];
    return {channelTitle, publishedAt, imageUrl, playlistId}

}
export default youtube;