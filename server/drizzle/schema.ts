// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { uniqueIndex } from "drizzle-orm/pg-core";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ai-saas_${name}`);

export const userApiLimit = createTable(
  "userApiLimit",
  {
    id: serial("id").primaryKey().notNull(),
    userId: varchar("userId", { length: 256 }).notNull(),
    count: integer('count').default(0).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (userApiLimit) => {
    return {
      unique: {
        uniqueIdx: uniqueIndex('unique_idx').on(userApiLimit.id),
      }
    }
  }
);

export const userSubscription = createTable(
  "userSubscription",
  {
    id: serial("id").primaryKey().notNull(),
    userId: varchar("userId", { length: 256 }).notNull().unique(),
    stripeCustomerId: varchar("stripe_customer_id", { length: 256 }),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 256 }),
    stripePriceId: varchar("stripe_price_id", { length: 256 }),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  },
  (userSubscription) => {
    return {
      unique: {
        uniqueIdx: uniqueIndex('unique_idx').on(userSubscription.id),
      }
    }
  }
);
