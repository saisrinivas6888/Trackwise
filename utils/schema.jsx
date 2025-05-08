import { pgTable, serial, text, timestamp, varchar, integer, numeric, boolean } from "drizzle-orm/pg-core"


export const Budgets=pgTable('budgets',{
    id:serial('id').primaryKey(),
    name:varchar('name').notNull(),
    amount:varchar('amount').notNull(),
    icon:varchar('icon'),
    createdBy:varchar('created_by').notNull(),

})

export const Expenses=pgTable('expenses',{
    id:serial('id').primaryKey(),
    name:varchar('name').notNull(),
    amount:numeric('amount'.notNull).default(0),
    budgetId:integer('budgetId').references(()=>Budgets.id),
    createdAt:varchar('createdAt').notNull()
})


export const bankAccounts = pgTable('bank_accounts', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    institutionId: text('institution_id').notNull(),
    accessToken: text('access_token').notNull(),
    name: text('name').notNull(),
    mask: text('mask'),
    type: text('type'),
    subtype: text('subtype'),
    createdAt: timestamp('created_at').defaultNow()
  })
  
  export const transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    accountId: text('account_id').references(() => bankAccounts.id),
    externalId: text('external_id').unique(),
    amount: numeric('amount').notNull(),
    description: text('description'),
    category: text('category'),
    date: timestamp('date'),
    pending: boolean('pending').default(false),
    createdAt: timestamp('created_at').defaultNow()
  })