/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";

const DetailedProject = ({
  setDispProject,
  username,
  Name,
  userImage,
  title,
  description,
  githublink,
  demoUrl,
  projectTechnologies,
  index
}) => {
  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-45 overflow-y-auto">
      <button
        onClick={() =>
          setDispProject((prevDispProject) => {
            const newDispProject = [...prevDispProject];
            newDispProject[index] = !newDispProject[index];
            return newDispProject;
          })
        }
        className="absolute top-2 right-2 text-white w-12 h-12 transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none font-bold text-2xl"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="min-h-screen py-12 px-4">
        <div className="w-full max-w-4xl bg-white border-4 border-black p-4 md:p-8 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mx-auto">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={userImage}
              alt={Name}
              className="w-8 h-8 md:w-16 md:h-16 border-2 border-black"
            />
            <div>
              <h3 className="font-bold md:text-2xl">{Name}</h3>
              <h5 className="text-gray-500 text-xs md:text-base">
                @{username}
              </h5>
            </div>
          </div>

          <hr className="border-2 border-black mb-6" />

          {/* Project Details */}
          <div className="bg-yellow-50 border-4 border-black p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-6">
            <h4 className="text-xl md:text-2xl font-black mb-4">{title}</h4>
            <div
              className="text-gray-700 prose max-w-none mb-4"
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          </div>

          {/* Links Section */}
          <div className="space-y-4 mb-6">
            <div className="bg-blue-100 border-4 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-bold text-lg mb-2">GitHub Repository:</p>
              <NavLink
                to={githublink}
                className="text-blue-600 hover:text-blue-800 underline font-semibold break-all"
              >
                {githublink}
              </NavLink>
            </div>

            {demoUrl && (
              <div className="bg-green-100 border-4 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-bold text-lg mb-2">Live Demo:</p>
                <NavLink
                  to={demoUrl}
                  className="text-blue-600 hover:text-blue-800 underline font-semibold break-all"
                >
                  {demoUrl}
                </NavLink>
              </div>
            )}
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {projectTechnologies.map((tech, techIndex) => (
              <span
                key={techIndex}
                className="bg-gray-100 px-2 py-1 text-sm font-bold border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                #{tech.tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedProject;
