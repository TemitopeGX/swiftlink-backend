import { Generated, Selectable, Insertable, Updateable } from "kysely";

export interface Delivery {
  id: string;
  userId: string;
  pickupAddress: string;
  deliveryAddress: string;
  packageType: string;
  packageDetails?: string | null;
  weight?: string | null;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  price?: number | null;
  riderId?: string | null;
  estimatedTime?: string | null;
  distance?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  firebase_uid: string;
  email: string;
  name: string;
  role: "business" | "rider" | "user";
  created_at: Date;
  updated_at: Date;
}

export interface Bid {
  id: string;
  delivery_id: string;
  rider_id: string;
  price: string;
  estimated_time: string;
  note?: string;
  status: "pending" | "accepted" | "rejected";
  created_at: Date;
  updated_at: Date;
}

export interface Database {
  deliveries: DeliveryTable;
  users: User;
  bids: Bid;
}

export interface DeliveryTable {
  id: Generated<string>;
  user_id: string;
  pickup_address: string;
  delivery_address: string;
  package_type: string;
  package_details?: string | null;
  weight?: string | null;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  price?: number | null;
  rider_id?: string | null;
  estimated_time?: string | null;
  distance?: string | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export type DBDelivery = Selectable<DeliveryTable>;
export type NewDelivery = Insertable<DeliveryTable>;
export type DeliveryUpdate = Updateable<DeliveryTable>;

export interface CreateDeliveryDTO {
  userId: string;
  pickupAddress: string;
  deliveryAddress: string;
  packageType: string;
  packageDetails?: string;
  weight?: string;
}

export interface UpdateDeliveryDTO {
  status?: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  riderId?: string;
  price?: number;
  estimatedTime?: string;
  distance?: string;
}

export interface CreateBidDTO {
  deliveryId: string;
  riderId: string;
  price: string;
  estimatedTime: string;
  note?: string;
}

export interface UpdateBidDTO {
  status: "accepted" | "rejected";
}
