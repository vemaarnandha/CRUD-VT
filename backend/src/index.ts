import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { db } from "./db/index";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

app.use("*", logger());
app.use("*", cors({
  origin: "http://localhost:5173", // URL frontend
}));

// Fungsi untuk hash password (menggunakan Web Crypto API yang built-in di Bun)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// Fungsi untuk membuat JWT sederhana
function generateToken(userId: number): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 hari
  }));
  const signature = btoa("secret");
  return `${header}.${payload}.${signature}`;
}

// Ambil API key dari .env
const API_KEY = process.env.API_KEY;

app.use("/api/*", async (c, next) => {
  const apiKey = c.req.header("x");

  if (!apiKey || apiKey !== API_KEY) {
    return c.json({ message: "API key tidak valid!" }, 401);
  }

  await next();
});

// Endpoint Register
app.post("/register", async (c) => {
  const body = await c.req.json();

  if (!body.name || !body.email || !body.password) {
    return c.json({ message: "Name, email, dan password wajib diisi!" }, 400);
  }

  if (body.password.length < 6) {
    return c.json({ message: "Password minimal 6 karakter!" }, 400);
  }

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await db.select().from(users).where(eq(users.email, body.email));
    if (existingUser.length > 0) {
      return c.json({ message: "Email sudah terdaftar!" }, 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password);

    // Buat user baru
    const newUser = await db.insert(users).values({
      name: body.name,
      email: body.email,
      password: hashedPassword,
    }).returning();

    // Generate token
    const token = generateToken(newUser[0].id);

    return c.json({ 
      message: "Registrasi berhasil!", 
      token,
      user: {
        id: newUser[0].id,
        name: newUser[0].name,
        email: newUser[0].email,
      }
    }, 201);
  } catch (error) {
    return c.json({ message: "Gagal registrasi!" }, 500);
  }
});

// Endpoint Login
app.post("/login", async (c) => {
  const body = await c.req.json();

  if (!body.email || !body.password) {
    return c.json({ message: "Email dan password wajib diisi!" }, 400);
  }

  try {
    // Cari user berdasarkan email
    const userList = await db.select().from(users).where(eq(users.email, body.email));
    
    if (userList.length === 0) {
      return c.json({ message: "Email atau password salah!" }, 401);
    }

    const user = userList[0];

    // Hash password yang dikirim user
    const hashedInputPassword = await hashPassword(body.password);

    // Bandingkan password
    if (user.password !== hashedInputPassword) {
      return c.json({ message: "Email atau password salah!" }, 401);
    }

    // Generate token
    const token = generateToken(user.id);

    return c.json({ 
      message: "Login berhasil!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    return c.json({ message: "Gagal login!" }, 500);
  }
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
    password: await hashPassword("default123"), // Default password
  }).returning();

  return c.json({ message: "User berhasil dibuat!", data: newUser[0] }, 201);
});

export default app;