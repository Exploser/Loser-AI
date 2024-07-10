import { currentUser } from "@clerk/nextjs/server";
import { db } from "../server/drizzle/index";
import { eq } from 'drizzle-orm';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const checkSubscription = async () => {
    const user = await currentUser();

    if (!user?.id || !user) {
        return false;
    }

    const userSubscription = await db.query.userSubscription.findFirst({
        where: (model) => eq(model.userId, user.id),
        columns: {
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true
        }
    });

    if (!userSubscription) {
        return false;
    }

    const isValid = userSubscription.stripePriceId && 
        userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();
    
    return !!isValid;
    
}