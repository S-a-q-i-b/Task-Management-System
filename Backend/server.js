require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = require("./src/app");

const connectDB = require("./src/db/db");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
