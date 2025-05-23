export interface Delivery {
  id: string;
  user_id: string;
  pickup_address: string;
  delivery_address: string;
  package_type: string;
  package_details?: string;
  weight?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  price?: string;
  rider_id?: string;
  estimated_time?: string;
  distance?: string;
  created_at: Date;
  updated_at: Date;
  accepted_bid_id?: string;
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
  deliveries: Delivery;
  users: User;
  bids: Bid;
}

export interface CreateDeliveryDTO {
  userId: string;
  pickupAddress: string;
  deliveryAddress: string;
  packageType: string;
  packageDetails?: string;
  weight?: string;
}

export interface UpdateDeliveryDTO {
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  riderId?: string;
  price?: string;
  estimatedTime?: string;
  distance?: string;
  acceptedBidId?: string;
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
