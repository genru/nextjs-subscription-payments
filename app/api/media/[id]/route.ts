import ytstream from 'yt-stream';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    const video =  await ytstream.stream(`https://www.youtube.com/watch?v=${id}`, {
        quality: 'high',
        type: 'audio',
        highWaterMark: 0,
        download: true
    });

    console.log('streaming', id);
    console.log(video.url);
    const resp = await fetch(video.url);
    const ret = new Response(resp.body, { headers: {"content-type": 'audio/mpeg' }});
    return ret;
}