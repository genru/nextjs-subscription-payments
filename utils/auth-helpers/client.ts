'use client';

import { createClient } from '@/utils/supabase/client';
import { type Provider } from '@supabase/supabase-js';
import { getURL } from '@/utils/helpers';
import { redirectToPath } from './server';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const supabase = createClient();
supabase.auth.onAuthStateChange((event, session) => {
  console.info(event, session);
  if (session && session.provider_token) {
    window.localStorage.setItem('oauth_provider_token', session.provider_token)
  }

  if (session && session.provider_refresh_token) {
    window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token)
  }

  if (event === 'SIGNED_OUT') {
    window.localStorage.removeItem('oauth_provider_token')
    window.localStorage.removeItem('oauth_provider_refresh_token')
  }
})

export async function handleRequest(
  e: React.FormEvent<HTMLFormElement>,
  requestFunc: (formData: FormData) => Promise<string>,
  router: AppRouterInstance | null = null
): Promise<boolean | void> {
  // Prevent default form submission refresh
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const redirectUrl: string = await requestFunc(formData);

  if (router) {
    // If client-side router is provided, use it to redirect
    return router.push(redirectUrl);
  } else {
    // Otherwise, redirect server-side
    return await redirectToPath(redirectUrl);
  }
}

export async function signInWithOAuth(e: React.FormEvent<HTMLFormElement>) {
  // Prevent default form submission refresh
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const provider = String(formData.get('provider')).trim() as Provider;
  // Create client-side supabase client and call signInWithOAuth

  const redirectURL = getURL('/auth/callback');
  await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      scopes: "https://www.googleapis.com/auth/youtube.readonly",
      redirectTo: redirectURL,
      queryParams: {
        prompt: 'select_account',
        access_type: 'offline'
      }
    }
  });
}

export async function linkUserIdentity(e: React.FormEvent<HTMLFormElement>) {
  const formData = new FormData(e.currentTarget);
  const provider = String(formData.get('provider')).trim() as Provider;
  const scope = String(formData.get('scope')).trim();
  console.info('link user identity', provider, scope);
  // const supabase = createClient();
  const redirectURL = getURL('/auth/google');
  const resp = await supabase.auth.linkIdentity({
    provider: provider,
    options: {
      scopes: scope,
      redirectTo: redirectURL,
      queryParams: {
        prompt: 'select_account',
      }
    }
  });

  console.info(resp.data, resp.error);
}