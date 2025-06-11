import React from 'react';

function App() {
  // This component will be expanded to include routing and main layout in future batches.
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-secondary mb-2">
          FinTrack
        </h1>
        <p className="text-lg text-neutral-700 font-primary">
          Personal Finance Tracker Application
        </p>
      </header>
      <main className="mt-8">
        <p className="text-neutral-600">
          Welcome! The full application interface will be built here.
        </p>
      </main>
    </div>
  );
}

export default App;
