import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Mission from "./Mission.jsx";
import CustomCursor from "./CustomCursor.jsx";
import Navbar from "./Navbar.jsx";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Simple Sphere as fallback
const EarthSphere = () => {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#4e54c8" emissive="#16213e" emissiveIntensity={0.5} />
    </mesh>
  );
};

// 3D Globe Component with error handling
const GlobeModel = React.forwardRef((props, ref) => {
  const { scene, error } = useGLTF("/Earth.glb", true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (error) {
      console.error("Failed to load Earth model:", error);
      setHasError(true);
      setIsLoaded(true);
      if (props.onLoaded) {
        props.onLoaded();
      }
      return;
    }

    if (scene && ref) {
      try {
        ref.current = scene;
        scene.position.set(0, 4, 0);
        scene.scale.set(0.2, 0.2, 0.2);
        scene.rotation.set(0, 0, 0);

        scene.traverse((child) => {
          if (child.isMesh) {
            child.material.transparent = true;
          }
        });

        setIsLoaded(true);
        if (props.onLoaded) {
          props.onLoaded();
        }
      } catch (e) {
        console.error("Error processing Earth model:", e);
        setHasError(true);
        setIsLoaded(true);
        if (props.onLoaded) {
          props.onLoaded();
        }
      }
    }
  }, [scene, ref, props, error]);

  useFrame(() => {
    if (ref.current && isLoaded && !hasError) {
      ref.current.rotation.y += 0.005;
    }
  });

  if (hasError) {
    return <EarthSphere />;
  }

  return scene ? <primitive object={scene} dispose={null} /> : null;
});

// Feature Card Component
const FeatureCard = ({ icon, title, description, delay }) => {
  const cardRef = useRef(null);

  useLayoutEffect(() => {
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: delay * 0.2,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, [delay]);

  return (
    <div ref={cardRef} className="bg-gradient-to-br from-cyan-900/20 to-teal-900/20 p-6 rounded-2xl border border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-500 group">
      <div className="text-4xl mb-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 font-['Orbitron']">{title}</h3>
      <p className="text-cyan-200/90 font-['Exo']">{description}</p>
    </div>
  );
};

// Stats Component
const StatItem = ({ number, label }) => {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent font-['Orbitron'] mb-2">
        {number}
      </div>
      <div className="text-sm text-cyan-300 uppercase tracking-wider font-['Exo']">{label}</div>
    </div>
  );
};

