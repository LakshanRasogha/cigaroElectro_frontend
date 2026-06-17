import type { Metadata } from "next";
import Register from "./register-client";
import { absoluteUrl } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Create Account | CigarroElectrico",
  description:
    "Register for a CigarroElectrico account to shop securely, track orders, and manage your preferences.",
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
