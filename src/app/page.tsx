import { App } from "@/components/App";
import { hasApiKey } from "@/lib/anthropic";

// Demo mode is decided on the server so the landing page can say so up front,
// rather than the user finding out after they've typed their goal.
export const dynamic = "force-dynamic";

export default function Page() {
  return <App demoMode={!hasApiKey()} />;
}
