type HomeProps = {
    userName: string;
  };
  
  export function Home({ userName }: HomeProps) {
    return (
      <div className="flex flex-col items-center justify-start w-full max-w-md">
        {/* Welcome message */}
        <h1 className="text-3xl font-bold mb-6">
          Welcome back, {userName}! 👋
        </h1>
  
        {/* Upcoming section */}
        <section className="w-full">
          <h2 className="text-2xl font-semibold mb-4">Upcoming</h2>
  
          {/* Travel Card */}
          <div className="p-4 rounded-xl shadow-md border bg-white">
            <h3 className="text-xl font-bold">Barcelona, Spain</h3>
            <p className="text-gray-600">Sep 5 – Sep 12, 2025</p>
            <p className="mt-2">Staying at: Hotel Miramar</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              View Details
            </button>
          </div>
        </section>
      </div>
    );
  }
  