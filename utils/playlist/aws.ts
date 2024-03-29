import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
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

const lambda = new LambdaClient({
    region: process.env.S3_API_REGION_NAME || "",
    credentials: {
        accessKeyId: process.env['S3_API_ACCESS_KEY_ID'] || "",
        secretAccessKey: process.env['S3_API_SECRET_ACCESS_KEY'] || ""
    }
});

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
    const webhookHost = process.env["AWS_YOUTUBE_DOWNLOADER_WEBHOOK_HOST"];
    if (!webhookHost) {
        throw new Error('AWS_YOUTUBE_DOWNLOADER_WEBHOOK_HOST must be specified');
    }
    const event = {mediaId: mediaId, feedId: feedId, id:id, webhookHost: webhookHost}
    return invoke(event);
    // return fetch(url, {
    //     method: 'POST',
    //     body: JSON.stringify(event)
    // })
}

async function invoke(event:any) {
    const command = new InvokeCommand({ // InvocationRequest
        FunctionName: "arn:aws:lambda:us-west-1:730335551004:function:aws-lambda-dome", // required
        InvocationType: "Event",
        LogType: "Tail",
        Payload: JSON.stringify(event),
    });
    const { Payload, LogResult } = await lambda.send(command);
    if (LogResult && Payload) {
        const result = Buffer.from(Payload).toString();
        const logs = Buffer.from(LogResult, "base64").toString();
        console.log(result)
        console.log(logs);
        return { logs, result };
    }
}