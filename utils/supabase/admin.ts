import { toDateTime } from '@/utils/helpers';
import { stripe } from '@/utils/stripe/config';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import Stripe from 'stripe';
import type { Database, Json, Tables, TablesInsert } from 'types_db';
import { FeedInfo } from '../playlist/server';
import { AddressNotification, PriceNotification, ProductNotification, SubscriptionNotification } from '@paddle/paddle-node-sdk';
// import { Stream } from 'stream';

type Product = Tables<'products'>;
type Price = Tables<'prices'>;

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const upsertProductRecord = async (product: Stripe.Product|ProductNotification) => {
  let productData: Product
  if('active' in product) {
    productData = {
      id: product.id,
      active: product.active,
      name: product.name,
      description: product.description,
      image: product.images?.[0] ?? null,
      metadata: product.metadata
    };
  } else {
    productData = {
      id: product.id,
      active: product.status=='active',
      name: product.name,
      description: product.description,
      image: product.imageUrl,
      metadata: product.customData as Json
    };

  }

  const { error: upsertError } = await supabaseAdmin
    .from('products')
    .upsert([productData]);
  if (upsertError)
    throw new Error(`Product insert/update failed: ${upsertError}`);
    console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (
  price: Stripe.Price | PriceNotification,
  retryCount = 0,
  maxRetries = 3
) => {
  let priceData: Price;
  if('active' in price) {
    priceData = {
      id: price.id,
      description: '',
      metadata: price.metadata,
      product_id: typeof price.product === 'string' ? price.product : '',
      active: price.active,
      currency: price.currency,
      type: price.type,
      unit_amount: price.unit_amount ?? null,
      interval: price.recurring?.interval ?? null,
      interval_count: price.recurring?.interval_count ?? null,
      trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS
    };
  } else {
    priceData = {
      id: price.id,
      description: price.description,
      metadata: price.customData as Json,
      product_id: price.productId,
      active: price.status === 'active',
      currency: price.unitPrice.currencyCode.toLowerCase(),
      type: price.billingCycle?'recurring': 'one_time',
      unit_amount: +price.unitPrice.amount,
      interval: price.billingCycle?.interval ?? null,
      interval_count: price.billingCycle?.frequency ?? null,
      trial_period_days: price.trialPeriod?.frequency ?? TRIAL_PERIOD_DAYS
    };
  }

  const { error: upsertError } = await supabaseAdmin
    .from('prices')
    .upsert([priceData]);

  if (upsertError?.message.includes('foreign key constraint')) {
    if (retryCount < maxRetries) {
      console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await upsertPriceRecord(price, retryCount + 1, maxRetries);
    } else {
      throw new Error(
        `Price insert/update failed after ${maxRetries} retries: ${upsertError}`
      );
    }
  } else if (upsertError) {
    throw new Error(`Price insert/update failed: ${upsertError}`);
  } else {
    console.log(`Price inserted/updated: ${price.id}`);
  }
};

const deleteProductRecord = async (product: Stripe.Product | ProductNotification) => {
  const { error: deletionError } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', product.id);
  if (deletionError)
    throw new Error(`Product deletion failed: ${deletionError}`);
  console.log(`Product deleted: ${product.id}`);
};

const deletePriceRecord = async (price: Stripe.Price | PriceNotification) => {
  const { error: deletionError } = await supabaseAdmin
    .from('prices')
    .delete()
    .eq('id', price.id);
  if (deletionError) throw new Error(`Price deletion failed: ${deletionError}`);
  console.log(`Price deleted: ${price.id}`);
};

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
  const { error: upsertError } = await supabaseAdmin
    .from('customers')
    .upsert([{ id: uuid, stripe_customer_id: customerId }]);

  if (upsertError)
    throw new Error(`Supabase customer record creation failed: ${upsertError}`);

  return customerId;
};

