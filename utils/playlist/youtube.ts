import { youtube_v3 } from 'googleapis';

if (!process.env.YOUTUBE_API_KEY) {
    console.error('not found YOUTUBE_API_KEY');
}
const youtube = new youtube_v3.Youtube({
    auth: process.env.YOUTUBE_API_KEY || 'AIzaSyDjDkjMc88MWXZ-b8I_47XoARzmmdjpi_Q'
});

export default youtube;