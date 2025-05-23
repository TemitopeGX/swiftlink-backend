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

// Routes
app.use("/api/users", userRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/bids", bidRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
