'use client';

import Button from '@/components/ui/Button';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { createStripePortal } from '@/utils/stripe/server';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { Tables } from '@/types_db';
import { cancelSubscription } from '@/utils/paddle/server';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}

export default function CustomerPortalForm({ subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    return router.push(redirectUrl);
  };

  const cancelCurrentSubscription = async () => {
    if(!subscription) {
      return;
    }
    setIsSubmitting(true);
    const redirectUrl = await cancelSubscription(currentPath, subscription?.id)
    setIsSubmitting(false);
    return router.push(redirectUrl);

  }

  if (subscription)  {
    return (
      <Card
        title="Your Plan"
        subscription={subscription?.prices?.products?.name}
        description={
          subscription
            ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
            : 'You are not currently subscribed to any plan.'
        }
        footer={
          <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <p className="pb-4 sm:pb-0">current period will end at <span className='d-badge d-badge-neutral'>{new Date(subscription?.current_period_end).toLocaleDateString('en-US',{ weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
            <button className='d-btn d-btn-neutral d-btn-wide' onClick={cancelCurrentSubscription}>
              {isSubmitting? (<span className="d-loading d-loading-spinner"></span>): "Cancel Subscription"}
            </button>
          </div>
        }
      >
        <div className="mt-8 mb-4 text-xl font-semibold">
          {subscription ? (
            // `${subscriptionPrice}/${subscription?.prices?.interval}`
            subscription?.prices?.products?.name
          ) : (
            <Link href="/pricing">Choose your plan</Link>
          )}
        </div>
      </Card>
    )
  } else {
    return (
      <Card
        title="Your Plan"
        description={
            'You are not currently subscribed to any plan.'
        }
        footer={
          <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <p className="pb-4 sm:pb-0"></p>
            <Link href="/pricing" className='d-btn d-btn-neutral d-btn-wide'>Choose your plan</Link>
          </div>
        }
      >
        <div className="mt-8 mb-4 text-xl font-semibold">
            {/* <Link href="/pricing">Choose your plan</Link> */}
        </div>
      </Card>
    )
  }
}
