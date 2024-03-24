'use client';

import Card from '@/components/ui/Card';
import { useRouter, redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getStatusRedirect, getURL, postData } from '@/utils/helpers';
import { getAuthorizationUrl } from '@/utils/google/server';

export default function GoogleForm({ authorizationUrl }: { authorizationUrl: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [authUrl, setAuthUrl] = useState('');

  // useEffect(() => {
  //   getAuthorizationUrl().then(url => {
  //       setAuthUrl(url);
  //   });
  // })
    const redirect_uri = getURL('/auth/google');


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>|null) => {
    // console.log('submitting', e.currentTarget);
    setIsSubmitting(true);
    try {
        const popup = window.open(authorizationUrl, "popup", "popup=true,height=550,width=500");
        let finished = false;
        const checkPopup = setInterval(() => {
          try {
            console.log(popup?.window.location || 'no location available');
            if(popup?.window?.location.href.includes(redirect_uri)) {
                popup.close();
                finished = true;
            }
            if(!popup || !popup.closed) return;
            clearInterval(checkPopup);
            setIsSubmitting(false);
            const redirectPath = finished ? getStatusRedirect('/account', 'Success!', 'Youtube are connected.')
              :getStatusRedirect('/account', 'Oops!', 'User canncelled');
            router.push(redirectPath);
          } catch (e) {
            console.warn('ignore...', e);
          }
        },1000)

    } catch(err) {
        console.error('error caught:',err);
    }
  };
console.info('google form loaded successfully')
  return (
    <Card
      title="Your Youtube Channel"
      description="Please enter your full name, or a display name you are comfortable with."
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">bind youtube channel</p>
          <button className='d-btn d-btn-neutral d-btn-wide' onClick={() => handleSubmit(null)} form="authForm1">
            {isSubmitting? (<span className="d-loading d-loading-spinner"></span>): "Request permit"}
          </button>
            {/* <a href={authUrl} className='d-btn d-btn-neutral d-btn-wide' target="_blank"> Youtube</a> */}
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        <form id="authForm" onSubmit={handleSubmit} >
          <input
            type="hidden"
            name="provider"
            value={'google'}
            className="w-1/2 p-3 rounded-md d-input d-input-bordered"
          />
          <input
            type="hidden"
            name="scope"
            value={'https://www.googleapis.com/auth/youtube.readonly'}
            className="w-1/2 p-3 rounded-md d-input d-input-bordered"
          />
          <input
            type="hidden"
            name="response_type"
            value={'code'}
            className="w-1/2 p-3 rounded-md d-input d-input-bordered"
          />
          <input
            type="hidden"
            name="redirect_uri"
            value={'http://localhost:3000/auth/callback'}
            className="w-1/2 p-3 rounded-md d-input d-input-bordered"
          />
        </form>
      </div>
    </Card>
  );
}
