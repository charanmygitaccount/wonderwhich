import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WonderWhich — see the plan, not the paragraph",
  description:
    "Describe what you want to build. Get a visual, click-by-click plan of which tools to use and exactly how to use them — costed at zero budget, lean, or pro.",
};

export const viewport: Viewport = {
  themeColor: "#08090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="grid-bg">
        <div className="relative z-[1]">{children}</div>
      </body>
    </html>
  );
}
