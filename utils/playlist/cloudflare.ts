import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import assert from "assert";
import { Readable } from "stream";

assert(process.env["R2_API_ENDPOINT_URL"], 'R2_API_ENDPOINT_URL must be specified');
assert(process.env["R2_API_ACCESS_KEY_ID"], 'R2_API_ACCESS_KEY_ID must be specified');
assert(process.env["R2_API_SECRET_ACCESS_KEY"], 'R2_API_SECRET_ACCESS_KEY must be specified');

const s3 = new S3Client({
    region: "auto",
    endpoint: process.env['R2_API_ENDPOINT_URL'],
    credentials: {
        accessKeyId: process.env['R2_API_ACCESS_KEY_ID'] || "",
        secretAccessKey: process.env['R2_API_SECRET_ACCESS_KEY'] || ""
    }
})

export function getPreSignedUrl(key: string, expiresIn?: number): Promise<string> {
    return getSignedUrl(s3, new GetObjectCommand({
        Bucket: 'poddiy-audio',
        Key: key,
    }), { expiresIn: expiresIn });
}

export function uploadStorage(key: string, stream: Readable|Buffer) {
    return s3.send(new PutObjectCommand({
        Bucket: 'poddiy-audio',
        Key: key,
        Body: stream,
        ContentType: 'audio/mpeg',
    }));
}

