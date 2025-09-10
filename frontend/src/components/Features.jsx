// src/components/Feature.jsx

import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import video1 from "/Users/ranawatprajinrajbhavesh/Desktop/Earth-3d-model/public/Feature3.mp4";
// import video2 from "/Users/ranawatprajinrajbhavesh/Desktop/Earth-3d-model/public/Feature2.mp4";

gsap.registerPlugin(ScrollTrigger);

// ServiceItem component updated for autoplay
const ServiceItem = ({ title, description, mediaSrc, mediaType, className }) => {
  // Removed the hover logic (handleMouseEnter, handleMouseLeave, and videoRef)

  return (
    // Removed onMouseEnter and onMouseLeave event handlers
    <div className={`flex flex-col gap-4 group ${className}`}>
      <div className="media-container relative bg-[#e0e0e0] rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.02] h-[25rem]">
        {mediaType === "video" ? (
          <video
            src={mediaSrc}
            autoPlay // Added autoPlay attribute
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={mediaSrc}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="px-2">
        <h3 className="text-xl font-bold text-black">{title}</h3>
        <p className="text-base text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
};


const Feature = () => {
  const services = [
    {
      title: "Decentralized Carbon Registry",
      description: "Blockchain-backed registry ensuring transparency, traceability, and trust in carbon credit records.",
      mediaSrc: video2,
      mediaType: "video",
    },
    {
        title: "AI-Powered Verification",
        description: "Utilizing satellite imagery and AI to monitor and verify the progress of carbon sequestration projects.",
        mediaSrc: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?auto=format&fit=crop&w=800&q=60",
        mediaType: "image",
    },
    {
      title: "Community & NGO Onboarding",
      description: "Inclusive platform for NGOs, coastal communities, and panchayats to actively participate in carbon restoration.",
      mediaSrc: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=60",
      mediaType: "image",
    },
    {
      title: "Tokenized Carbon Credits",
      description: "Smart contracts enable seamless carbon credit issuance, trading, and monetization for verified projects.",
      mediaSrc: video1,
      mediaType: "video",
    },
    
  ];
  
  const componentRef = useRef(null);

  // No changes to GSAP animations
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // --- HEADER ANIMATION ---
      gsap.fromTo(
        ".feature-header > *",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: componentRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // --- IMAGE ANIMATION (Zoom Reveal) ---
      gsap.utils.toArray(".image-item .media-container img").forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.3, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.3,
            ease: "power4.out",
            scrollTrigger: {
              trigger: img.closest(".image-item"),
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // --- VIDEO ANIMATION (Slide-in) ---
      gsap.utils.toArray(".video-item").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

    }, componentRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={componentRef} className="bg-white w-full py-32 px-6 sm:px-12 md:px-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 feature-header">
          <h2 className="text-5xl md:text-8xl font-extrabold text-black">
            Our Features
          </h2>
          <p className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto">
            A suite of powerful tools designed for transparency, community empowerment, and a sustainable future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <ServiceItem
              key={index}
              title={service.title}
              description={service.description}
              mediaSrc={service.mediaSrc}
              mediaType={service.mediaType}
              className={`
                ${service.mediaType === 'video' ? 'video-item' : 'image-item'}
                ${index % 2 !== 0 ? 'md:mt-32' : ''}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feature;