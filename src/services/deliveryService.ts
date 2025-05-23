import { Kysely } from "kysely";
import {
  Database,
  Delivery,
  CreateDeliveryDTO,
  UpdateDeliveryDTO,
} from "../models/delivery";

export class DeliveryService {
  constructor(private db: Kysely<Database>) {}

  async createDelivery(data: CreateDeliveryDTO): Promise<Delivery> {
    const delivery = await this.db
      .insertInto("deliveries")
      .values({
        user_id: data.userId,
        pickup_address: data.pickupAddress,
        delivery_address: data.deliveryAddress,
        package_type: data.packageType,
        package_details: data.packageDetails,
        weight: data.weight,
        status: "pending",
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.mapDeliveryFromDb(delivery);
  }

  async getDeliveryById(id: string): Promise<Delivery | null> {
    const delivery = await this.db
      .selectFrom("deliveries")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    return delivery ? this.mapDeliveryFromDb(delivery) : null;
  }

  async getDeliveriesByUserId(userId: string): Promise<Delivery[]> {
    const deliveries = await this.db
      .selectFrom("deliveries")
      .selectAll()
      .where("user_id", "=", userId)
      .orderBy("created_at", "desc")
      .execute();

    return deliveries.map(this.mapDeliveryFromDb);
  }

  async updateDelivery(id: string, data: UpdateDeliveryDTO): Promise<Delivery> {
    const delivery = await this.db
      .updateTable("deliveries")
      .set({
        status: data.status,
        rider_id: data.riderId,
        price: data.price,
        estimated_time: data.estimatedTime,
        distance: data.distance,
        updated_at: new Date(),
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.mapDeliveryFromDb(delivery);
  }

  async deleteDelivery(id: string): Promise<void> {
    await this.db.deleteFrom("deliveries").where("id", "=", id).execute();
  }

  private mapDeliveryFromDb(delivery: any): Delivery {
    return {
      id: delivery.id,
      userId: delivery.user_id,
      pickupAddress: delivery.pickup_address,
      deliveryAddress: delivery.delivery_address,
      packageType: delivery.package_type,
      packageDetails: delivery.package_details,
      weight: delivery.weight,
      status: delivery.status,
      price: delivery.price,
      riderId: delivery.rider_id,
      estimatedTime: delivery.estimated_time,
      distance: delivery.distance,
      createdAt: delivery.created_at,
      updatedAt: delivery.updated_at,
    };
  }
}
