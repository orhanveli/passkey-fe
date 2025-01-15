import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Passkey Demo</h1>
      <p className="text-lg text-gray-600">
        This is a demo application for passkeys. Please sign up or log in to
        proceed.
      </p>
    </div>
  );
};

export default Home;
