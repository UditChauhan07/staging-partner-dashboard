// "use client"
// import React, { useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";

// // -----------------------------
// // SVG Icon Components
// // -----------------------------
// interface IconProps {
//   size?: number;
// }

// const BotBadge: React.FC<IconProps> = ({ size = 28 }) => (
//   <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
//     <rect rx="12" width="64" height="64" fill="#6424EC" />
//     <circle cx="32" cy="12" r="6" fill="#FFFFFF" />
//     <rect x="30" y="18" width="4" height="8" fill="#FFFFFF" />
//     <circle cx="32" cy="36" r="18" fill="#FFFFFF" />
//     <rect x="22" y="30" width="20" height="12" rx="6" fill="#6424EC" />
//     <rect x="26" y="34" width="4" height="6" rx="2" fill="#FFFFFF" />
//     <rect x="34" y="34" width="4" height="6" rx="2" fill="#FFFFFF" />
//     <path d="M27 51l-3 9c12 0 21-3 27-8" fill="#FFFFFF" />
//   </svg>
// );

// // -----------------------------
// // Header Component
// // -----------------------------
// const Header: React.FC = () => {
//   const params = useParams();
//   const slug = params.slug as string;

//   return (
//     <nav className="rexpt-nav fixed top-0 w-full bg-white shadow-md py-2 z-10" role="navigation" aria-label="Primary">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between">
//           <button
//             className="flex items-center gap-2 bg-transparent border-0"
//             onClick={() => scroll.scrollToTop({ duration: 500 })}
//           >
//             <BotBadge />
//             <span className="font-extrabold text-rexpt-primary text-xl font-lato">Rexpt</span>
//           </button>

//           <button
//             className="lg:hidden"
//             type="button"
//             onClick={() => {
//               const nav = document.getElementById("rexptNav");
//               if (nav) nav.classList.toggle("hidden");
//             }}
//             aria-controls="rexptNav"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="text-2xl">☰</span>
//           </button>

//           <div className="hidden lg:flex lg:items-center lg:gap-6" id="rexptNav">
//             <ul className="flex gap-6">
//               <li><ScrollLink className="cursor-pointer hover:text-rexpt-primary" to="home" smooth duration={500} offset={-80}>Home</ScrollLink></li>
//               <li><a className="cursor-pointer hover:text-rexpt-primary" href={`/${slug}`}>Landing Page</a></li>
//               <li>
//                 <a
//                   className="bg-rexpt-primary text-white px-6 py-2 rounded-full shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
//                   href={process.env.NEXT_PUBLIC_APP_URL}
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Get Started
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// // -----------------------------
// // Footer Component
// // -----------------------------
// const Footer: React.FC = () => (
//   <footer className="rexpt-footer py-4 border-t bg-white text-center text-sm text-gray-600">
//     <div className="container mx-auto px-4">
//       © {new Date().getFullYear()} Rexpt. All rights reserved. •{" "}
//       <a className="text-gray-600 hover:text-rexpt-primary no-underline" href="#" onClick={(e) => e.preventDefault()}>
//         Terms of Service
//       </a>{" "}
//       •{" "}
//       <a className="text-gray-600 hover:text-rexpt-primary no-underline" href="#" onClick={(e) => e.preventDefault()}>
//         Privacy Policy
//       </a>{" "}
//       •{" "}
//       <ScrollLink className="text-gray-600 hover:text-rexpt-primary no-underline" to="home" smooth duration={500} offset={-80}>
//         Back to top
//       </ScrollLink>
//     </div>
//   </footer>
// );

// // -----------------------------
// // Signup Redirect Component
// // -----------------------------
// interface SignupRedirectProps {
//   slug: string;
// }

// const SignupRedirect: React.FC<SignupRedirectProps> = ({ slug }) => {
//   const router = useRouter();

//   useEffect(() => {
//     // Construct the signup URL with the slug
//     const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${encodeURIComponent(slug || "defaultSlug")}`;
//     // Redirect immediately
//     window.location.href = signupUrl;
//   }, [slug]);

//   return (
//     <section className="rexpt-section min-h-[78vh] flex items-center justify-center section-reveal" id="home">
//       <div className="container mx-auto px-4 text-center">
//         <h2 className="text-2xl font-extrabold font-lato text-rexpt-primary">Redirecting to Signup...</h2>
//         <p className="text-gray-600">Please wait while we take you to the signup page.</p>
//       </div>
//     </section>
//   );
// };

// // -----------------------------
// // Dynamic Route Page
// // -----------------------------
// export default function Page() {
//   const params = useParams();
//   const slug = params.slug as string;

//   return (
//     <div className="rexpt-page">
//       <style>{`
//         :root {
//           --rexpt-primary: #6424EC;
//           --rexpt-primary-700: #4B1AC7;
//           --rexpt-primary-50: #F3EEFD;
//           --rexpt-ink: #1b1b1f;
//         }
//         .rexpt-page * { box-sizing: border-box; }
//         .rexpt-page { font-family: 'Adelle Sans', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif; color: var(--rexpt-ink); }
//         .font-lato { font-family: 'Lato', sans-serif; }
//         .text-rexpt-primary { color: var(--rexpt-primary) !important; }
//         .bg-rexpt-primary { background-color: var(--rexpt-primary) !important; }
//         .bg-rexpt-primary-50 { background-color: var(--rexpt-primary-50) !important; }
//         .bg-rexpt-primary-700 { background-color: var(--rexpt-primary-700) !important; }
//         .rexpt-page .section-reveal { opacity: 0; transform: translateY(12px); transition: opacity 0.6s ease, transform 0.6s ease; }
//         .rexpt-page .section-reveal.reveal-in { opacity: 1; transform: none; }
//         .rexpt-nav .nav-link { cursor: pointer; }
//         .rexpt-page .hover-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
//         .rexpt-page .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 1rem 1.75rem rgba(0,0,0,0.12) !important; }
//         .rexpt-page .icon-wrap svg { display: block; }
//         .rexpt-page .selectable { user-select: text; }
//         @media (min-width: 1024px) {
//           .rexpt-hero .text-5xl { font-size: 3.2rem; }
//         }
//       `}</style>
//       <link rel="preconnect" href="https://fonts.googleapis.com" />
//       <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//       <link
//         href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Adelle+Sans:wght@400;600;700&display=swap"
//         rel="stylesheet"
//       />
//       <Header />
//       <SignupRedirect slug={slug} />
//       <Footer />
//     </div>
//   );
// }


import { redirect } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

export default function Page({ params }: PageProps) {
  const slug = params.slug || "defaultSlug";
  const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${encodeURIComponent(slug)}`;

  redirect(signupUrl);
}
