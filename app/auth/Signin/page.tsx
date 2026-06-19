import type { Metadata } from "next";
import Register from "./register-client";
import { absoluteUrl } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Create Account | CigarroElectrico",
  description:
    "Create a CigarroElectrico account to shop securely, track orders, and manage your preferences across your devices in Sri Lanka.",
  alternates: {
    canonical: absoluteUrl("/auth/Signin"),
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return <Register />;
}
