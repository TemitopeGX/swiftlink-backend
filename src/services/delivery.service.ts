import db from "../db";
import { CreateDeliveryDTO, UpdateDeliveryDTO } from "../models/delivery";
import { sql } from "kysely";

export class DeliveryService {
  async createDelivery(data: CreateDeliveryDTO) {
    return await db
      .insertInto("deliveries")
      .values({
        id: sql`gen_random_uuid()`,
        user_id: data.userId,
        pickup_address: data.pickupAddress,
        delivery_address: data.deliveryAddress,
        package_type: data.packageType,
        package_details: data.packageDetails,
        weight: data.weight,
        status: "pending",
        created_at: sql`now()`,
        updated_at: sql`now()`,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async getDeliveryById(id: string) {
    return await db
      .selectFrom("deliveries")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirst();
  }

  async getDeliveriesByUserId(userId: string) {
    return await db
      .selectFrom("deliveries")
      .where("user_id", "=", userId)
      .selectAll()
      .execute();
  }

  async getDeliveriesByRiderId(riderId: string) {
    return await db
      .selectFrom("deliveries")
      .where("rider_id", "=", riderId)
      .selectAll()
      .execute();
  }

  async updateDelivery(id: string, data: UpdateDeliveryDTO) {
    return await db
      .updateTable("deliveries")
      .set({
        status: data.status,
        rider_id: data.riderId,
        price: data.price,
        estimated_time: data.estimatedTime,
        distance: data.distance,
        updated_at: sql`now()`,
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async deleteDelivery(id: string) {
    return await db
      .deleteFrom("deliveries")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async getAvailableDeliveries() {
    return await db
      .selectFrom("deliveries")
      .where("status", "=", "pending")
      .selectAll()
      .execute();
  }
}
