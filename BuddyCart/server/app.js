require("./config/env"); 
require("./db");

const express = require("express");
const cors = require("cors");

const app = express();


const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://buddycart.fly.dev",
  "https://buddycart-client.netlify.app",
];


const corsOptions = {
  origin(origin, cb) {
    
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(null, false); 
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["x-total-count"],
  optionsSuccessStatus: 204,
};


app.use(cors(corsOptions));


require("./config")(app);


app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/admin/role-requests", require("./routes/roleRequests.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/checkout", require("./routes/checkout.routes"));
app.use("/api/shops", require("./routes/shops.routes"));
app.use("/api/vendor", require("./routes/vendor.routes"));

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

app.get("/", (req, res) => res.send("BuddyCart API is running"));
app.get("/healthz", (req, res) => res.status(200).json({ status: "ok" }));

const mongoose = require("mongoose");
app.get("/dbz", (req, res) => {
  res.json({ readyState: mongoose.connection.readyState });
});

app.get("/envz", (req, res) => {
  res.json({
    has_MONGO_URI: !!process.env.MONGO_URI,
    has_MONGODB_URI: !!process.env.MONGODB_URI,
  });
});

app.get("/mongotest", (req, res) => {
  const uri = process.env.MONGO_URI || "";
  const masked = uri.replace(/(\/\/[^:]+:)[^@]+@/, "$1****@");
  const m = uri.match(/^mongodb\+srv:\/\/[^@]+@([^/]+)\/?([^?]*)/);
  res.json({
    hasEnv: !!uri,
    sample: masked,
    host: m ? m[1] : null,
    dbName: m ? (m[2] || "(none)") : null,
  });
});

require("./error-handling")(app);

module.exports = app;
