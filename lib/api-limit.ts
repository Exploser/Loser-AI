import { auth } from "@clerk/nextjs/server";
import { userApiLimit } from "../server/drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "../server/drizzle/index";
import { MAX_FREE_COUNTS } from "../constants";

export const increaseApiLimit = async () => {
    const { userId } = auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const userApiUsage = await db.query.userApiLimit.findMany({
        where: (model) => eq(model.userId, userId),
    });

    if (userApiUsage.length > 0) {
        await db.update(userApiLimit)
            .set({ count: userApiUsage[0].count + 1 })
            .where(eq(userApiLimit.userId, userId))
            .execute();
    } else {
        await db.insert(userApiLimit)
            .values({ userId, count: 1 })
            .execute();
    }
};

export const checkApiLimit = async () => {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    const userApiUsage = await db.query.userApiLimit.findMany({
        where: (model) => eq(model.userId, userId),
    });

    if (userApiUsage.length === 0 || userApiUsage[0].count < MAX_FREE_COUNTS) {
        return true;
    } else {
        return false;
    }
};

export const getApiLimitCount = async () => {
    const { userId } = auth();

    if (!userId) {
        return 0;
    }

    const userApiUsage = await db.query.userApiLimit.findMany({
        where: (model) => eq(model.userId, userId),
    });

    if (userApiUsage.length === 0) {
        return 0;
    }

    return userApiUsage[0].count;
};
