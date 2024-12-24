import "remixicon/fonts/remixicon.css";
import { NavLink } from "react-router-dom";
import Navbar from "../Components/Navbar";

const AboutPage = () => {
  return (
    <>
      <div className="min-h-screen bg-yellow-50 p-4 md:p-8">
        {/* Navigation */}
        <Navbar />
        {/* Mission Section */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12">
            <h2 className="text-2xl md:text-3xl font-black mb-6">
              Our Mission
            </h2>
            <p className="text-lg font-bold text-gray-700 mb-6">
              devSphere is built on the belief that great code comes from
              collaboration, continuous learning, and community support.
              We&apos;re creating a space where developers can showcase their
              work, learn from peers, and get recognized for their skills.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-100 border-4 border-black">
                <i className="text-4xl ri-code-s-slash-line"></i>
                <h3 className="font-black mb-2">Showcase</h3>
                <p className="font-bold">
                  Share your projects and get feedback from the community
                </p>
              </div>
              <div className="p-4 bg-purple-100 border-4 border-black">
                <i className="text-4xl ri-trophy-line"></i>
                <h3 className="font-black mb-2">Compete</h3>
                <p className="font-bold">
                  Take on coding challenges and prove your expertise
                </p>
              </div>
              <div className="p-4 bg-orange-100 border-4 border-black">
                <i className="text-4xl ri-rocket-2-line"></i>
                <h3 className="font-black mb-2">Grow</h3>
                <p className="font-bold">
                  Get recognized by top organizations and advance your career
                </p>
              </div>
            </div>
          </div>

          {/* Founder Section */}
          <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl md:text-3xl font-black mb-6">
              Meet the Founder
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-xl font-black mb-4">John Developer</h3>
                <p className="font-bold text-gray-700 mb-4">
                  With over a decade of experience in software development and
                  community building, John created devSphere to bridge the gap
                  between talented developers and opportunities.
                </p>
                <div className="flex space-x-4">
                  <NavLink
                    to="#"
                    className="bg-gray-100 p-2 border-2 border-black hover:-translate-y-1 transition-transform"
                  >
                    <i className="ri-github-line w-6 h-6"></i>
                  </NavLink>
                  <NavLink
                    to="#"
                    className="bg-gray-100 p-2 border-2 border-black hover:-translate-y-1 transition-transform"
                  >
                    <i className="ri-linkedin-fill w-6 h-6"></i>
                  </NavLink>
                  <NavLink
                    to="#"
                    className="bg-gray-100 p-2 border-2 border-black hover:-translate-y-1 transition-transform"
                  >
                    <i className="ri-mail-line w-6 h-6"></i>
                  </NavLink>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="bg-pink-200 border-4 border-black p-4">
                  <img
                    src="https://placehold.co/600x400"
                    alt="Founder"
                    className="w-full border-4 border-black"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <i className="text-xl font-bold ri-terminal-window-line"></i>
                <span className="text-2xl font-black">devSphere</span>
              </div>
              <p className="font-bold text-gray-700 mb-4">
                Building the future of developer collaboration, one commit at a
                time.
              </p>
              <div className="flex space-x-4">
                <NavLink
                  to="#"
                  className="hover:-translate-y-1 transition-transform"
                >
                  <i className="ri-github-fill w-6 h-6"></i>
                </NavLink>
                <NavLink
                  to="#"
                  className="hover:-translate-y-1 transition-transform"
                >
                  <i className="ri-linkedin-fill w-6 h-6"></i>
                </NavLink>
                <NavLink
                  to="#"
                  className="hover:-translate-y-1 transition-transform"
                >
                  <i className="ri-mail-line w-6 h-6"></i>
                </NavLink>
              </div>
            </div>

            <div>
              <h3 className="font-black mb-4">Quick Links</h3>
              <ul className="space-y-2 font-bold">
                <li>
                  <NavLink to="#" className="hover:text-blue-600">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="#" className="hover:text-blue-600">
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink to="#" className="hover:text-blue-600">
                    Features
                  </NavLink>
                </li>
                <li>
                  <NavLink to="#" className="hover:text-blue-600">
                    Community
                  </NavLink>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-black mb-4">Resources</h3>
              <ul className="space-y-2 font-bold">
                <li>
                  <NavLink to="#" className="hover:text-blue-600">
                    Documentation
                  </NavLink>
                </li>
                <li>
                  <NavLink to="#" className="hover:text-blue-600">
                    Challenges
                  </NavLink>
                </li>
                <li>
                  <NavLink to="#" className="hover:text-blue-600">
                    Blog
                  </NavLink>
                </li>
                <li>
                  <NavLink to="#" className="hover:text-blue-600">
                    Support
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t-2 border-black mt-8 pt-8 text-center">
            <p className="font-bold text-gray-700">
              © {new Date().getFullYear()} devSphere. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AboutPage;
