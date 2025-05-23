import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import dotenv from "dotenv";
import { Database } from "../models/delivery";

dotenv.config();

const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});

// Helper function to test the connection
export async function testConnection() {
  try {
    // Test query using the users table
    const result = await db
      .selectFrom("users")
      .select(["id"])
      .limit(1)
      .execute();

    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

export default db;
