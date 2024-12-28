import "remixicon/fonts/remixicon.css";
import { NavLink } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { Helmet } from "react-helmet";

const AboutPage = () => {
  return (
    <>
      <div className="min-h-screen bg-yellow-50 p-4 md:p-8">
        <Helmet>
          <title>About Us - DevSphere</title>
        </Helmet>
        {/* Navigation */}
        <Navbar />
        {/* Mission Section */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12">
            <h2 className="text-2xl md:text-3xl font-black mb-6">
              Our Mission
            </h2>
            <p className="text-lg font-bold text-gray-700 mb-6">
              DevSphere is built on the belief that great code comes from
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
                <h3 className="text-xl font-black mb-4">Saunak Chaudhary</h3>
                <p className="font-bold text-gray-700 mb-4">
                  With over a decade of experience in software development and
                  community building, John created DevSphere to bridge the gap
                  between talented developers and opportunities.
                </p>
                <div className="flex space-x-4">
                  <NavLink
                    to="https://github.com/SaunakChaudhary"
                    className="bg-gray-100 p-2 border-2 border-black hover:-translate-y-1 transition-transform"
                  >
                    <i className="ri-github-line w-6 h-6"></i>
                  </NavLink>
                  <NavLink
                    to="https://www.linkedin.com/in/saunak-chaudhary-4a4092228/"
                    className="bg-gray-100 p-2 border-2 border-black hover:-translate-y-1 transition-transform"
                  >
                    <i className="ri-linkedin-fill w-6 h-6"></i>
                  </NavLink>
                  <NavLink
                    to="mailto:saunakchaudhary0404@gmail.com"
                    className="bg-gray-100 p-2 border-2 border-black hover:-translate-y-1 transition-transform"
                  >
                    <i className="ri-mail-line w-6 h-6"></i>
                  </NavLink>
                </div>
              </div>
              <div className="border-1 md:border-2">
                <div className="bg-pink-200 border-4 border-black p-4">
                  <img
                    src="./founder.JPG"
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
      <footer className="bg-gray-50 border-t-4 border-black">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            {/* Left: Logo and Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <i className="text-2xl font-bold ri-terminal-window-line"></i>
                <span className="text-2xl font-black">DevSphere</span>
              </div>
              <p className="text-gray-700 font-medium">
                Development isn&apos;t just about writing perfect code—it&apos;s
                about solving real-world problems, creating impactful solutions,
                and learning from one another. Our mission is to eliminate the
                barriers that slow down collaboration so developers can focus on
                what they do best: building the future.
              </p>
            </div>

            {/* Right: Social Links */}
            <div className="flex flex-col md:items-end space-y-4 mt-8 md:mt-0">
              <h3 className="font-bold text-lg">Connect With Us</h3>
              <div className="flex space-x-6">
                <a
                  href="https://github.com/SaunakChaudhary"
                  className="hover:text-black transition-colors"
                  aria-label="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-github-fill text-2xl"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/saunak-chaudhary-4a4092228/"
                  className="hover:text-black transition-colors"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-linkedin-fill text-2xl"></i>
                </a>
                <a
                  href="mailto:saunakchaudhary0404@gmail.com"
                  className="hover:text-black transition-colors"
                  aria-label="Email"
                >
                  <i className="ri-mail-line text-2xl"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="border-t-2 border-black mt-8 pt-6 text-center">
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()}{" "}
              <span className="font-bold">DevSphere</span>. All rights reserved.
            </p>
            <p>
              Building the future of developer collaboration, one commit at a
              time.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AboutPage;
