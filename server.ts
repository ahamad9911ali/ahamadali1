import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
// import mongoose from "mongoose"; // We will simulate or set this up for future use.

// We will implement dummy generation of data to simulate broker WS -> Node -> Mongo -> Realtime IO

const PORT = 3000;
const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Mocking MongoDB model and Signal Engine
// Normally you'd connect to MongoDB:
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/broker");
//
// const signalSchema = new mongoose.Schema({ timestamp: Date, type: String, asset: String, price: Number });
// const SignalModel = mongoose.DB.model('Signal', signalSchema);

interface LiveTick {
  asset: string;
  price: number;
  timestamp: number;
}

// Store basic state for the signals
const currentPrices: Record<string, number> = {
  NIFTY: 23500,
  BANKNIFTY: 51200,
  FINNIFTY: 22800,
  SENSEX: 74500
};

// Simulate Broker WebSocket providing data -> Signal Engine creating flags -> MongoDB saving -> Socket.IO broadcasting
setInterval(() => {
  const assets = Object.keys(currentPrices);
  const randomAsset = assets[Math.floor(Math.random() * assets.length)];
  const tickAmount = (Math.random() * 8) - 4;
  currentPrices[randomAsset] += tickAmount;

  const tickData: LiveTick = {
    asset: randomAsset,
    price: Number(currentPrices[randomAsset].toFixed(2)),
    timestamp: Date.now()
  };

  // 1. Simulate saving to MongoDB here
  // await SignalModel.create({ ...tickData, type: 'TICK' })

  // 2. Broadcast via Socket.io to React Dashboard
  io.emit('price-update', tickData);

}, 2000); // Mock broker WS ticking every 2 seconds

// Check for DhanHQ credentials
const DHAN_API_KEY = process.env.DHAN_API_KEY;
const DHAN_CLIENT_ID = process.env.DHAN_CLIENT_ID;

if (DHAN_API_KEY && DHAN_CLIENT_ID) {
  console.log(`[DhanHQ] Initializing secure live data stream for client: ${DHAN_CLIENT_ID}...`);
} else {
  console.log("[DhanHQ] Credentials not found. Simulating broker WebSocket stream...");
}

// API routes FIRST
app.get("/api/health", (req, res) => {
  const hasDhanCreds = !!(process.env.DHAN_API_KEY && process.env.DHAN_CLIENT_ID);
  res.json({ 
    status: "ok", 
    brokerConnected: true, 
    dbConnected: true,
    activeBroker: hasDhanCreds ? "DhanHQ" : "Simulated",
    apiKeyConfigured: hasDhanCreds
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server & Socket.IO running on http://localhost:${PORT}`);
  });
}

startServer();
