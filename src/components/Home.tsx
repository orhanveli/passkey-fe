import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to KeyPass
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your secure password management solution
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/auth/login"
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
