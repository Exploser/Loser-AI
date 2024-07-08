import { auth } from "@clerk/nextjs/server";
import { userApiLimit } from "../server/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { db } from "../server/drizzle/index";


export const increaseApiLimit = async () => {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthorized");
    

    const userApiUsage = await db.query.userApiLimit.findMany({
        where: (model, { eq }) => eq(model.userId, userId),
    });
    return userApiUsage;
};