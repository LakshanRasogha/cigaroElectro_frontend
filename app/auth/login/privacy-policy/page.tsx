import Link from "next/link";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { staticAssets } from "@/app/lib/assets";


const sections = [
  {
    title: "Information We Collect",
    body: "We may collect information you provide directly, including your name, email address, phone number, shipping details, and account preferences. We may also collect basic technical information needed to operate the site and improve performance.",
  },
  {
    title: "How We Use Information",
    body: "Your information may be used to create and manage your account, process orders, provide support, send service updates, and share marketing communications related to our products, offers, and membership benefits.",
  },
  {
    title: "Marketing Choices",
    body: "You can opt out of marketing messages at any time through unsubscribe tools, future account settings, or by contacting the business directly. Service-related communications may still be sent when necessary for transactions or account security.",
  },
  {
    title: "Sharing And Service Providers",
    body: "We may share limited information with service providers that help us operate the store, deliver orders, process communications, or maintain technical systems. We do not intend this sample policy to authorize broader data sales.",
  },
  {
    title: "Security",
    body: "We take reasonable steps to protect account information, but no platform can promise absolute security. Customers should also protect their passwords and notify support if they suspect unauthorized access.",
  },
  {
    title: "Policy Updates",
    body: "This sample privacy policy should be replaced with your final approved version. We may update it over time to reflect operational, legal, or product changes, and the latest version should always be posted on the site.",
  },
];

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className='text-zinc-400 text-sm sm:text-base leading-7 max-w-3xl'>
              This is a sample privacy policy for the frontend link flow. It
              should be reviewed, edited, and approved with your real business
              practices before being treated as a final legal document.
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
              href='/auth/login/free-membership-agreement'
              className='text-[#D4AF37] hover:text-[#F2D37D] transition-colors underline underline-offset-4'
            >
              View Membership Agreement
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
