import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users";
import deliveryRoutes from "./routes/delivery.routes";
import bidRoutes from "./routes/bid.routes";
import { testConnection } from "./db";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Test database connection
testConnection()
  .then((success) => {
    if (!success) {
      console.error("Database connection failed");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Error testing database connection:", error);
    process.exit(1);
  });

// Root route with API documentation
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "SwiftLink API is running",
    version: "1.0.0",
    endpoints: {
      users: {
        base: "/api/users",
        routes: [
          {
            method: "POST",
            path: "/register",
            description: "Register a new user",
          },
          { method: "POST", path: "/login", description: "Login user" },
          { method: "GET", path: "/profile", description: "Get user profile" },
        ],
      },
      deliveries: {
        base: "/api/deliveries",
        routes: [
          { method: "POST", path: "/", description: "Create a new delivery" },
          {
            method: "GET",
            path: "/",
            description: "Get all deliveries for user",
          },
          { method: "GET", path: "/:id", description: "Get delivery by ID" },
          { method: "PATCH", path: "/:id", description: "Update delivery" },
          { method: "DELETE", path: "/:id", description: "Delete delivery" },
        ],
      },
      bids: {
        base: "/api/bids",
        routes: [
          { method: "POST", path: "/", description: "Create a new bid" },
          {
            method: "GET",
            path: "/delivery/:id",
            description: "Get bids for delivery",
          },
          { method: "PATCH", path: "/:id", description: "Update bid status" },
          { method: "GET", path: "/rider", description: "Get bids for rider" },
        ],
      },
    },
    documentation:
      "For detailed API documentation, please refer to the project documentation",
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/bids", bidRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    path: req.path,
  });
});

// Error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
