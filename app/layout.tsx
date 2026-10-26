import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "WaterServe | Calbayog City Water Services",
  description:
    "Report water service issues, track repairs, and connect with the maintenance team in Calbayog City.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
