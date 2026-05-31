import "./globals.css";

export const metadata = {
  title: "Operator Command Center",
  description: "Your AI Chief of Staff. Powered by Optentia."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
