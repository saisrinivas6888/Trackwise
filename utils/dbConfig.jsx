import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { usersTable } from './schema';
import * as schema from './schema';
const sql = neon('postgresql://Expense-Tracker_owner:npg_Sf5WLETO0xrC@ep-sweet-cloud-a4zfwh6d-pooler.us-east-1.aws.neon.tech/Expenses-Tracker?sslmode=require');
export const db = drizzle(sql,{schema});