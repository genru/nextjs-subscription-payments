import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import assert from "assert";
import { Readable } from "stream";

assert(process.env["S3_API_REGION_NAME"], 'S3_API_REGION_NAME must be specified');
assert(process.env["S3_API_ACCESS_KEY_ID"], 'S3_API_ACCESS_KEY_ID must be specified');
assert(process.env["S3_API_SECRET_ACCESS_KEY"], 'S3_API_SECRET_ACCESS_KEY must be specified');
assert(process.env["AWS_YOUTUBE_DOWNLOADER_URL"]);

const s3 = new S3Client({
    region: process.env.S3_API_REGION_NAME || "",
    endpoint: `https://s3.${process.env.S3_API_REGION_NAME}.amazonaws.com`,
    credentials: {
        accessKeyId: process.env['S3_API_ACCESS_KEY_ID'] || "",
        secretAccessKey: process.env['S3_API_SECRET_ACCESS_KEY'] || ""
    }
})

export function getPreSignedUrl(key: string, expiresIn?: number): Promise<string> {
    return getSignedUrl(s3, new GetObjectCommand({
        Bucket: 'poddiy',
        Key: key,
    }), { expiresIn: expiresIn });
}

export function uploadStorage(key: string, stream: Readable|Buffer) {
    return s3.send(new PutObjectCommand({
        Bucket: 'poddiy',
        Key: key,
        Body: stream,
        ContentType: 'audio/mpeg',
    }));
}

export function processYoutubeMediaUrl(id: string, feedId: string, mediaId: string) {
    const url = process.env["AWS_YOUTUBE_DOWNLOADER_URL"];
    if (!url) {
        throw new Error('AWS_YOUTUBE_DOWNLOADER_URL must be specified');
    }
    return fetch(url, {
        method: 'POST',
        body:JSON.stringify({mediaId: mediaId, feedId: feedId, id:id, webhookHost: '1f4a-42-3-25-12.ngrok-free.app'})
    })
}