// Landing Page Component
export default function LandingPage() {
  const mainContainerRef = useRef(null);
  const heroSectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const globeRef = useRef(null);
  const contentSectionRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  const handleModelLoaded = () => {
    setModelLoaded(true);
  };

  useLayoutEffect(() => {
    if (!modelLoaded) return;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        gsap.set(titleRef.current, { opacity: 0, y: 50 });
        gsap.set(subtitleRef.current, { opacity: 0, y: 50 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: "top top",
            end: "+=4000",
            scrub: 1.2,
            pin: true,
            anticipatePin: 1,
            refreshPriority: -1,
          },
        });

        tl.to(globeRef.current.scale, {
          x: 2.8,
          y: 2.8,
          z: 2.8,
          ease: "power2.out",
          duration: 3,
        })
          .to(
            globeRef.current.position,
            {
              x: 0,
              y: -2.5,
              z: 0,
              ease: "power2.out",
              duration: 3,
            },
            "<"
          )
          .to(
            titleRef.current,
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              duration: 1.5,
            },
            "-=1.5"
          )
          .to(
            subtitleRef.current,
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              duration: 1.5,
            },
            "-=1.3"
          );

        tl.to({}, { duration: 1 });

        const fadeOutObject = { opacity: 1 };
        tl.to(globeRef.current.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
          ease: "power3.in",
          duration: 2,
        })
          .to(
            globeRef.current.position,
            {
              z: -10,
              ease: "power3.in",
              duration: 2,
            },
            "<"
          )
          .to(
            fadeOutObject,
            {
              opacity: 0,
              ease: "power2.in",
              duration: 2,
              onUpdate: () => {
                if (globeRef.current) {
                  if (globeRef.current.isMesh) {
                    globeRef.current.material.opacity = fadeOutObject.opacity;
                    globeRef.current.material.transparent = true;
                  } else {
                    globeRef.current.traverse((child) => {
                      if (child.isMesh) {
                        child.material.opacity = fadeOutObject.opacity;
                        child.material.transparent = true;
                      }
                    });
                  }
                }
              },
            },
            "<"
          )
          .to(
            [titleRef.current, subtitleRef.current],
            {
              opacity: 0,
              y: -60,
              stagger: 0.15,
              ease: "power2.in",
              duration: 1.5,
            },
            "<0.5"
          );

        // Animate features section
        gsap.fromTo(".feature-card", 
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Animate stats section
        gsap.fromTo(".stat-item", 
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        gsap.to(window, {
          scrollTo: 3000,
          duration: 10,
          ease: "power2.inOut",
          delay: 1,
        });
      }, mainContainerRef);

      return () => {
        ctx.revert();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [modelLoaded]);

  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <style jsx="true" global="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800&family=Exo:wght@300;400;500;600;700&display=swap');
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap");
        
        body {
          font-family: "Plus Jakarta Sans", sans-serif;
          background-color: #0a0a0a;
          color: #f0f0f0;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }
        * {
          box-sizing: border-box;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .ocean-wave {
          background: linear-gradient(135deg, #0a0a0a 0%, #16213e 50%, #0a0a0a 100%);
        }
      `}</style>
      
        <main ref={mainContainerRef} className="w-full">
          <Navbar />
          
          <section
            ref={heroSectionRef}
            className="h-screen w-full relative overflow-hidden bg-[#0a0a0a]"
          >
            {!modelLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-50">
                <div className="text-white text-xl">Loading Earth...</div>
              </div>
            )}

            <div
              ref={textContainerRef}
              className="absolute inset-0 flex flex-col items-center justify-start pt-48 text-center z-10 pointer-events-none"
            >
              <h1
                ref={titleRef}
                className="text-7xl md:text-9xl font-extrabold tracking-tighter opacity-0 text-white relative z-10 font-['Orbitron']"
              >
                SeaCreds
              </h1>
              <p
                ref={subtitleRef}
                className="text-lg md:text-2xl mt-6 max-w-2xl text-gray-300 opacity-0 relative z-10 font-['Exo']"
              >
                A next-gen blockchain registry for
                <br />
                ocean and mangrove carbon credits.
              </p>
              <div className="mt-12 opacity-0" ref={textContainerRef}>
                <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 font-['Exo']">
                  Explore Platform
                </button>
              </div>
            </div>

            <div
              ref={canvasContainerRef}
              className="absolute w-full h-full top-0 left-0 z-20"
            >
              <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 7.5]} intensity={1.5} />
                <pointLight
                  position={[-10, -10, -10]}
                  intensity={1}
                  color="#ffffff"
                />
                <GlobeModel ref={globeRef} onLoaded={handleModelLoaded} />
                <OrbitControls enableZoom={false} enablePan={false} />
              </Canvas>
            </div>
          </section>

          {/* Mission Section */}
          <section
            ref={contentSectionRef}
            className="relative z-30 min-h-screen ocean-wave"
          >
            <Mission />
          </section>

          {/* Features Section */}
          <section ref={featuresRef} className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#0c1120]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-['Orbitron']">
                  Why <span className="gradient-text">SeaCreds</span>?
                </h2>
                <p className="text-xl text-cyan-200/90 max-w-3xl mx-auto font-['Exo']">
                  Revolutionizing carbon credit management with blockchain technology for a sustainable marine ecosystem.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                  icon="🌊"
                  title="Marine Ecosystem Focus"
                  description="Specialized carbon credits for ocean conservation, mangrove restoration, and marine biodiversity protection."
                  delay={0}
                />
                <FeatureCard
                  icon="🔗"
                  title="Blockchain Transparency"
                  description="Every credit is immutably recorded on the blockchain, ensuring complete transparency and traceability."
                  delay={1}
                />
                <FeatureCard
                  icon="💎"
                  title="NFT Integration"
                  description="Unique digital assets representing specific conservation projects with verifiable impact data."
                  delay={2}
                />
                <FeatureCard
                  icon="📊"
                  title="Real-time Monitoring"
                  description="Live tracking of carbon sequestration and environmental impact through IoT and satellite data."
                  delay={3}
                />
                <FeatureCard
                  icon="🤝"
                  title="Global Marketplace"
                  description="Connect buyers and sellers in a secure, efficient carbon credit trading environment."
                  delay={4}
                />
                <FeatureCard
                  icon="🌐"
                  title="DAO Governance"
                  description="Community-driven decision making for project funding and platform development."
                  delay={5}
                />
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section ref={statsRef} className="py-20 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <StatItem number="50M+" label="Carbon Credits" />
                <StatItem number="120+" label="Marine Projects" />
                <StatItem number="25K+" label="Active Users" />
                <StatItem number="$18M+" label="Total Volume" />
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-20 bg-gradient-to-b from-[#0c1120] to-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-['Orbitron']">
                  How It <span className="gradient-text">Works</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
                    <span className="text-3xl">1</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 font-['Orbitron']">Project Verification</h3>
                  <p className="text-cyan-200/90 font-['Exo']">
                    Marine conservation projects are thoroughly vetted and verified by environmental experts.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
                    <span className="text-3xl">2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 font-['Orbitron']">Credit Tokenization</h3>
                  <p className="text-cyan-200/90 font-['Exo']">
                    Verified carbon sequestration is converted into digital tokens on the blockchain.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
                    <span className="text-3xl">3</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 font-['Orbitron']">Trading & Retirement</h3>
                  <p className="text-cyan-200/90 font-['Exo']">
                    Credits are traded on our marketplace or retired to offset carbon emissions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-cyan-900/20 to-teal-900/20">
            <div className="max-w-4xl mx-auto text-center px-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-['Orbitron']">
                Ready to Make a <span className="gradient-text">Difference</span>?
              </h2>
              <p className="text-xl text-cyan-200/90 mb-10 font-['Exo']">
                Join the revolution in marine conservation and carbon credit trading. Be part of the solution for our oceans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 font-['Exo']">
                  Launch App
                </button>
                <button className="px-8 py-4 rounded-xl bg-transparent border border-cyan-500/30 text-cyan-300 font-semibold text-lg hover:bg-cyan-500/10 hover:scale-105 transition-all duration-300 font-['Exo']">
                  Learn More
                </button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 bg-[#0a0a0a] border-t border-cyan-500/20">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <div className="flex justify-center mb-8">
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent font-['Orbitron']">
                  SeaCreds
                </div>
              </div>
              <p className="text-cyan-200/70 font-['Exo']">
                Revolutionizing marine conservation through blockchain technology
              </p>
              <div className="mt-6 flex justify-center space-x-6">
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Twitter</a>
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Discord</a>
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">GitHub</a>
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Docs</a>
              </div>
            </div>
          </footer>
        </main>
    </>
  );
}