import { NextResponse } from 'next/server'
import { db } from "../../../server/drizzle/index";
import { stripe } from '@/lib/stripe'
import { absoluteUrl } from '@/lib/utils'
import { eq } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';

const settingsUrl = absoluteUrl("/settings");

export async function GET() {
    try {
        const user = await currentUser();

        if (!user?.id || !user) {
            return new NextResponse("Unauthorized", {status: 401});
        } 

        const userSubscription = await db.query.userSubscription.findFirst({
            where: (model) => eq(model.userId, user.id),
        });

        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl
            });
            return new NextResponse(JSON.stringify({url: stripeSession.url}));
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: {
                            name: "Genius Pro",
                            description: "Unlimited AI Generations"
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1,
                }
            ],
            metadata: {
                userId: user.id, // Ensure userId is used here
            }
        });

        return new NextResponse(JSON.stringify({ url: stripeSession.url }));

    } catch (error) {
        console.log("[STRIPE_ERROR]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}
