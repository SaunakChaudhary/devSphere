import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full text-center">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-8xl font-black mb-4">
            4<span className="inline-block animate-bounce">0</span>4
          </h1>
          <div className="text-4xl font-black text-gray-700 mb-4">
            <i className="ri-emotion-sad-line"></i> Oops!
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-black mb-4">Page Not Found</h2>
          <p className="text-gray-600 font-bold mb-6">
            Looks like you&apos;ve ventured into uncharted territory! The page
            you&apos;re looking for seems to have gone on a coding adventure.
          </p>

          {/* Fun ASCII Art */}
          <pre className="font-mono text-sm md:text-base bg-gray-100 p-4 border-2 border-black inline-block">
            {`
   _____
  |     |
  | x x |
  |  ^  |
  | --- |
  |_____|
            `}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full md:w-auto bg-blue-500 text-white font-bold py-3 px-8 border-2 border-black hover:bg-blue-600 transition-colors inline-flex items-center justify-center gap-2"
          >
            <i className="ri-home-line"></i>
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
            <button
              onClick={() => window.history.back()}
              className="bg-gray-100 text-gray-700 font-bold py-3 px-8 border-2 border-black hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2"
            >
              <i className="ri-arrow-left-line"></i>
              Go Back
            </button>

            <button className="bg-gray-100 text-gray-700 font-bold py-3 px-8 border-2 border-black hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2">
              <i className="ri-customer-service-line"></i>
              Contact Support
            </button>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mt-8 p-4 bg-blue-50 border-2 border-black">
          <h3 className="font-black mb-2">Did you know?</h3>
          <p className="text-gray-600 font-bold">
            The term &#8220;404&#8220; comes from the response code in HTTP
            protocol, indicating that the server can&apos;t find the requested
            resource. It&apos;s like when you&apos;re looking for your keys in
            the wrong drawer!
            <i className="ri-key-line ml-2"></i>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
