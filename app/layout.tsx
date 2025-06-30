import "../styles/globals.css";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { ReduxProvider } from "./provider";

export const metadata = {
  title: "Dashboard",
  description: "Your Next.js MUI Dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastContainer />
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
