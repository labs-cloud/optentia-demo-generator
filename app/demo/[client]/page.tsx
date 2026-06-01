import OperatorConsoleApp from "@/app/console/OperatorConsoleApp";
import { getClientSlugs } from "@/lib/client-data";

// Keep the existing per-client slugs resolving (chaim, lawfirm, …) so old links
// still work — they now all render the unified Operator Console, whose industry
// is chosen from the top-bar switcher.
export function generateStaticParams() {
  return getClientSlugs().map((client) => ({ client }));
}

export default function ClientDemoPage() {
  return <OperatorConsoleApp />;
}
