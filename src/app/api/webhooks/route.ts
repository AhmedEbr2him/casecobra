import { db } from '@/db';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import OrderRecivedEmail from '@/components/emails/OrderRecivedEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = headers().get('stripe-signature');

        if (!signature) {
            return new Response('Invalide signature', { status: 400 });
        }
        // if we fire api without make a event. any user can order case for free
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
        // listented from webhook
        // this mean user has actually paid. we sure we recive the money
        if (event.type === 'checkout.session.completed') {
            if (!event.data.object.customer_details?.email) {
                throw new Error('Missing user email ');
            }

            const session = event.data.object as Stripe.Checkout.Session;
            // user id and order id are comming from preview
            const { userId, orderId } = session.metadata || {
                userId: null,
                orderId: null,
            };

            if (!userId || !orderId) {
                throw new Error('Invalid request metadata');
            }

            const billingAddress = session.customer_details!.address;
            const shippingAddress = session.shipping_details!.address;

            const updatedOrder = await db.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    isPaid: true,
                    shippingAddress: {
                        create: {
                            name: session.customer_details!.name!,
                            city: shippingAddress!.city!,
                            country: shippingAddress!.country!,
                            postalCode: shippingAddress!.postal_code!,
                            street: shippingAddress!.line1!,
                            state: shippingAddress!.state,
                        },
                    },
                    billingAddress: {
                        create: {
                            name: session.customer_details!.name!,
                            city: billingAddress!.city!,
                            country: billingAddress!.country!,
                            postalCode: billingAddress!.postal_code!,
                            street: billingAddress!.line1!,
                            state: billingAddress!.state,
                        },
                    },
                },
            });
            await resend.emails.send({
                from: 'CaseCobra <ahmedebrahim23223@gmail.com>',
                to: [event.data.object.customer_details.email],
                subject: 'Thanks for your order!',
                react: OrderRecivedEmail({
                    orderId,
                    orderDate: updatedOrder.createdAt.toLocaleDateString('en'),
                    // @ts-ignore
                    shippingAddress: {
                        name: session.customer_details!.name!,
                        city: shippingAddress!.city!,
                        country: shippingAddress!.country!,
                        postalCode: shippingAddress!.postal_code!,
                        street: shippingAddress!.line1!,
                        state: shippingAddress!.state,
                    },
                }),
            });
        }

        return NextResponse.json({ result: event, ok: true });
    } catch (err) {
        console.error(err);
        // send this to sentry
        return NextResponse.json({ message: 'Somthing went wrong', ok: false }, { status: 500 });
    }
}
