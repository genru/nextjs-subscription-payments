'use client';

import Card from '@/components/ui/Card';
import { updateName } from '@/utils/auth-helpers/server';
import { handleRequest, linkUserIdentity } from '@/utils/auth-helpers/client';
import { useRouter, redirect } from 'next/navigation';
import { useState } from 'react';
import { postData } from '@/utils/helpers';

export default function AuthForm({ userName }: { userName: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('submitting', e.currentTarget);
    setIsSubmitting(true);
    await linkUserIdentity(e)
    // Check if the new name is the same as the old name
    // if (e.currentTarget.fullName.value === userName) {
    //   e.preventDefault();
    //   setIsSubmitting(false);
    //   return;
    // }
    // handleRequest(e, updateName, router);

    // const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    // url.searchParams.append("client_id", '583784763044-e9da75e7gmp3g7u2homee1rdhjr37c76.apps.googleusercontent.com');
    // url.searchParams.append("response_type", 'token');
    // url.searchParams.append("scope", 'https://www.googleapis.com/auth/youtube.readonly');
    // url.searchParams.append("prompt", 'consent');
    // url.searchParams.append("redirect_uri", 'https://1f4a-42-3-25-12.ngrok-free.app/auth/callback');
    // console.info(url.toString())
    // // alert(url.toString())
    // router.push(url.toString());
    setIsSubmitting(false);
  };

  return (
    <Card
      title="Your Youtube Channel"
      description="Please enter your full name, or a display name you are comfortable with."
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">bind youtube channel</p>
          <button className='d-btn d-btn-neutral d-btn-wide' type="submit" form="authForm">
            {isSubmitting? (<span className="d-loading d-loading-spinner"></span>): "Request permit"}
          </button>

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
