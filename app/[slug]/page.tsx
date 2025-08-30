"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { useParams } from "next/navigation";

// -----------------------------
// SVG Icon Components
// -----------------------------
interface IconProps {
  size?: number;
}

const BotBadge: React.FC<IconProps> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect rx="12" width="64" height="64" fill="#6424EC" />
    <circle cx="32" cy="12" r="6" fill="#FFFFFF" />
    <rect x="30" y="18" width="4" height="8" fill="#FFFFFF" />
    <circle cx="32" cy="36" r="18" fill="#FFFFFF" />
    <rect x="22" y="30" width="20" height="12" rx="6" fill="#6424EC" />
    <rect x="26" y="34" width="4" height="6" rx="2" fill="#FFFFFF" />
    <rect x="34" y="34" width="4" height="6" rx="2" fill="#FFFFFF" />
    <path d="M27 51l-3 9c12 0 21-3 27-8" fill="#FFFFFF" />
  </svg>
);

const Icon24x7: React.FC<IconProps> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="32" cy="32" r="28" stroke="#6424EC" strokeWidth="4" />
    <path d="M32 14v18l12 7" stroke="#6424EC" strokeWidth="4" strokeLinecap="round" />
    <path d="M14 36c0-9.94 8.06-18 18-18" stroke="#C6AFF6" strokeWidth="4" strokeLinecap="round" />
    <text x="22" y="56" fontFamily="Lato, sans-serif" fontWeight="700" fontSize="12" fill="#6424EC">24/7</text>
  </svg>
);

const IconRouting: React.FC<IconProps> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M10 16h44M10 32h28M10 48h44" stroke="#6424EC" strokeWidth="4" strokeLinecap="round" />
    <circle cx="52" cy="16" r="6" fill="#6424EC" />
    <circle cx="38" cy="32" r="6" fill="#6424EC" />
    <circle cx="52" cy="48" r="6" fill="#6424EC" />
    <path d="M46 16l-6 6M44 48l-6-6" stroke="#C6AFF6" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const IconHumanLike: React.FC<IconProps> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="32" cy="24" r="12" fill="#6424EC" />
    <rect x="12" y="36" width="40" height="18" rx="9" fill="#6424EC" />
    <circle cx="28" cy="22" r="2.5" fill="#FFFFFF" />
    <circle cx="36" cy="22" r="2.5" fill="#FFFFFF" />
    <path d="M26 28c2.4 2 9.6 2 12 0" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    <path d="M20 48c10 4 14 4 24 0" stroke="#C6AFF6" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const IconCost: React.FC<IconProps> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect width="64" height="64" rx="14" fill="#F3EEFD" />
    <path d="M32 12v40M20 22h24M20 42h24" stroke="#6424EC" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const IconCX: React.FC<IconProps> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect width="64" height="64" rx="14" fill="#F3EEFD" />
    <circle cx="24" cy="26" r="8" fill="#6424EC" />
    <path d="M40 20h10v24H40l-8 6V14l8 6z" fill="#6424EC" />
  </svg>
);

const IconLeads: React.FC<IconProps> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect width="64" height="64" rx="14" fill="#F3EEFD" />
    <path d="M16 40c8 0 8 8 16 8s8-8 16-8" stroke="#6424EC" strokeWidth="4" fill="none" strokeLinecap="round" />
    <circle cx="32" cy="24" r="10" stroke="#6424EC" strokeWidth="4" fill="none" />
    <path d="M32 20v8l4 2" stroke="#6424EC" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const IconSecure: React.FC<IconProps> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect width="64" height="64" rx="14" fill="#F3EEFD" />
    <rect x="18" y="28" width="28" height="20" rx="4" fill="#6424EC" />
    <path d="M24 28v-3a8 8 0 0116 0v3" stroke="#C6AFF6" strokeWidth="3" />
  </svg>
);

// -----------------------------
// Header Component
// -----------------------------
const Header: React.FC = ({ReferalName}) => (
  <nav className="rexpt-nav fixed top-0 w-full bg-white shadow-md py-2 z-10" role="navigation" aria-label="Primary">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between">
        <button
          className="flex items-center gap-2 bg-transparent border-0"
          onClick={() => scroll.scrollToTop({ duration: 500 })}
        >
          <BotBadge />
          <span className="font-extrabold text-rexpt-primary text-xl font-lato">Rexpt</span>
        </button>

        <button
          className="lg:hidden"
          type="button"
          onClick={() => {
            const nav = document.getElementById("rexptNav");
            if (nav) nav.classList.toggle("hidden");
          }}
          aria-controls="rexptNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="text-2xl">☰</span>
        </button>

        <div className="hidden lg:flex lg:items-center lg:gap-6" id="rexptNav">
          <ul className="flex gap-6">
            <li><ScrollLink className="cursor-pointer hover:text-rexpt-primary" to="features" smooth duration={500} offset={-80}>Features</ScrollLink></li>
            <li><ScrollLink className="cursor-pointer hover:text-rexpt-primary" to="benefits" smooth duration={500} offset={-80}>Benefits</ScrollLink></li>
            <li><ScrollLink className="cursor-pointer hover:text-rexpt-primary" to="testimonials" smooth duration={500} offset={-80}>Testimonials</ScrollLink></li>
            <li>
              <a
                className="bg-rexpt-primary text-white px-6 py-2 rounded-full shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/${ReferalName}`}
                target="_blank"
                rel="noreferrer"
              >
                Get Started
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
);

