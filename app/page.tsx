"use client";

import { useEffect, useRef, useState } from "react";
import Loader from "./components/Loader";
import StickerBoard from "./components/StickerBoard";
import ShuffleCardBox from "./components/ShuffleCardBox";
import { stickersData } from "./components/stickersData";

const LOFI_STREAM = "https://stream.zeno.fm/0r0xa792kwzuv";

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

export default function Page() {
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Try autoplay when loader completes
  useEffect(() => {
    if (loaded && audioRef.current) {
      audioRef.current.volume = 0.4;

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => console.log("Autoplay blocked by browser"));
    }
  }, [loaded]);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">

      {/* 🎧 Audio Player */}
      <audio ref={audioRef} src={LOFI_STREAM} loop />

      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      {loaded && (
        <>
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(#1f1f1f_1px,transparent_1px),linear-gradient(to_right,#1f1f1f_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* Stickers */}
          <div className="hidden md:block absolute inset-0">
            <StickerBoard items={stickersData} />
          </div>

          {/* Cards */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ShuffleCardBox cards={cardsData} />
          </div>

          {/* 🎵 Music Control Button */}
          <button
            onClick={toggleMusic}
            className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition"
          >
            {isPlaying ? "⏸ Pause Lofi" : "🎧 Play Lofi"}
          </button>
        </>
      )}
    </div>
  );
}