const upsertSubscriptionRecord = async (subscription: SubscriptionNotification) => {
  // @ts-ignore
  let uuid = subscription.customData['userId'];
  if(!uuid) {
    const {data: customer, error: customerError} = await supabaseAdmin.from('customers').select('id').eq('stripe_customer_id', subscription.customerId).single()
    if(customerError) {
      throw new Error(`Supabase customer record select failed: ${customerError}`);
    }
    uuid = customer?.id;
  }
  const subscriptionData: TablesInsert<'subscriptions'> = {
    id: subscription.id,
    user_id: uuid,
    metadata: {},//subscription.metadata,
    status: subscription.status,
    price_id: subscription.items[0].price?.id,
    //TODO check quantity on subscription

    quantity: subscription.items[0].quantity,
    cancel_at_period_end: subscription.scheduledChange && subscription.scheduledChange.action=='cancel' || false,
    cancel_at: subscription.scheduledChange && subscription.scheduledChange.effectiveAt,
      // ? toDateTime(subscription.cancel_at).toISOString()
      // : null,
    canceled_at: subscription.canceledAt,
      // ? toDateTime(subscription.canceled_at).toISOString()
      // : null,
    current_period_start: subscription.currentBillingPeriod?.startsAt,
    current_period_end: subscription.currentBillingPeriod?.endsAt,
    created: subscription.createdAt,
    ended_at: subscription.canceledAt,
    trial_start: subscription.items[0].trialDates?.startsAt,
    trial_end: subscription.items[0].trialDates?.endsAt
  };

  if(subscription.status === 'canceled') {
    delete subscriptionData.current_period_start;
    delete subscriptionData.current_period_end;
  }

  const { error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);
  if (upsertError) {
    console.log(
      `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`, upsertError
    );

    throw new Error(`Subscription insert/update failed: ${upsertError}`);
    }
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error('Stripe customer creation failed.');

  return newCustomer.id;
};

const createOrRetrieveStripeCustomer = async ({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) => {
  // Check if the customer already exists in Supabase
  const { data: existingSupabaseCustomer, error: queryError } =
    await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', uuid)
      .maybeSingle();

  if (queryError) {
    throw new Error(`Supabase customer lookup failed: ${queryError}`);
  }

  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  let stripeCustomerId: string | undefined;
  if (existingSupabaseCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.stripe_customer_id
    );
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);
  if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');

  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from('customers')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', uuid);

      if (updateError)
        throw new Error(
          `Supabase customer record update failed: ${updateError}`
        );
      console.warn(
        `Supabase customer record mismatched Stripe ID. Supabase record updated.`
      );
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
  } else {
    console.warn(
      `Supabase customer record was missing. A new record was created.`
    );

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert
    );
    if (!upsertedStripeCustomer)
      throw new Error('Supabase customer record creation failed.');

    return upsertedStripeCustomer;
  }
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] }
    })
    .eq('id', uuid);
  if (updateError) throw new Error(`Customer update failed: ${updateError}`);
};

const updateUserAddress = async (address: AddressNotification) => {
  const customerId = address.customerId;
  if (!customerId) {
    console.warn(`Customer has no customer ID`);
    return;
  }
  const {data: customerData} = await supabaseAdmin.from('customers').select("*").eq('stripe_customer_id', customerId).maybeSingle();

}

const manageStripeSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (noCustomerError)
    throw new Error(`Customer lookup failed: ${noCustomerError}`);

  const { id: uuid } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData: TablesInsert<'subscriptions'> = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    //TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscription.current_period_start
    ).toISOString(),
    current_period_end: toDateTime(
      subscription.current_period_end
    ).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null
  };

  const { error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);
  if (upsertError)
    throw new Error(`Subscription insert/update failed: ${upsertError}`);
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
};

const createFeed = async (content: FeedInfo, userId: string, source: string) => {
  const feed: TablesInsert<'feeds'> = {
    // id: 1,
    created_at: (new Date()).toISOString(),
    rss: content.xml,
    title: content.title,
    author: content.author,
    description: content.description,
    cover: content.cover,
    uuid: randomUUID(),
    user_id: userId,
    source: source
  }

  const {error: insertError, data: feedData} = await supabaseAdmin.from('feeds').insert(feed);
  if (insertError) {
    console.warn(insertError, insertError.message);
    console.error(`Feed insert failed: ${insertError}`);
    throw new Error(`Feed insert failed: ${insertError}`)
  }
  return feed.uuid;
}

const findFeed = async (feedId: string) => {
  return supabaseAdmin.from('feeds').select("*").eq('uuid', feedId).single();
}

const updateFeedWithXml = async (feedId: string, feedXml: string) => {
  const {error, data: feedData} = await supabaseAdmin.from('feeds').update({rss: feedXml, status: 1}).eq('uuid', feedId).single();
  return feedData;
}

const uploadMedia = async (fileName: string, body: ReadableStream) => {
  // let f: FileBody

  return supabaseAdmin.storage.from('media').upload(fileName, body)
}

