import Pricing from '@/components/ui/Pricing/Pricing';
import { createClient } from '@/utils/supabase/server';
import { cache } from 'react';


export default async function PricingPage() {

    async function getData() {
        'use server';
        const supabase = createClient();

        const {
          data: { user }
        } = await supabase.auth.getUser();

        const { data: subscription, error } = await supabase
          .from('subscriptions')
          .select('*, prices(*, products(*))')
          .in('status', ['trialing', 'active'])
          .maybeSingle();
        if (error) {
          console.log(error);
        }

        const { data: products } = await supabase
          .from('products')
          .select('*, prices(*)')
          .eq('active', true)
          .eq('prices.active', true)
          .order('metadata->index')
          .order('unit_amount', { referencedTable: 'prices' });


        return {
              user,
              products,
              subscription
        };

    }
    const fetchData = cache(getData);
    const {user, products, subscription} = await fetchData();
  return (
    <Pricing
      user={user}
      products={products ?? []}
      subscription={subscription}
    />
  );
}
