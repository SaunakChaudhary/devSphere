import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import Navbar from "../Components/Navbar"
import { Helmet } from "react-helmet";

const DevSphereLanding = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8">
       <Helmet>
          <title>DevSphere</title>
        </Helmet>
      {/* Navigation */}
      <Navbar />      

      <main className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-20">
          <div className="order-2 md:order-1">
            <div className="bg-green-300 border-4 border-black p-4 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 uppercase leading-tight">
                Where Code Meets Community
              </h1>
              <p className="text-lg md:text-xl font-bold mb-6 md:mb-8">
                Your platform to showcase projects, collaborate with developers,
                and get recognized for your coding excellence.
              </p>
              <button 
              onClick={()=>{navigate("/signup")}}
              className="w-full md:w-auto bg-pink-400 text-black px-6 md:px-8 py-3 border-4 border-black font-bold hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                Let&apos;s Begin !
              </button>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="bg-blue-300 border-4 border-black p-4 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <i className="ri-terminal-line text-xl"></i>
              <div className="bg-white border-4 border-black p-4">
                <code className="text-sm md:text-lg font-mono font-bold">
                  {"const developer = new DevSphere();"}
                  <br />
                  {"developer.createImpact();"}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-8 md:mb-12 uppercase">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-orange-300 p-4 md:p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
              <div className="space-y-4">
                <i className="ri-code-s-slash-line text-4xl"></i>
                <h3 className="text-lg md:text-xl font-black">
                  Showcase Projects
                </h3>
                <p className="font-bold text-sm md:text-base">
                  Build your portfolio and share your coding projects with a
                  global community of developers.
                </p>
              </div>
            </div>

            <div className="bg-purple-300 p-4 md:p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
              <div className="space-y-4">
                <i className="ri-trophy-line text-4xl"></i>
                <h3 className="text-lg md:text-xl font-black">
                  Coding Challenges
                </h3>
                <p className="font-bold text-sm md:text-base">
                  Test your skills with daily challenges and compete with
                  developers worldwide.
                </p>
              </div>
            </div>

            <div className="bg-red-300 p-4 md:p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
              <div className="space-y-4">
                <i className="ri-rocket-2-line text-4xl"></i>
                <h3 className="text-lg md:text-xl font-black">
                  Get Recognized
                </h3>
                <p className="font-bold text-sm md:text-base">
                  Stand out to top organizations and unlock new career
                  opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center px-4">
          <div className="inline-block bg-white border-4 border-black px-4 md:px-6 py-2 font-black mb-4 md:mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm md:text-base">
            Join 10,000+ developers
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 uppercase">
            Ready to level up your coding journey?
          </h2>
          <button
            onClick={() => navigate("/signup")}
            className="w-full md:w-auto bg-cyan-300 text-black px-6 md:px-8 py-3 border-4 border-black font-bold hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
          >
            Join DevSphere
          </button>
        </section>
      </main>
    </div>
  );
};

export default DevSphereLanding;
