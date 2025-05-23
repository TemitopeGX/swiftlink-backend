import express from "express";
import { DeliveryService } from "../services/delivery.service";
import { CreateDeliveryDTO, UpdateDeliveryDTO } from "../models/delivery";

const router = express.Router();
const deliveryService = new DeliveryService();

// Create a new delivery
router.post("/", async (req, res) => {
  try {
    const deliveryData: CreateDeliveryDTO = req.body;
    const delivery = await deliveryService.createDelivery(deliveryData);
    res.status(201).json(delivery);
  } catch (error) {
    console.error("Error creating delivery:", error);
    res.status(500).json({ message: "Failed to create delivery" });
  }
});

// Get a delivery by ID
router.get("/:id", async (req, res) => {
  try {
    const delivery = await deliveryService.getDeliveryById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }
    res.json(delivery);
  } catch (error) {
    console.error("Error getting delivery:", error);
    res.status(500).json({ message: "Failed to get delivery" });
  }
});

// Get deliveries by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const deliveries = await deliveryService.getDeliveriesByUserId(
      req.params.userId
    );
    res.json(deliveries);
  } catch (error) {
    console.error("Error getting user deliveries:", error);
    res.status(500).json({ message: "Failed to get user deliveries" });
  }
});

// Get deliveries by rider ID
router.get("/rider/:riderId", async (req, res) => {
  try {
    const deliveries = await deliveryService.getDeliveriesByRiderId(
      req.params.riderId
    );
    res.json(deliveries);
  } catch (error) {
    console.error("Error getting rider deliveries:", error);
    res.status(500).json({ message: "Failed to get rider deliveries" });
  }
});

// Update a delivery
router.patch("/:id", async (req, res) => {
  try {
    const deliveryData: UpdateDeliveryDTO = req.body;
    const delivery = await deliveryService.updateDelivery(
      req.params.id,
      deliveryData
    );
    res.json(delivery);
  } catch (error) {
    console.error("Error updating delivery:", error);
    res.status(500).json({ message: "Failed to update delivery" });
  }
});

// Delete a delivery
router.delete("/:id", async (req, res) => {
  try {
    await deliveryService.deleteDelivery(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting delivery:", error);
    res.status(500).json({ message: "Failed to delete delivery" });
  }
});

// Get available deliveries
router.get("/status/available", async (req, res) => {
  try {
    const deliveries = await deliveryService.getAvailableDeliveries();
    res.json(deliveries);
  } catch (error) {
    console.error("Error getting available deliveries:", error);
    res.status(500).json({ message: "Failed to get available deliveries" });
  }
});

export default router;
