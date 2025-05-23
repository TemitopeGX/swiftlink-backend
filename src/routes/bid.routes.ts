import express from "express";
import { BidService } from "../services/bid.service";
import { CreateBidDTO, UpdateBidDTO } from "../models/delivery";

const router = express.Router();
const bidService = new BidService();

// Create a new bid
router.post("/", async (req, res) => {
  try {
    const bidData: CreateBidDTO = req.body;
    const bid = await bidService.createBid(bidData);
    res.status(201).json(bid);
  } catch (error) {
    console.error("Error creating bid:", error);
    res.status(500).json({ message: "Failed to create bid" });
  }
});

// Get bids for a delivery
router.get("/delivery/:deliveryId", async (req, res) => {
  try {
    const bids = await bidService.getBidsByDeliveryId(req.params.deliveryId);
    res.json(bids);
  } catch (error) {
    console.error("Error getting delivery bids:", error);
    res.status(500).json({ message: "Failed to get delivery bids" });
  }
});

// Get bids by rider ID
router.get("/rider/:riderId", async (req, res) => {
  try {
    const bids = await bidService.getBidsByRiderId(req.params.riderId);
    res.json(bids);
  } catch (error) {
    console.error("Error getting rider bids:", error);
    res.status(500).json({ message: "Failed to get rider bids" });
  }
});

// Accept a bid
router.post("/:bidId/accept", async (req, res) => {
  try {
    const { deliveryId } = req.body;
    const updatedDelivery = await bidService.acceptBid(
      req.params.bidId,
      deliveryId
    );
    res.json(updatedDelivery);
  } catch (error) {
    console.error("Error accepting bid:", error);
    res.status(500).json({ message: "Failed to accept bid" });
  }
});

// Update bid status
router.patch("/:id", async (req, res) => {
  try {
    const bidData: UpdateBidDTO = req.body;
    const bid = await bidService.updateBidStatus(req.params.id, bidData);
    res.json(bid);
  } catch (error) {
    console.error("Error updating bid:", error);
    res.status(500).json({ message: "Failed to update bid" });
  }
});

export default router;
