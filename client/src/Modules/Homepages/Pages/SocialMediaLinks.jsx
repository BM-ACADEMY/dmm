import React from "react";
import { Twitter } from 'lucide-react';

const SocialMediaLinks = () => {

  const SocialCard = ({
    title,
    icon,
    color,
    children,
    buttonLink,
    buttonText,
    buttonColor,
  }) => (
    <div
      className={`bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 ${color} hover:-translate-y-2 transition-transform duration-300 flex flex-col`}
    >
      <div className="p-6 text-center flex-grow flex flex-col">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-3xl">{icon}</span>
          {/* Card Title updated to match reference font */}
          <h3 className="text-xl font-black text-[#1a2b48] tracking-tight">{title}</h3>
        </div>

        <div className="flex justify-center mb-6 overflow-hidden rounded-xl bg-[#f0f0f0]/50 border border-slate-100 min-h-[200px] items-center">
          {children}
        </div>

        <div className="mt-auto">
          <a
            href={buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-black text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg w-full justify-center uppercase tracking-widest text-xs ${buttonColor}`}
          >
            {buttonText}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    /* Section Background updated to #f0f0f0 */
    <section className="relative w-full bg-[#f0f0f0] py-20 md:py-28 overflow-hidden">

      <style>
        {`
          /* Importing the geometric font from your reference */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');

          .font-dmm-reference { font-family: 'Inter', sans-serif; }
        `}
      </style>

      {/* Subtle Background Pattern matching brand blue */}
      <div className="absolute inset-0 bg-[radial-gradient(#0024f8_1px,transparent_1px)] [background-size:30px_30px] opacity-[0.03] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 font-dmm-reference">

        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* Main Title updated to Brand Blue and Reference Font */}
          <h2 className="text-4xl md:text-6xl font-black text-[#0024f8] mb-6 tracking-tighter uppercase">
           Social Media
          </h2>
          {/* Decoration line */}
          <div className="w-24 h-1.5 bg-[#0024f8] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* 👍 FACEBOOK */}
          <SocialCard
            title="Facebook"
            icon="📘"
            color="border-[#0024f8]"
            buttonLink="https://www.facebook.com/people/Desiya-Makkal-Munnani/pfbid05iSFioidy4PmUaKhsuDm7zWu2cNT8Nvqo9GptMT2VpwiFyGZiFbUAQhNs1bTrGFvl/"
            buttonText="Follow"
            buttonColor="bg-[#0024f8]"
          >
            <div className="flex flex-col items-center justify-center p-8 text-[#0024f8]/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-16 h-16 mb-4"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <p className="text-sm font-black uppercase tracking-widest text-[#1a2b48] text-center">Desiya Makkal Munnani</p>
            </div>
          </SocialCard>

          {/* 📸 INSTAGRAM */}
          <SocialCard
            title="Instagram"
            icon="📸"
            color="border-[#0024f8]"
            buttonLink="https://www.instagram.com/dmmparty_26/"
            buttonText="Follow"
            buttonColor="bg-[#0024f8]"
          >
            <iframe
              title="dmm Instagram"
              src="https://www.instagram.com/dmmparty_26/embed"
              width="100%"
              height="300"
              className="rounded-lg border-none overflow-hidden"
              allowTransparency="true"
            ></iframe>
          </SocialCard>

          {/* 𝕏 TWITTER (X) */}
          <SocialCard
            title="Twitter"
            icon="𝕏"
            color="border-[#1a2b48]"
            buttonLink="https://x.com/DmmParty2026"
            buttonText="Follow"
            buttonColor="bg-[#1a2b48]"
          >
            <div className="flex flex-col items-center justify-center p-8 text-[#1a2b48]/30">
              <Twitter size={60} strokeWidth={1.5} />
              <p className="mt-4 text-sm font-black uppercase tracking-widest">@DmmParty2026</p>
            </div>
          </SocialCard>

          {/* ▶️ YOUTUBE */}
          <SocialCard
            title="YouTube"
            icon="▶️"
            color="border-[#0024f8]"
            buttonLink="https://www.youtube.com/@DMMPARTY-f2v"
            buttonText="Subscribe"
            buttonColor="bg-[#0024f8]"
          >
            <div className="flex flex-col items-center justify-center p-8 text-[#0024f8]/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-16 h-16 mb-4"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              <p className="text-sm font-black uppercase tracking-widest text-[#1a2b48]">@DMMPARTY-f2v</p>
            </div>
          </SocialCard>

        </div>
      </div>
    </section>
  );
};

export default SocialMediaLinks;
