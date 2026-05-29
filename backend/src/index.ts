import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { db } from "./db/index";
import { users } from "./db/schema";

const app = new Hono();

app.use("*", logger());
app.use("*", cors({
  origin: "http://localhost:5173", // URL frontend
}));

// Ambil API key dari .env
const API_KEY = process.env.API_KEY;

app.use("/api/*", async (c, next) => {
  const apiKey = c.req.header("x-api-key");

  if (!apiKey || apiKey !== API_KEY) {
    return c.json({ message: "API key tidak valid!" }, 401);
  }

  await next();
});

app.get("/api/users", async (c) => {
  const allUsers = await db.select().from(users);
  return c.json(allUsers);
});

app.post("/api/users", async (c) => {
  const body = await c.req.json();

  if (!body.name || !body.email) {
    return c.json({ message: "Name dan email wajib diisi!" }, 400);
  }

  const newUser = await db.insert(users).values({
    name: body.name,
    email: body.email,
  }).returning();

  return c.json({ message: "User berhasil dibuat!", data: newUser[0] }, 201);
});

export default app;