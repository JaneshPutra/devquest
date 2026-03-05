import * as path from 'path';
import { defineConfig } from 'prisma/config';
import * as dotenv from 'dotenv';

// Prisma CLI doesn't auto-load .env before evaluating this file.
// Use __dirname (CJS-compatible) instead of import.meta.dirname.
dotenv.config({ path: path.join(__dirname, '.env') });

export default defineConfig({
    earlyAccess: true,
    schema: path.join(__dirname, 'prisma/schema.prisma'),
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
