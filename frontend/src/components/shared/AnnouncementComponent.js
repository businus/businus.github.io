import React from 'react';

const AnnouncementComponent = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 border-b-4 border-yellow-400 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
              🚀 Introducing Our AI Workflow Planner & Executor
            </h2>
            <p className="text-emerald-100 font-medium">
              Automate your business processes with our intelligent workflow system. Plan, execute, and monitor your operations with AI assistance.
            </p>
          </div>
          <div className="flex-shrink-0">
            <a 
              href="/workflow-ai" 
              className="inline-block px-6 py-3 bg-white text-emerald-700 font-bold rounded-lg shadow-lg hover:bg-yellow-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              Try Workflow AI Now →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementComponent;