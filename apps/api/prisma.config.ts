import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

// Prisma CLI doesn't auto-load .env before evaluating this file
config({ path: path.join(import.meta.dirname, '.env') });

export default defineConfig({
    earlyAccess: true,
    schema: path.join(import.meta.dirname, 'prisma/schema.prisma'),
    datasource: {
        url: process.env.DATABASE_URL!,
    },
    migrate: {
        async adapter() {
            const { PrismaPg } = await import('@prisma/adapter-pg');
            return new PrismaPg({ connectionString: process.env.DATABASE_URL! });
        },
    },
});
