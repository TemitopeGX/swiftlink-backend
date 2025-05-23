import { Kysely, sql } from "kysely";
import { Database } from "../models/delivery";
import db from "./index";

async function migrateToLatest() {
  try {
    // Create users table
    await db.schema
      .createTable("users")
      .ifNotExists()
      .addColumn("id", "uuid", (col) =>
        col.primaryKey().defaultTo(sql`gen_random_uuid()`)
      )
      .addColumn("firebase_uid", "varchar", (col) => col.notNull().unique())
      .addColumn("email", "varchar", (col) => col.notNull().unique())
      .addColumn("name", "varchar", (col) => col.notNull())
      .addColumn("role", "varchar", (col) => col.notNull())
      .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`))
      .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`))
      .execute();

    // Create deliveries table (without accepted_bid_id initially)
    await db.schema
      .createTable("deliveries")
      .ifNotExists()
      .addColumn("id", "uuid", (col) =>
        col.primaryKey().defaultTo(sql`gen_random_uuid()`)
      )
      .addColumn("user_id", "uuid", (col) =>
        col.notNull().references("users.id")
      )
      .addColumn("pickup_address", "varchar", (col) => col.notNull())
      .addColumn("delivery_address", "varchar", (col) => col.notNull())
      .addColumn("package_type", "varchar", (col) => col.notNull())
      .addColumn("package_details", "varchar")
      .addColumn("weight", "varchar")
      .addColumn("status", "varchar", (col) =>
        col.notNull().defaultTo("pending")
      )
      .addColumn("price", "varchar")
      .addColumn("rider_id", "uuid", (col) => col.references("users.id"))
      .addColumn("estimated_time", "varchar")
      .addColumn("distance", "varchar")
      .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`))
      .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`))
      .execute();

    // Create bids table
    await db.schema
      .createTable("bids")
      .ifNotExists()
      .addColumn("id", "uuid", (col) =>
        col.primaryKey().defaultTo(sql`gen_random_uuid()`)
      )
      .addColumn("delivery_id", "uuid", (col) =>
        col.notNull().references("deliveries.id")
      )
      .addColumn("rider_id", "uuid", (col) =>
        col.notNull().references("users.id")
      )
      .addColumn("price", "varchar", (col) => col.notNull())
      .addColumn("estimated_time", "varchar", (col) => col.notNull())
      .addColumn("note", "varchar")
      .addColumn("status", "varchar", (col) =>
        col.notNull().defaultTo("pending")
      )
      .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`))
      .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`))
      .execute();

    // Add accepted_bid_id column to deliveries table
    await db.schema
      .alterTable("deliveries")
      .addColumn("accepted_bid_id", "uuid", (col) => col.references("bids.id"))
      .execute();

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateToLatest();
