import Pricing from '@/components/ui/Pricing/Pricing';
import { createClient } from '@/utils/supabase/server';

export async function getServerSideProps() {
    const supabase = createClient();
console.log('static data fetching....')
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
        props: {
          user,
          products,
          subscription
        }
    };
}

export default async function PricingPage({user, products, subscription}) {

  return (
    <Pricing
      user={user}
      products={products ?? []}
      subscription={subscription}
    />
  );
}
