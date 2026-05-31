import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Client } from "@/types/demo";

const clientsDirectory = path.join(process.cwd(), "data", "clients");

export type ClientSlug = string;

export function getClient(slug: string): Client | null {
  const filePath = path.join(clientsDirectory, `${slug}.json`);

  if (!existsSync(filePath)) {
    return null;
  }

  return JSON.parse(readFileSync(filePath, "utf8")) as Client;
}

export function getClientSlugs(): ClientSlug[] {
  return readdirSync(clientsDirectory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""));
}
