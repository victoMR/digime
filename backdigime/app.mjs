import express from "express";
import cors from "cors";
import connectDB from "./config/db.mjs"; // Ahora correctamente exportado como default
import userRoutes from "./routes/users.mjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Servir archivos estáticos

// Rutas
app.use("/", userRoutes);

// Conexión a MongoDB
connectDB();

export default app;
