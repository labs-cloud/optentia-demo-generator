import { notFound } from "next/navigation";
import { OperatorCommandCenter } from "@/components/OperatorCommandCenter";
import { getClient, getClientSlugs } from "@/lib/client-data";

export function generateStaticParams() {
  return getClientSlugs().map((client) => ({ client }));
}

export default async function ClientDemoPage({
  params
}: {
  params: Promise<{ client: string }>;
}) {
  const { client: slug } = await params;
  const client = getClient(slug);

  if (!client) {
    notFound();
  }

  return <OperatorCommandCenter client={client} />;
}