// -----------------------------
// Hero Section Component
// -----------------------------
const HeroSection: React.FC = ({ReferalName}) => (
  <header
  className="rexpt-hero flex items-center min-h-[78vh] pt-20"
  style={{
    background: `
      radial-gradient(1200px 500px at 50% -20%, #9265F0 0%, transparent 60%), 
      linear-gradient(180deg, var(--rexpt-primary) 0%, var(--rexpt-primary-700) 100%)
    `,
  }}
  id="home"
  role="banner"
>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Adelle+Sans:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <div className="container mx-auto px-4 text-center text-white py-12">
      <div className="max-w-3xl mx-auto">
        <span className="inline-block bg-white text-rexpt-primary rounded-full px-4 py-2 mb-4 shadow">AI Receptionist • 24/7</span>
        <h1 className="text-4xl lg:text-5xl font-extrabold font-lato mb-4">Meet Rexpt: Your Business's New Voice.</h1>
        <p className="text-lg opacity-95 mb-6">Our AI receptionist handles your inbound calls 24/7, so you can focus on what matters most.</p>
        <div className="flex gap-4 justify-center">
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL}/${ReferalName}`}
            target="_blank"
            rel="noreferrer"
            className="bg-white text-rexpt-primary px-6 py-3 rounded-full font-semibold shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
          >
            Get Started Now
          </a>
          <ScrollLink
            to="features"
            smooth
            duration={500}
            offset={-80}
            className="border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-rexpt-primary transition"
          >
            Learn More
          </ScrollLink>
        </div>
      </div>
    </div>
  </header>
);

// -----------------------------
// Features Section Component
// -----------------------------
interface FeatureCardProps {
  Icon: React.FC<IconProps>;
  title: string;
  text: string;
}

const FeaturesSection: React.FC = () => (
  <section id="features" className="rexpt-section py-12 section-reveal" aria-label="Why Rexpt is the Right Choice">
    <div className="container mx-auto px-4">
      <h2 className="text-center text-3xl font-extrabold font-lato mb-4">Why Rexpt is the Right Choice</h2>
      <p className="text-center text-gray-600 mb-8">Three powerful capabilities to elevate every call.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          Icon={Icon24x7}
          title="24/7 Call Handling"
          text="Never miss a call again. Our AI agents greet callers and capture details day or night."
        />
        <FeatureCard
          Icon={IconRouting}
          title="Intelligent Call Routing"
          text="Efficiently route callers to the right person or workflow—no manual juggling."
        />
        <FeatureCard
          Icon={IconHumanLike}
          title="Human-like Conversations"
          text="Provide a consistent, professional experience with natural language understanding."
        />
      </div>
    </div>
  </section>
);

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, text }) => (
  <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition transform hover:-translate-y-0.5">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-rexpt-primary-50 rounded-lg"><Icon /></div>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <p className="text-gray-600">{text}</p>
  </div>
);

// -----------------------------
// Benefits Section Component
// -----------------------------
interface BenefitItemProps {
  Icon: React.FC<IconProps>;
  title: string;
  text: string;
}

const BenefitsSection: React.FC = () => (
  <section id="benefits" className="rexpt-section py-12 bg-gray-100 section-reveal" aria-label="Transform Your Business Operations">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div>
          <h2 className="text-3xl font-extrabold font-lato mb-3">Transform Your Business Operations</h2>
          <p className="text-gray-600">Discover how Rexpt can streamline your customer experience and help your team focus on higher‑value work.</p>
        </div>
        <div>
          <BenefitItem
            Icon={IconCost}
            title="Cost‑Effective"
            text="Drastically reduce operational costs compared to traditional receptionists."
          />
          <BenefitItem
            Icon={IconCX}
            title="Improved Customer Experience"
            text="Deliver consistent, high‑quality interactions that build trust and loyalty."
          />
          <BenefitItem
            Icon={IconLeads}
            title="Lead Nurturing & Analysis"
            text="Capture every lead and get actionable insights to help your sales team close more deals."
          />
          <BenefitItem
            Icon={IconSecure}
            title="Secure and Reliable"
            text="Your data and conversations are protected with robust security protocols."
          />
        </div>
      </div>
    </div>
  </section>
);

const BenefitItem: React.FC<BenefitItemProps> = ({ Icon, title, text }) => (
  <div className="flex items-start gap-3 mb-4 p-4 bg-white rounded-lg shadow-sm">
    <div className="flex-shrink-0"><Icon /></div>
    <div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  </div>
);

// -----------------------------
// Testimonials Section Component
// -----------------------------
interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
}

const TestimonialsSection: React.FC = () => (
  <section id="testimonials" className="rexpt-section py-12 section-reveal" aria-label="What Our Customers Say">
    <div className="container mx-auto px-4">
      <h2 className="text-center text-3xl font-extrabold font-lato mb-4">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
        <TestimonialCard
          name="Jane Doe"
          role="Clinic Manager"
          quote="Rexpt has completely changed how we manage inbound calls. We’re never missing leads and our patients get answers in seconds."
        />
        <TestimonialCard
          name="John Smith"
          role="Owner, ServiceCo"
          quote="Thanks to Rexpt, our response time has dropped dramatically, and every call is logged with context for follow‑up."
        />
      </div>
    </div>
  </section>
);

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, role, quote }) => (
  <figure className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
    <blockquote className="mb-3">“{quote}”</blockquote>
    <figcaption className="flex items-center gap-2">
      <div className="rounded-full bg-rexpt-primary-50 p-1"><BotBadge size={20} /></div>
      <span className="font-semibold">{name}</span>
      <span className="text-gray-600">— {role}</span>
    </figcaption>
  </figure>
);

// -----------------------------
// Final CTA Component
// -----------------------------
const FinalCTA: React.FC = ({ReferalName}) => (
<section
  className="rexpt-section py-12 text-center text-white"
  style={{
    background: `
      radial-gradient(1200px 500px at 50% -20%, #9265F0 0%, transparent 60%), 
      linear-gradient(180deg, var(--rexpt-primary) 0%, var(--rexpt-primary-700) 100%)
    `,
  }}
>
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-extrabold font-lato mb-2">Ready to Automate Your Calls?</h2>
      <p className="text-lg mb-4">Join hundreds of businesses already saving time and money with Rexpt.</p>
      <a
        href={`${process.env.NEXT_PUBLIC_APP_URL}/${ReferalName}`}
        target="_blank"
        rel="noreferrer"
        className="bg-white text-rexpt-primary px-6 py-3 rounded-full font-semibold shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
      >
        Get Started Today
      </a>
    </div>
  </section>
);

// -----------------------------
// Partner Contact Component
// -----------------------------
interface PartnerContactProps {
  PARTNER_PHONE: string;
  PARTNER_NAME: string;
  PARTNER_EMAIL: string;
}

interface ContactCardProps {
  title: string;
  value: string;
  Icon: React.FC;
}

const PartnerContact: React.FC<PartnerContactProps> = ({ PARTNER_PHONE, PARTNER_NAME, PARTNER_EMAIL }) => (
  <section className="rexpt-section py-12 bg-white section-reveal" aria-label="Contact Your Rexpt Partner">
    <div className="container mx-auto px-4">
      <h2 className="text-center text-3xl font-extrabold font-lato mb-4">Questions? Contact Your Rexpt Partner</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        <ContactCard
          title="Partner's Name"
          value={PARTNER_NAME}
          Icon={() => (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <circle cx="12" cy="7" r="4" fill="#6424EC" /><path d="M4 20c0-4 4-7 8-7s8 3 8 7" fill="#C6AFF6" />
            </svg>
          )}
        />
        <ContactCard
          title="Email"
          value={PARTNER_EMAIL}
          Icon={() => (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2" fill="#6424EC" /><path d="M4 7l8 6 8-6" stroke="#C6AFF6" strokeWidth="2" />
            </svg>
          )}
        />
        <ContactCard
          title="Phone Number"
          value={PARTNER_PHONE}
          Icon={() => (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M6 3h4l2 5-3 2a14 14 0 007 7l2-3 5 2v4c0 1-1 2-2 2C9 22 2 15 2 5c0-1 1-2 2-2z" fill="#6424EC"/>
            </svg>
          )}
        />
      </div>
    </div>
  </section>
);

const ContactCard: React.FC<ContactCardProps> = ({ title, value, Icon }) => (
  <div className="bg-white shadow-md rounded-lg p-6 text-center w-full max-w-sm">
    <div className="mb-3 flex justify-center"><Icon /></div>
    <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
    <p className="font-bold select-text">{value}</p>
  </div>
);

// -----------------------------
// Footer Component
// -----------------------------
const Footer: React.FC = () => (
  <footer className="rexpt-footer py-4 border-t bg-white text-center text-sm text-gray-600">
    <div className="container mx-auto px-4">
      © {new Date().getFullYear()} Rexpt. All rights reserved. •{" "}
      <a className="text-gray-600 hover:text-rexpt-primary no-underline" href="#" onClick={(e) => e.preventDefault()}>
        Terms of Service
      </a>{" "}
      •{" "}
      <a className="text-gray-600 hover:text-rexpt-primary no-underline" href="#" onClick={(e) => e.preventDefault()}>
        Privacy Policy
      </a>{" "}
      •{" "}
      <ScrollLink className="text-gray-600 hover:text-rexpt-primary no-underline" to="home" smooth duration={500} offset={-80}>
        Back to top
      </ScrollLink>
    </div>
  </footer>
);

// -----------------------------
// Rexpt Landing Page Component
// -----------------------------
interface PartnerDetails {
  name: string;
  email: string;
  phone: string;
  referalName: string;
}

interface RexptLandingPageProps {
  slug: string;
}

const RexptLandingPage: React.FC<RexptLandingPageProps> = ({ slug }) => {
  const [PARTNER_NAME, setPARTNER_NAME] = useState<string>("");
  const [PARTNER_EMAIL, setPARTNER_EMAIL] = useState<string>("");
  const [PARTNER_PHONE, setPARTNER_PHONE] = useState<string>("");
  const [ReferalName, setReferalName] = useState<string>("");

  const fetchPartnerDetails = async (slug: string) => {
    try {
      const res = await axios.get<PartnerDetails>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/endusers/getPartnerDetailbyReferalName/${slug}`
      );

      if (res.status === 200) {
        console.log("✅ Partner details fetched:", res.data);
        setPARTNER_NAME(res.data.name);
        setPARTNER_EMAIL(res.data.email);
        setPARTNER_PHONE(res.data.phone);
        setReferalName(res.data.referalName)
        return { success: true, data: res.data };
      } else {
        console.warn("⚠️ Unexpected status:", res.status);
        return { success: false, error: `Unexpected status: ${res.status}` };
      }
    } catch (error) {
      console.error("❌ Error fetching partner details:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return {
            success: false,
            error: error.response.data || "Server Error",
            status: error.response.status,
          };
        } else if (error.request) {
          return { success: false, error: "No response from server" };
        } else {
          return { success: false, error: error.message };
        }
      }
      return { success: false, error: "Unknown error" };
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("reveal-in");
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll(".section-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const effectiveSlug = slug || "defaultSlug";
    console.log(effectiveSlug);
    if (effectiveSlug) {
      fetchPartnerDetails(effectiveSlug);
    }
  }, [slug]);

  return (
    <div className="rexpt-page">
      <style>{`
        :root {
          --rexpt-primary: #6424EC;
          --rexpt-primary-700: #4B1AC7;
          --rexpt-primary-50: #F3EEFD;
          --rexpt-ink: #1b1b1f;
        }
        .rexpt-page * { box-sizing: border-box; }
        .rexpt-page { font-family: 'Adelle Sans', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif; color: var(--rexpt-ink); }
        .font-lato { font-family: 'Lato', sans-serif; }
        .text-rexpt-primary { color: var(--rexpt-primary) !important; }
        .bg-rexpt-primary { background-color: var(--rexpt-primary) !important; }
        .bg-rexpt-primary-50 { background-color: var(--rexpt-primary-50) !important; }
        .bg-rexpt-primary-700 { background-color: var(--rexpt-primary-700) !important; }
        .rexpt-page .section-reveal { opacity: 0; transform: translateY(12px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .rexpt-page .section-reveal.reveal-in { opacity: 1; transform: none; }
        .rexpt-nav .nav-link { cursor: pointer; }
        .rexpt-page .hover-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .rexpt-page .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 1rem 1.75rem rgba(0,0,0,0.12) !important; }
        .rexpt-page .icon-wrap svg { display: block; }
        .rexpt-page .selectable { user-select: text; }
        @media (min-width: 1024px) {
          .rexpt-hero .text-5xl { font-size: 3.2rem; }
        }
      `}</style>
      <Header ReferalName={ReferalName} />
      <HeroSection ReferalName={ReferalName}/>
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <FinalCTA ReferalName={ReferalName}/>
      <PartnerContact PARTNER_PHONE={PARTNER_PHONE} PARTNER_NAME={PARTNER_NAME} PARTNER_EMAIL={PARTNER_EMAIL} />
      <Footer />
    </div>
  );
};

// -----------------------------
// Dynamic Route Page
// -----------------------------
export default function Page() {
  const params = useParams();
  const slug = params.slug as string;

  return <RexptLandingPage slug={slug} />;
}