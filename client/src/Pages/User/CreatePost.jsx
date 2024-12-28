import { useState, useEffect } from "react";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";

const ProjectSubmission = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubRepo: "",
    demoUrl: "",
    technologies: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-yellow-50 min-h-screen">
      <UserNavbar page="Create" />

      <div className="flex flex-col md:flex-row p-4">
        <UserSlidebar />
        <div className="mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10 w-full max-w-4xl">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-black mb-8 flex items-center gap-4">
            <span>
              Share Your Awesome Project
              <i className=" ml-2 ri-lightbulb-flash-fill text-yellow-500 text-3xl"></i>
            </span>
          </h1>

          {/* Project Title */}
          <div className="mb-6">
            <label className="block text-xl font-bold mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-4 text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all rounded-lg"
              placeholder="What's your project called?"
            />
          </div>

          {/* Technologies Used */}
          <div className="mb-6">
            <label className="block text-xl font-bold mb-2">
              Technologies Used <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
              className="w-full p-4 text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all rounded-lg"
              placeholder="e.g., React, Node.js, MongoDB"
            />
          </div>

          {/* Project Description */}
          <div className="mb-6">
            <label className="block text-xl font-bold mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-4 text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all min-h-[200px] rounded-lg"
              placeholder="Tell us about your project..."
            />
          </div>

          {/* GitHub Repo */}
          <div className="mb-6">
            <label className="block text-xl font-bold mb-2">
              GitHub Repository <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="githubRepo"
              value={formData.githubRepo}
              onChange={handleInputChange}
              className="w-full p-4 text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all rounded-lg"
              placeholder="https://github.com/username/repo"
            />
          </div>

          {/* Demo URL */}
          <div className="mb-6">
            <label className="block text-xl font-bold mb-2">Demo URL</label>
            <input
              type="url"
              name="demoUrl"
              value={formData.demoUrl}
              onChange={handleInputChange}
              className="w-full p-4 text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all rounded-lg"
              placeholder="https://your-demo-url.com"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button className="w-full sm:w-auto bg-white text-black font-bold py-4 px-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] rounded-lg">
              Cancel
            </button>
            <button className="w-full sm:w-auto bg-green-500 text-white font-bold py-4 px-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-600 active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] rounded-lg">
              Submit Project
              <i className="ri-send-plane-fill text-xl ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmission;
