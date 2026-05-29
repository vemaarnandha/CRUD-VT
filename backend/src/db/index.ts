import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:database.db", // file SQLite disimpan di root project
});

export const db = drizzle(client);