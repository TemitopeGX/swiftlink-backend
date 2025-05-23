import db from "../db";
import { CreateBidDTO, UpdateBidDTO } from "../models/delivery";
import { sql } from "kysely";

export class BidService {
  async createBid(data: CreateBidDTO) {
    return await db
      .insertInto("bids")
      .values({
        id: sql`gen_random_uuid()`,
        delivery_id: data.deliveryId,
        rider_id: data.riderId,
        price: data.price,
        estimated_time: data.estimatedTime,
        note: data.note,
        status: "pending",
        created_at: sql`now()`,
        updated_at: sql`now()`,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async getBidsByDeliveryId(deliveryId: string) {
    return await db
      .selectFrom("bids")
      .innerJoin("users", "users.id", "bids.rider_id")
      .where("delivery_id", "=", deliveryId)
      .select([
        "bids.id",
        "bids.price",
        "bids.estimated_time",
        "bids.note",
        "bids.status",
        "bids.created_at",
        "users.name as rider_name",
        "users.email as rider_email",
      ])
      .execute();
  }

  async getBidById(id: string) {
    return await db
      .selectFrom("bids")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirst();
  }

  async updateBidStatus(id: string, data: UpdateBidDTO) {
    return await db
      .updateTable("bids")
      .set({
        status: data.status,
        updated_at: sql`now()`,
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async acceptBid(bidId: string, deliveryId: string) {
    // Start a transaction
    return await db.transaction().execute(async (trx) => {
      // 1. Update the bid status to accepted
      await trx
        .updateTable("bids")
        .set({
          status: "accepted",
          updated_at: sql`now()`,
        })
        .where("id", "=", bidId)
        .execute();

      // 2. Update all other bids for this delivery to rejected
      await trx
        .updateTable("bids")
        .set({
          status: "rejected",
          updated_at: sql`now()`,
        })
        .where("delivery_id", "=", deliveryId)
        .where("id", "!=", bidId)
        .execute();

      // 3. Update the delivery with the accepted bid
      const acceptedBid = await trx
        .selectFrom("bids")
        .where("id", "=", bidId)
        .selectAll()
        .executeTakeFirstOrThrow();

      return await trx
        .updateTable("deliveries")
        .set({
          status: "in_progress",
          rider_id: acceptedBid.rider_id,
          price: acceptedBid.price,
          estimated_time: acceptedBid.estimated_time,
          accepted_bid_id: bidId,
          updated_at: sql`now()`,
        })
        .where("id", "=", deliveryId)
        .returningAll()
        .executeTakeFirstOrThrow();
    });
  }

  async getBidsByRiderId(riderId: string) {
    return await db
      .selectFrom("bids")
      .innerJoin("deliveries", "deliveries.id", "bids.delivery_id")
      .where("bids.rider_id", "=", riderId)
      .select([
        "bids.id",
        "bids.price",
        "bids.estimated_time",
        "bids.note",
        "bids.status",
        "bids.created_at",
        "deliveries.pickup_address",
        "deliveries.delivery_address",
        "deliveries.package_type",
      ])
      .execute();
  }
}
