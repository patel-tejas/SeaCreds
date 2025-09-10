import React, { useRef, useLayoutEffect } from "react"; // Import useLayoutEffect from React
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Mission = () => {
  const missionRef = useRef(null);
  const textRef = useRef(null);
  const videoRef = useRef(null);
  const buttonRef = useRef(null);

  useLayoutEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Animate mission section
      gsap.fromTo(missionRef.current, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate text elements sequentially
      gsap.fromTo(textRef.current, 
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate video container
      gsap.fromTo(videoRef.current, 
        { opacity: 0, x: 30, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          scrollTrigger: {
            trigger: videoRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate button
      gsap.fromTo(buttonRef.current, 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.5,
          scrollTrigger: {
            trigger: buttonRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, missionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={missionRef} className="py-20 relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#0c1120]">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:space-x-12 items-center">
          {/* Text and button section (left side) */}
          <div ref={textRef} className="w-full md:w-1/2 mb-12 md:mb-0">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white font-['Orbitron']">
              Our <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Mission</span>
            </h2>
            <div className="space-y-6 text-cyan-200/90 text-lg md:text-xl leading-relaxed font-['Exo']">
              <p>
                At SeaCred, we are committed to restoring India's blue carbon
                ecosystems—mangroves, seagrass, and saltmarshes—through
                innovation, blockchain transparency, and community-driven action.
              </p>
              <p>
                Our vision is to build the world's most trusted Blue Carbon
                Registry, empowering coastal communities, NGOs, and governments to
                create measurable climate impact and sustainable livelihoods.
              </p>
            </div>
            <div ref={buttonRef} className="mt-8">
              <button className="px-10 py-5 border border-cyan-500 rounded-full bg-transparent text-cyan-300 font-semibold shadow-lg transition-all duration-300 hover:bg-cyan-500 hover:text-white hover:shadow-cyan-500/40 active:scale-95 font-['Exo']">
                What we do
              </button>
            </div>
          </div>

          {/* Video container (right side) */}
          <div ref={videoRef} className="w-full md:w-1/2 flex items-center justify-center p-4">
            <div className="relative bg-cyan-900/20 rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30 transition-transform duration-500 hover:scale-[1.02] hover:border-cyan-400/50">
              <video
                src="/Earth_s_Digital_Ecosystem_Awakening.mp4"
                className="w-full h-[30rem] object-cover rounded-2xl"
                autoPlay
                loop
                muted
                playsInline
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;