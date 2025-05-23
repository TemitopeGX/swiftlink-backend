import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("deliveries")
    .addColumn("id", sql`uuid`, (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("user_id", sql`uuid`, (col) =>
      col.notNull().references("users.id")
    )
    .addColumn("pickup_address", "text", (col) => col.notNull())
    .addColumn("delivery_address", "text", (col) => col.notNull())
    .addColumn("package_type", "text", (col) => col.notNull())
    .addColumn("package_details", "text")
    .addColumn("weight", "text")
    .addColumn("status", "text", (col) => col.notNull().defaultTo("pending"))
    .addColumn("price", "decimal")
    .addColumn("rider_id", sql`uuid`, (col) => col.references("users.id"))
    .addColumn("estimated_time", "text")
    .addColumn("distance", "text")
    .addColumn("created_at", sql`timestamp with time zone`, (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .addColumn("updated_at", sql`timestamp with time zone`, (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("deliveries").execute();
}