const createMedia = async (media: {feed_id:string,title: string, description: string, cover: string, author: string, source: string, guid: string, duration: number}) => {

  // const mediaUrl = getURL('api/media/' + fileName);
  const mediaObj: TablesInsert<'media'> = {
    title: media.title,
    author: media.author,
    description: media.description,
    source: media.source,
    guid: media.guid,
    // url: mediaUrl
    cover: media.cover,
    duration_in_sec: media.duration
  }
  const {error, data: mediaRow} = await supabaseAdmin.from('media').insert(mediaObj).select();

  if (error || mediaRow==null) {
    console.warn(error, error && error.message);
    console.error(`Media insert failed:`, error);
    throw new Error(`Media insert failed: ${error}`);
  }

  const feed_media: TablesInsert<'feedMedia'> = {
    feed_id: media.feed_id,
    media_id: mediaRow[0].id
  }
  const {error: feedMediaError} = await supabaseAdmin.from('feedMedia').insert(feed_media);
  if (feedMediaError) {
    console.warn(feedMediaError, feedMediaError.message);
    console.error(`FeedMedia insert failed: ${feedMediaError}`);
    throw new Error(`FeedMedia insert failed: ${feedMediaError}`);
  }

  return mediaRow[0].id;
}

const createMedias = async (feedId: string, medias: {title: string, description: string, cover: string, author: string, source: string, guid: string, duration_in_sec: number, position?: number}[]) => {

  const positions = medias.reduce((a,i) => {a[i.guid]=i.position; return a}, {} as {[key: string]: number|undefined});
  // make sure supabase accept media rows
  medias.forEach((mediaRow) => {
    delete mediaRow['position'];
  });
  // check if media exists
  const {error: errorExists, data: existMediaRows} = await supabaseAdmin.from('media').select().in('guid', medias.map(i => i.guid)).select();
  if (errorExists) {
    console.warn(errorExists, errorExists.message);
  }

  const existedGuid = existMediaRows?.map(i => i.guid);
  const resetMedias = medias.filter(i => !existedGuid?.includes(i.guid));
  console.log('existsMedia length', existedGuid?.length);
  console.log('resetMedia length', resetMedias?.length);

  // const mediaUrl = getURL('api/media/' + fileName);
  let allMedias = existMediaRows && [...existMediaRows] || [];
  let resetMediaIds:string[] = [];
  if(resetMedias && resetMedias.length > 0) {
    const {error: errorInsert, data: mediaRows} = await supabaseAdmin.from('media').insert(resetMedias).select();

    if (errorInsert || mediaRows==null) {
      console.warn(errorInsert, errorInsert && errorInsert.message);
      console.error(`Media insert failed:`, errorInsert);
      throw new Error(`Media insert failed: ${errorInsert.message}`);
    }
    resetMediaIds = mediaRows.map(i => i.id);
    allMedias = [...allMedias, ...mediaRows];
  }

  // link to feed with position
  const feed_medias = allMedias.map(i => ({feed_id: feedId, media_id: i.id, position: positions[i.guid]}))
  const {error: feedMediaError} = await supabaseAdmin.from('feedMedia').insert(feed_medias);
  if (feedMediaError) {
    console.warn(feedMediaError, feedMediaError.message);
    console.error(`FeedMedia insert failed: ${feedMediaError}`);
    throw new Error(`FeedMedia insert failed: ${feedMediaError}`);
  }

  return resetMediaIds;
}


const updateMediaWithUrl = async (url: string, durationInSec: number, uuid: string) => {
  const {data, error} = await supabaseAdmin.from('media').update({url: url, id: uuid, duration_in_sec: durationInSec}).eq('id', uuid).select();
  if (error) {
    console.warn(error, error && error.message);
    console.error(`Media update failed: `, error);
    throw new Error(`Media update failed: ${error}`);
  }
  // console.log(data);
}

const findFeedMedia = async (feedId: string) => {
  const {data: mediaIds, error} = await supabaseAdmin.from('feedMedia').select('media_id, position').eq('feed_id', feedId);
  if (error) {
    console.warn(error, error && error.message);
    // console.error(`FeedMedia lookup failed: ${error}`);
    throw new Error(`FeedMedia lookup failed`);
  }
  const positionMap = mediaIds.reduce((acc, id) => {
    if(id.position!==null && id.position >=0) {
      acc[id.media_id] = id.position;
    }
    return acc},{} as {[key:string]: number})
  const {data: medias, error: mediaError} = await supabaseAdmin.from('media').select("*").in('id', mediaIds.map(i=>i.media_id));
  if (mediaError) {
    console.warn(mediaError, mediaError && mediaError.message);
    // console.error(`Media lookup failed: ${mediaError}`);
    throw new Error(`Media lookup failed:`);
  }

  return medias.map(i => ({...i, position: positionMap[i.id]}));
}

export {
  upsertProductRecord,
  upsertPriceRecord,
  upsertSubscriptionRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveStripeCustomer,
  manageStripeSubscriptionStatusChange,
  createFeed,
  findFeed,
  uploadMedia,
  createMedia,
  createMedias,
  updateMediaWithUrl,
  findFeedMedia,
  updateFeedWithXml
};
