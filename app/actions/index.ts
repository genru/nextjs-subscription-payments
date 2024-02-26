export async function parseUrl(dataFrom: FormData) {
    'use server';
    // console.log(dataFrom);
    const targetUrl = dataFrom.get('url');
    return new Promise<string>((resolve, reject) => {
        // setTimeout(resolve, 1000*3);
        // check if url is valid
    })
}