import type { Metadata } from "next";
import LoginPage from "./login-client";
import { absoluteUrl } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Login | CigarroElectrico",
  description:
    "Sign in to your CigarroElectrico account to manage orders, saved items, and account details.",
  alternates: {
    canonical: absoluteUrl("/auth/login"),
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return <LoginPage />;
}
