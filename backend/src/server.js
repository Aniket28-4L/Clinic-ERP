require("dotenv").config();

const { createApp } = require("./app");
const { loadEnv } = require("./config/env");
const { connectMongo } = require("./config/db");

async function bootstrap() {
  const env = loadEnv();
  await connectMongo(env.MONGODB_URI);

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on port ${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = async (signal) => {
    // eslint-disable-next-line no-console
    console.log(`\nReceived ${signal}. Shutting down...`);
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});

