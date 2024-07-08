import { defineConfig } from 'drizzle-kit';
 
export default defineConfig({
  schema: './server/drizzle/schema.ts',
  dialect: 'postgresql',
  tablesFilter: ["ai-saas_*"],
  dbCredentials: {
    url: process.env.POSTGRES_URL || '',
  },
});