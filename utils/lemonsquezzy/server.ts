// const crypto = require('crypto');

import { createHmac, timingSafeEqual } from "crypto";


export async function processLemonEvent(req: Request) {

    const eventType = req.headers.get('X-Event-Name');
    const sig = req.headers.get('X-Signature');
    const rawBody = await req.text();

    if(!sig || !rawBody) {
        return new Response('Invalid request', { status: 400 });
    }

    if (!checkSignature(sig, rawBody)) {
        return new Response('Invalid signature', { status: 400 });
    }
    const eventData = JSON.parse(rawBody);
    console.log(eventData);
    return new Response("ok");
}

function checkSignature(sig: string, content: string) {
    const secret    = process.env.LEMONSQUEEZY_SIG_SECRET;
    if(!secret) {
        throw new Error(`Invalid signature secret`);
    }
    const hmac      = createHmac('sha256', secret);
    const digest    = Buffer.from(hmac.update(content).digest('hex'), 'utf8');
    const signature = Buffer.from(sig, 'utf8');
    return timingSafeEqual(digest, signature);

}