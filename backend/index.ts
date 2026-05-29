import 'dotenv/config';
import { serve } from "@hono/node-server";
import app from "./src/index";

const port = parseInt(process.env.PORT || "3000", 10);

console.log(`🚀 Server running at http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});