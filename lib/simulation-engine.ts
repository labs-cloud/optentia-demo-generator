import type { ActivityEvent, Client } from "@/types/demo";

export function runSimulation(client: Client, currentFeed: ActivityEvent[]): ActivityEvent[] {
  return [...client.demoScenario.events, ...currentFeed];
}
