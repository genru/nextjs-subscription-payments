import { Paddle, EventName, ProductNotification, PriceNotification, SubscriptionNotification } from '@paddle/paddle-node-sdk'
import { upsertPriceRecord, upsertProductRecord, upsertSubscriptionRecord } from '../supabase/admin';

const paddle = new Paddle(process.env.PADDLE_API_KEY!);
export async function processPaddleEvent(req: Request) {
    let resp: Response = new Response('ok');
    try {
        const signature = (req.headers.get('paddle-signature') as string) || '';
        // req.body should be of type `buffer`, convert to string before passing it to `unmarshal`.
        // If express returned a JSON, remove any other middleware that might have processed raw request to object
        const rawRequestBody = await req.text();

        const secretKey = process.env['PADDLE_WEBHOOK_SECRET_KEY'] || '';

        // const c = await paddle.customers.create({email: '', name:""});
        // paddle.pricingPreview()
        if (signature && rawRequestBody) {
            // The `unmarshal` function will validate the integrity of the webhook and return an entity
            const eventData = paddle.webhooks.unmarshal(rawRequestBody, secretKey, signature);
            console.info(`🔔${eventData}`, eventData);
            switch (eventData?.eventType) {
              case EventName.ProductCreated:
              case EventName.ProductUpdated:
              case EventName.ProductImported:
                    const product = eventData.data as ProductNotification;
                await upsertProductRecord(eventData.data as ProductNotification)
                console.info(product);
                break;
              case EventName.PriceUpdated:
              case EventName.PriceCreated:
                // const price = eventData.data as PriceNotification;
                    await upsertPriceRecord(eventData.data as PriceNotification)
                // console.log(price);
                break;

              case EventName.PriceImported:
                console.log(eventData.data as PriceNotification);
                break;
              case EventName.CustomerCreated:
              case EventName.CustomerUpdated:
                break;
              case EventName.SubscriptionCreated:
              case EventName.SubscriptionUpdated:
              case EventName.SubscriptionCanceled:
              case EventName.SubscriptionActivated:
                  const subscription = eventData.data as SubscriptionNotification;
                await upsertSubscriptionRecord(subscription);
                break;
              default:
                console.warn(`${eventData?.eventType} is not supported`);
                resp = new Response('error',{status:400});
            }
          } else {
            console.log('Signature missing in header');
            resp = new Response('Signature missing in header', { status: 400 })
          }
    } catch (err) {
      console.error(err);
      resp = new Response(
        'Webhook handler failed. View your function logs.',
        {
          status: 400
        }
      );
    }

    return resp;
}

