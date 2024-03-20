'use client';

import Button from '@/components/ui/Button';
import { signInWithOAuth } from '@/utils/auth-helpers/client';
import { type Provider } from '@supabase/supabase-js';
import { Github } from 'lucide-react';
import { JSX, SVGProps, useState } from 'react';

type OAuthProviders = {
  name: Provider;
  displayName: string;
  icon: JSX.Element;
};

function Google(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>)
}

export default function OauthSignIn() {
  const oAuthProviders: OAuthProviders[] = [
    // {
    //   name: 'github',
    //   displayName: 'GitHub',
    //   icon: <Github className="h-5 w-5" />
    // },
    /* Add desired OAuth providers here */
    {
      name: 'google',
      displayName: 'Google',
      icon: <Google className="h5 w-5" />
    }
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await signInWithOAuth(e);
    setIsSubmitting(false);
  };

  return (
    <div className="mt-8">
      {oAuthProviders.map((provider) => (
        <form
          key={provider.name}
          className="pb-2"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input type="hidden" name="provider" value={provider.name} />
          <button
            type="submit"
            className="w-full d-btn"
          >
            {isSubmitting? (<span className="d-loading d-loading-spinner"></span>):(<><span className="mr-2">{provider.icon}</span><span>{provider.displayName}</span></>)}

          </button>
        </form>
      ))}
    </div>
  );
}
