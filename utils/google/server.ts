'use server'
import { google } from "googleapis";
import { getURL } from "../helpers";
import { ChannelInfo, channleList } from "../playlist/youtube";

const redirectUrl = getURL('/auth/google');
console.log(redirectUrl);
// const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_AUTH_CLIENT_ID!,
//     process.env.GOOGLE_AUTH_CLIENT_SECRET!,
//     redirectUrl
// );

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_AUTH_CLIENT_ID!,
    process.env.GOOGLE_AUTH_CLIENT_SECRET!,
    redirectUrl
);

const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly'
];

async function getAuthorizationUrl() {
    const url =await oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        /** Pass in the scopes array defined above.
          * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
        scope: scopes,
        prompt: 'consent',      // get refresh token.
        // Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes: true
    });
    // console.info(url);
    return url;
}

async function finishAuth(code: string) {
    let { tokens } = await oauth2Client.getToken(code);
    console.info('finishAuth',tokens);
    oauth2Client.setCredentials(tokens);
    return tokens;
}

async function getMyChannel(): Promise<ChannelInfo> {

    return channleList(oauth2Client)
}

export {
    getAuthorizationUrl,
    finishAuth,
    getMyChannel
    // oauth2Client
}