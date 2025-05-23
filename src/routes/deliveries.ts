import express from "express";
import { DeliveryService } from "../services/deliveryService";
import { CreateDeliveryDTO, UpdateDeliveryDTO } from "../models/delivery";
import { authenticateUser } from "../middleware/auth";

export function createDeliveryRouter(deliveryService: DeliveryService) {
  const router = express.Router();

  // Create a new delivery
  router.post("/", authenticateUser, async (req, res) => {
    try {
      const deliveryData: CreateDeliveryDTO = {
        userId: req.user!.id,
        pickupAddress: req.body.pickupAddress,
        deliveryAddress: req.body.deliveryAddress,
        packageType: req.body.packageType,
        packageDetails: req.body.packageDetails,
        weight: req.body.weight,
      };

      const delivery = await deliveryService.createDelivery(deliveryData);
      res.status(201).json(delivery);
    } catch (error) {
      console.error("Error creating delivery:", error);
      res.status(500).json({ error: "Failed to create delivery" });
    }
  });

  // Get all deliveries for a user
  router.get("/", authenticateUser, async (req, res) => {
    try {
      const deliveries = await deliveryService.getDeliveriesByUserId(
        req.user!.id
      );
      res.json(deliveries);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      res.status(500).json({ error: "Failed to fetch deliveries" });
    }
  });

  // Get a specific delivery
  router.get("/:id", authenticateUser, async (req, res) => {
    try {
      const delivery = await deliveryService.getDeliveryById(req.params.id);
      if (!delivery) {
        return res.status(404).json({ error: "Delivery not found" });
      }
      res.json(delivery);
    } catch (error) {
      console.error("Error fetching delivery:", error);
      res.status(500).json({ error: "Failed to fetch delivery" });
    }
  });

  // Update a delivery
  router.patch("/:id", authenticateUser, async (req, res) => {
    try {
      const updateData: UpdateDeliveryDTO = {
        status: req.body.status,
        riderId: req.body.riderId,
        price: req.body.price,
        estimatedTime: req.body.estimatedTime,
        distance: req.body.distance,
      };

      const delivery = await deliveryService.updateDelivery(
        req.params.id,
        updateData
      );
      res.json(delivery);
    } catch (error) {
      console.error("Error updating delivery:", error);
      res.status(500).json({ error: "Failed to update delivery" });
    }
  });

  // Delete a delivery
  router.delete("/:id", authenticateUser, async (req, res) => {
    try {
      await deliveryService.deleteDelivery(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting delivery:", error);
      res.status(500).json({ error: "Failed to delete delivery" });
    }
  });

  return router;
}
