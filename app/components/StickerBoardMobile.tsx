"use client";

import { useState } from "react";
import ShuffleCardBoxMobile from "./ShuffleCardBoxMobile";

export type StickerItem = {
  id: string;
  image: string;
  description?: string;
  link?: string;
};

export default function StickerBoardMobile({
  items,
}: {
  items: StickerItem[];
}) {
  const [popup, setPopup] = useState<string | null>(null);

  const cardsData = [
  {
    id: "1",
    title: "Yo, I'm Aakaash.",
    description:
      "Master’s student in Information Technology in New Zealand with a strong focus on backend engineering, scalable system design, and real-world production-ready software. I enjoy building systems that are reliable, secure, and performance-driven.",
  },
  {
    id: "2",
    title: "Full-Stack Systems Builder",
    description:
      "I design and build scalable full-stack applications — from performant backend architectures and REST APIs to responsive frontend interfaces. Strong focus on authentication systems, database design, clean architecture, and production-ready deployments.",
  },
  {
    id: "3",
    title: "CloudVault",
    description:
      "A modern file storage dashboard built with Next.js and Tailwind CSS featuring structured file management, analytics view, upload workflows, and a clean, responsive UI architecture.",
    buttonText: "Open Project",
    link: "https://cloudvault-alpha.vercel.app/",
  },
  {
    id: "4",
    title: "Exaba Mobile Backup App",
    description:
      "Developed a secure Flutter-based mobile application that integrates with S3-compatible object storage. Implemented IAM authentication, per-user bucket provisioning, token-based security, and optimized media synchronization workflows.",
  },
  {
    id: "5",
    title: "Taniwha Trails",
    description:
      "An interactive storytelling platform preserving Māori lake legends. Designed with cultural sensitivity, including structured navigation, user-role-based access control, and immersive UI for educational engagement.",
    buttonText: "Explore",
    link: "https://tanwhia.vercel.app/",
  },
  {
    id: "6",
    title: "AI Medical Dashboard",
    description:
      "Full-stack AI-powered medical dashboard designed to analyze and visualize patient health data.",
    buttonText: "Open Project",
    link: "https://med2-xi.vercel.app/",
  },
  {
    id: "7",
    title: "High-Performance Focus",
    description:
      "Deeply interested in real-time systems, distributed architectures, and backend performance optimization.",
    buttonText: "Tech Interests",
    link: "https://www.linkedin.com/in/aakaash-charles-6b8678247/",
  },
  {
    id: "8",
    title: "Tech Stack",
    description:
      "Hands-on experience with Node.js, React, Next.js, Flutter, MongoDB, MySQL, Java, Python, Docker, and cloud-style architectures.",
    buttonText: "Resume",
    link: "/Charles-CV.pdf",
  },
  {
    id: "9",
    title: "Problem Solver",
    description:
      "I approach problems by breaking them into structured components, designing clean solutions, and iterating toward optimization.",
  },
  {
    id: "10",
    title: "Career Mission",
    description:
      "My long-term goal is to become a high-impact backend engineer contributing to large-scale distributed systems.",
  },
  {
    id: "11",
    title: "Entrepreneurial Mindset",
    description:
      "Beyond employment, I’m interested in building scalable SaaS products and technology-driven platforms.",
  },
  {
    id: "12",
    title: "Currently Building",
    description:
      "Actively refining production-level applications, improving UI/UX standards, strengthening backend scalability.",
  },
];
  const filteredItems = items.slice(1);

  return (
    <div className="w-full min-h-screen bg-black text-white overflow-y-auto">

      {/* ===== TOP SECTION ===== */}
      <section className="relative pt-16 pb-12 px-4 flex justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-blue-500/20 blur-3xl rounded-full -z-10" />
        <ShuffleCardBoxMobile cards={cardsData} />
      </section>

      {/* Divider */}
      <div className="w-full h-[1px] bg-white/10 mb-10" />

      {/* ===== STICKERS ===== */}
      <section className="px-6 pb-24">
        <h3 className="text-sm uppercase tracking-widest text-white/50 mb-6">
          Explore More
        </h3>

        <div className="grid grid-cols-2 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.link) {
                  window.open(item.link, "_blank");
                } else if (item.description) {
                  setPopup(item.description);
                }
              }}
              className="
                bg-white/5
                backdrop-blur-xl
                border border-white/10
                rounded-2xl
                p-5
                flex items-center justify-center
                transition-all duration-300
                active:scale-95
                hover:bg-white/10
                shadow-[0_10px_30px_rgba(0,0,0,0.5)]
              "
            >
              <img
                src={item.image}
                className="w-20 object-contain transition-transform duration-300 hover:scale-110"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ===== POPUP ===== */}
      {popup && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999] px-6"
          onClick={() => setPopup(null)}
        >
          <div
            className="
              bg-white text-black
              rounded-2xl
              p-6
              max-w-sm
              text-sm
              shadow-2xl
              transition-all duration-200
              scale-100
            "
            onClick={(e) => e.stopPropagation()}
          >
            {popup}
          </div>
        </div>
      )}
    </div>
  );
}
