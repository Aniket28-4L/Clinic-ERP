const mongoose = require("mongoose");

async function connectMongo(mongoUri) {
  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, {
    autoIndex: false, // avoid performance issues in production; use migrations/index management
  });
}

module.exports = { connectMongo };

