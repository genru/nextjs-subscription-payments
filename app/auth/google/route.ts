import { createClient } from '@/utils/supabase/server';
import { NextRequest } from 'next/server';
import { finishAuth, getMyChannel } from '@/utils/google/server';

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  console.info('callback invoked', requestUrl)
  const code = requestUrl.searchParams.get('code');
  if (code) {
    const supabase = createClient();

    const {data: {user}} = await supabase.auth.getUser();
    if(user) {
        const token = await finishAuth(code);

        const channelInfo = await getMyChannel();
        // console.info(channelInfo);
        const {error } = await supabase.from('users').update({yt_channel: channelInfo}).eq('id', user.id);
        if(error) {
            console.error(error);
        }
    }
  }

  // URL to redirect to after sign in process completes
  return new Response();
//   return NextResponse.redirect(
//     getStatusRedirect(
//       `${requestUrl.origin}/account`,
//       'Success!',
//       'You are now signed in.'
//     )
//   );
}

