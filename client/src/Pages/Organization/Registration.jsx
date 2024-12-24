import { useState } from "react";
// import { NavLink } from "react-router-dom";
import SyncLoader from "react-spinners/SyncLoader";

const Registration = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    contactPersonName: "",
    contactPhoneNumber: "",
    companyAddress: "",
    websiteUrl: "",
    industry: "",
    numberOfEmployees: "",
    description: "",
    gitHuburl: "",
    linkedInUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8 flex items-center justify-center">
      {loading && (
        <div className="flex justify-center items-center text-white fixed top-0 w-full h-screen bg-black bg-opacity-45 z-50">
          <SyncLoader color="skyblue" loading={loading} size={15} />
        </div>
      )}
      <div className="w-full max-w-5xl">
        <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black mb-2">Join devSphere</h1>
            <p className="font-bold text-gray-700">
              Create an account to contribute{" "}
              <span className="text-blue-600">&</span> Learn something new
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div>
                <label className="font-bold mb-1 block">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                  placeholder="Company Name"
                  onChange={handleChange}
                  value={formData.companyName}
                  required
                />
              </div>
              <div>
                <label className="font-bold mb-1 block">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
              </div>
              <div>
                <label className="font-bold mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                    placeholder="••••••••"
                    onChange={handleChange}
                    value={formData.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <i className="ri-eye-line bg-[#ffffff] pl-2"></i>
                    ) : (
                      <i className="ri-eye-off-line bg-[#ffffff] pl-2 "></i>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="font-bold mb-1 block">Contact Person Name</label>
                <input
                  type="text"
                  name="contactPersonName"
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                  placeholder="John Doe"
                  onChange={handleChange}
                  value={formData.contactPersonName}
                  required
                />
              </div>
              <div>
                <label className="font-bold mb-1 block">Contact Phone Number</label>
                <input
                  type="text"
                  name="contactPhoneNumber"
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                  placeholder="123-456-7890"
                  onChange={handleChange}
                  value={formData.contactPhoneNumber}
                  required
                />
              </div>
              <div>
                <label className="font-bold mb-1 block">Company Address</label>
                <input
                  type="text"
                  name="companyAddress"
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                  placeholder="123 Main St, City, Country"
                  onChange={handleChange}
                  value={formData.companyAddress}
                  required
                />
              </div>
              <div>
                <label className="font-bold mb-1 block">Website URL</label>
                <input
                  type="url"
                  name="websiteUrl"
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                  placeholder="https://www.company.com"
                  onChange={handleChange}
                  value={formData.websiteUrl}
                />
              </div>
              <div>
                <label className="font-bold mb-1 block">Industry</label>
                <input
                  type="text"
                  name="industry"
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                  placeholder="Industry"
                  onChange={handleChange}
                  value={formData.industry}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="font-bold mb-1 block">Number of Employees</label>
                <input
                  type="number"
                  name="numberOfEmployees"
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                  placeholder="Number of Employees"
                  onChange={handleChange}
                  value={formData.numberOfEmployees}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="font-bold mb-1 block">Description</label>
                <textarea
                  name="description"
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                  placeholder="Brief description of the company"
                  onChange={handleChange}
                  value={formData.description}
                  required
                ></textarea>
              </div>
              <div>
                <label className="font-bold mb-1 block">GitHub Profile (Optional)</label>
                <input
                  type="url"
                  name="gitHuburl"
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                  placeholder="https://github.com/username"
                  onChange={handleChange}
                  value={formData.gitHuburl}
                />
              </div>
              <div>
                <label className="font-bold mb-1 block">LinkedIn Profile (Optional)</label>
                <input
                  type="url"
                  name="linkedInUrl"
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                  placeholder="https://linkedin.com/in/username"
                  onChange={handleChange}
                  value={formData.linkedInUrl}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-300 text-black p-3 border-4 border-black font-bold hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all mt-6"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
