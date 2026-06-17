import Link from "next/link";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { staticAssets } from "@/app/lib/assets";
import type { Metadata } from "next";
import { absoluteUrl } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Free Membership Agreement",
  alternates: {
    canonical: absoluteUrl("/free-membership-agreement"),
  },
  robots: {
    index: false,
    follow: false,
  },
};

const sections = [
  {
    title: "Eligibility",
    body: "Membership is intended only for adults of legal age to purchase age-restricted products in their location. By joining, you confirm that the information you provide is accurate and that you meet all applicable age requirements.",
  },
  {
    title: "Membership Access",
    body: "Your free membership gives you access to account features, order history, saved profile details, and promotional updates from CigarroElectrico. We may update or discontinue membership features at any time to improve the service.",
  },
  {
    title: "Account Responsibilities",
    body: "You are responsible for keeping your login credentials secure and for all activity under your account. If you believe your account has been accessed without authorization, contact us promptly so we can help protect it.",
  },
  {
    title: "Orders And Availability",
    body: "Membership does not guarantee product availability, delivery windows, or pricing. Orders remain subject to stock, verification, and any applicable laws, policies, and service restrictions.",
  },
  {
    title: "Marketing Communications",
    body: "By creating an account, you agree that we may send membership-related updates and promotional messages. You can opt out of marketing communications at any time through future unsubscribe options or by contacting support.",
  },
  {
    title: "Changes To This Agreement",
    body: "This sample agreement may be updated as the business, policies, or legal requirements evolve. Continued use of the membership service after changes are posted will be treated as acceptance of the revised terms.",
  },
];

export default function FreeMembershipAgreementPage() {
  return (
    <div className='min-h-screen bg-[#030303] text-white selection:bg-[#D4AF37]/30'>
      <Navbar />

      <main className='relative overflow-hidden pt-28 sm:pt-32 pb-20'>
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.14),_transparent_40%)]' />
          <img
            src={staticAssets.backgroundPattern}
            alt='Background pattern'
            className='absolute inset-0 w-full h-full object-cover opacity-10'
            crossOrigin="anonymous"
          />
          <div className='absolute inset-0 bg-gradient-to-b from-[#030303] via-[#030303]/90 to-[#030303]' />
        </div>

        <div className='relative z-10 max-w-4xl mx-auto px-6'>
          <div className='mb-10'>
            <p className='text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.35em] mb-4'>
              Sample Legal Page
            </p>
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight text-white mb-4'>
              Free Membership Agreement
            </h1>
            <p className='text-zinc-400 text-sm sm:text-base leading-7 max-w-3xl'>
              This is a sample agreement page for the frontend flow. It is not
              legal advice and should be reviewed and replaced with your final
              approved terms before production use.
            </p>
          </div>

          <div className='rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-8 md:p-10 space-y-8'>
            {sections.map((section) => (
              <section key={section.title} className='space-y-3'>
                <h2 className='text-[#D4AF37] text-lg sm:text-xl font-black uppercase tracking-[0.18em]'>
                  {section.title}
                </h2>
                <p className='text-zinc-300 leading-7 text-sm sm:text-base'>
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <div className='mt-8 flex flex-wrap items-center gap-4 text-sm'>
            <Link
              href='/auth/login'
              className='inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-6 py-3 font-black uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#F2D37D]'
            >
              Return To Login
            </Link>
            <Link
              href='/privacy-policy'
              className='text-[#D4AF37] hover:text-[#F2D37D] transition-colors underline underline-offset-4'
            >
              View Privacy Policy
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
