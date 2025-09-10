import React from "react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0c1120] to-[#0a0a0a] text-white py-16 px-4">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent font-['Orbitron']">
          How SeaCreds Works
        </h1>
        <p className="text-xl text-cyan-200 max-w-3xl mx-auto font-['Exo']">
          A complete guide to our blockchain-powered blue carbon credit ecosystem that brings transparency, trust, and fair compensation to coastal conservation.
        </p>
      </div>

      {/* Overview Section */}
      <div className="max-w-6xl mx-auto mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 font-['Orbitron']">The Blue Carbon Challenge</h2>
            <p className="text-lg text-gray-300 mb-6 font-['Exo']">
              Traditional carbon credit systems lack transparency, have high verification costs, and often fail to properly compensate the local communities doing the actual conservation work.
            </p>
            <p className="text-lg text-gray-300 font-['Exo']">
              SeaCreds solves this by combining cutting-edge technology with sustainable environmental practices, creating a verifiable and equitable blue carbon economy.
            </p>
          </div>
          <div className="bg-black/30 p-8 rounded-2xl border border-cyan-500/20">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-cyan-900/20 rounded-xl border border-cyan-500/20">
                <div className="text-3xl font-bold text-cyan-400 mb-2 font-['Orbitron']">100%</div>
                <div className="text-sm text-cyan-200 font-['Exo']">Transparent</div>
              </div>
              <div className="text-center p-6 bg-cyan-900/20 rounded-xl border border-cyan-500/20">
                <div className="text-3xl font-bold text-cyan-400 mb-2 font-['Orbitron']">70%</div>
                <div className="text-sm text-cyan-200 font-['Exo']">Cost Reduction</div>
              </div>
              <div className="text-center p-6 bg-cyan-900/20 rounded-xl border border-cyan-500/20">
                <div className="text-3xl font-bold text-cyan-400 mb-2 font-['Orbitron']">24/7</div>
                <div className="text-sm text-cyan-200 font-['Exo']">Verification</div>
              </div>
              <div className="text-center p-6 bg-cyan-900/20 rounded-xl border border-cyan-500/20">
                <div className="text-3xl font-bold text-cyan-400 mb-2 font-['Orbitron']">0</div>
                <div className="text-sm text-cyan-200 font-['Exo']">Middlemen</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Roles Section */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12 font-['Orbitron']">Key Participants</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-black/30 p-8 rounded-2xl border border-cyan-500/20 text-center">
            <div className="w-20 h-20 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
              <span className="text-3xl">🌿</span>
            </div>
            <h3 className="text-xl font-bold mb-4 font-['Orbitron']">Coastal Communities</h3>
            <p className="text-gray-300 font-['Exo']">
              Local farmers, fishers, and NGOs who plant and maintain mangroves. They receive direct compensation for their conservation work.
            </p>
          </div>

          <div className="bg-black/30 p-8 rounded-2xl border border-cyan-500/20 text-center">
            <div className="w-20 h-20 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
              <span className="text-3xl">🏛️</span>
            </div>
            <h3 className="text-xl font-bold mb-4 font-['Orbitron']">NCCR Verifiers</h3>
            <p className="text-gray-300 font-['Exo']">
              Government authorities who verify restoration projects, validate carbon sequestration data, and approve credit issuance.
            </p>
          </div>

          <div className="bg-black/30 p-8 rounded-2xl border border-cyan-500/20 text-center">
            <div className="w-20 h-20 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
              <span className="text-3xl">🏢</span>
            </div>
            <h3 className="text-xl font-bold mb-4 font-['Orbitron']">Corporate Buyers</h3>
            <p className="text-gray-300 font-['Exo']">
              Companies seeking to offset their carbon footprint by purchasing verified blue carbon credits to meet ESG goals.
            </p>
          </div>
        </div>
      </div>

      {/* Process Flow Section */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-16 font-['Orbitron']">The SeaCreds Process Flow</h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-cyan-500/20 transform -translate-x-1/2"></div>
          
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center mb-12 relative">
            <div className="flex-shrink-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold mb-4 md:mb-0 md:absolute left-4 md:left-1/2 transform -translate-x-1/2">
              1
            </div>
            <div className="md:w-1/2 md:pr-12 md:text-right md:mt-0 ml-14 md:ml-0">
              <h3 className="text-xl font-bold text-cyan-400 mb-2 font-['Orbitron']">Project Initiation</h3>
              <p className="text-gray-300 font-['Exo']">
                Coastal communities identify restoration areas and begin mangrove planting using traditional knowledge.
              </p>
            </div>
            <div className="md:w-1/2 md:pl-12 mt-4 md:mt-0 ml-14 md:ml-0">
              <div className="bg-black/30 p-6 rounded-xl border border-cyan-500/20">
                <h4 className="font-semibold text-cyan-300 mb-2 font-['Orbitron']">Tools Used:</h4>
                <ul className="text-sm text-gray-300 space-y-1 font-['Exo']">
                  <li>• Mobile app for initial documentation</li>
                  <li>• GPS mapping of planting areas</li>
                  <li>• Community knowledge integration</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row items-center mb-12 relative">
            <div className="flex-shrink-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold mb-4 md:mb-0 md:absolute left-4 md:left-1/2 transform -translate-x-1/2">
              2
            </div>
            <div className="md:w-1/2 md:pr-12 md:text-right md:mt-0 ml-14 md:ml-0">
              <div className="bg-black/30 p-6 rounded-xl border border-cyan-500/20">
                <h4 className="font-semibold text-cyan-300 mb-2 font-['Orbitron']">Data Collection:</h4>
                <ul className="text-sm text-gray-300 space-y-1 font-['Exo']">
                  <li>• Drone imagery for area mapping</li>
                  <li>• IoT sensors for soil/water data</li>
                  <li>• Satellite monitoring for growth tracking</li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12 mt-4 md:mt-0 ml-14 md:ml-0">
              <h3 className="text-xl font-bold text-cyan-400 mb-2 font-['Orbitron']">MRV Data Gathering</h3>
              <p className="text-gray-300 font-['Exo']">
                Automated Monitoring, Reporting, and Verification systems collect real-time data on carbon sequestration.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center mb-12 relative">
            <div className="flex-shrink-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold mb-4 md:mb-0 md:absolute left-4 md:left-1/2 transform -translate-x-1/2">
              3
            </div>
            <div className="md:w-1/2 md:pr-12 md:text-right md:mt-0 ml-14 md:ml-0">
              <h3 className="text-xl font-bold text-cyan-400 mb-2 font-['Orbitron']">Verification & Tokenization</h3>
              <p className="text-gray-300 font-['Exo']">
                NCCR verifiers audit the data and approve carbon credit issuance. Each verified ton of CO₂ becomes a digital token.
              </p>
            </div>
            <div className="md:w-1/2 md:pl-12 mt-4 md:mt-0 ml-14 md:ml-0">
              <div className="bg-black/30 p-6 rounded-xl border border-cyan-500/20">
                <h4 className="font-semibold text-cyan-300 mb-2 font-['Orbitron']">Technology:</h4>
                <ul className="text-sm text-gray-300 space-y-1 font-['Exo']">
                  <li>• AI-powered data validation</li>
                  <li>• Blockchain smart contracts</li>
                  <li>• ERC-1155 token standard</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col md:flex-row items-center mb-12 relative">
            <div className="flex-shrink-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold mb-4 md:mb-0 md:absolute left-4 md:left-1/2 transform -translate-x-1/2">
              4
            </div>
            <div className="md:w-1/2 md:pr-12 md:text-right md:mt-0 ml-14 md:ml-0">
              <div className="bg-black/30 p-6 rounded-xl border border-cyan-500/20">
                <h4 className="font-semibold text-cyan-300 mb-2 font-['Orbitron']">Market Features:</h4>
                <ul className="text-sm text-gray-300 space-y-1 font-['Exo']">
                  <li>• Transparent pricing</li>
                  <li>• Instant settlement</li>
                  <li>• Company directory integration</li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12 mt-4 md:mt-0 ml-14 md:ml-0">
              <h3 className="text-xl font-bold text-cyan-400 mb-2 font-['Orbitron']">Marketplace Trading</h3>
              <p className="text-gray-300 font-['Exo']">
                Credits are listed on our decentralized marketplace where corporate buyers can purchase them directly from communities.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col md:flex-row items-center relative">
            <div className="flex-shrink-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold mb-4 md:mb-0 md:absolute left-4 md:left-1/2 transform -translate-x-1/2">
              5
            </div>
            <div className="md:w-1/2 md:pr-12 md:text-right md:mt-0 ml-14 md:ml-0">
              <h3 className="text-xl font-bold text-cyan-400 mb-2 font-['Orbitron']">Impact & Reinvestment</h3>
              <p className="text-gray-300 font-['Exo']">
                Communities receive direct payments, enabling them to expand conservation efforts and improve local infrastructure.
              </p>
            </div>
            <div className="md:w-1/2 md:pl-12 mt-4 md:mt-0 ml-14 md:ml-0">
              <div className="bg-black/30 p-6 rounded-xl border border-cyan-500/20">
                <h4 className="font-semibold text-cyan-300 mb-2 font-['Orbitron']">Benefits:</h4>
                <ul className="text-sm text-gray-300 space-y-1 font-['Exo']">
                  <li>• Direct community compensation</li>
                  <li>• Sustainable funding for conservation</li>
                  <li>• Verifiable environmental impact</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12 font-['Orbitron']">Technology Stack</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Blockchain", desc: "Ethereum & Smart Contracts", icon: "⛓️" },
            { name: "Storage", desc: "IPFS & Decentralized Storage", icon: "🗄️" },
            { name: "Monitoring", desc: "Drones & IoT Sensors", icon: "📡" },
            { name: "Verification", desc: "AI & Satellite Imagery", icon: "🤖" }
          ].map((tech, index) => (
            <div key={index} className="bg-black/30 p-6 rounded-2xl border border-cyan-500/20 text-center">
              <div className="text-3xl mb-4">{tech.icon}</div>
              <h3 className="text-lg font-bold text-cyan-400 mb-2 font-['Orbitron']">{tech.name}</h3>
              <p className="text-sm text-gray-300 font-['Exo']">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 font-['Orbitron']">Why SeaCreds Matters</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-black/30 p-8 rounded-2xl border border-cyan-500/20">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 font-['Orbitron']">For the Environment</h3>
            <ul className="space-y-3 font-['Exo']">
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Accelerates coastal ecosystem restoration</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Provides verifiable carbon sequestration</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Enhances marine biodiversity</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Protects coastlines from erosion</span>
              </li>
            </ul>
          </div>

          <div className="bg-black/30 p-8 rounded-2xl border border-cyan-500/20">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 font-['Orbitron']">For Communities</h3>
            <ul className="space-y-3 font-['Exo']">
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Direct financial compensation</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>No middlemen or delays</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Community-led conservation</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Sustainable livelihood opportunities</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-3xl mx-auto text-center mt-20">
        <h2 className="text-2xl font-bold mb-6 font-['Orbitron']">Ready to Transform Blue Carbon Conservation?</h2>
        <p className="text-cyan-200 mb-8 font-['Exo']">
          Join us in creating a transparent, equitable future for coastal ecosystem restoration.
        </p>
        <button className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold py-3 px-8 rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all font-['Exo']">
          Get Started Today
        </button>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800&family=Exo:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Exo', sans-serif;
        }
      `}</style>
    </div>
  );
}