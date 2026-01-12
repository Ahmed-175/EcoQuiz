

const Loading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="relative">
            <div className="p-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg shadow-lg animate-pulse">
              <span className="text-2xl font-bold">E</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-300 rounded-full animate-ping"></div>
          </div>

          <span className="text-2xl font-bold text-gray-800">co</span>

          <div className="relative">
            <div className="p-2 px-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg shadow-lg animate-pulse delay-300">
              <span className="text-2xl font-bold">Q</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-300 rounded-full animate-ping delay-300"></div>
          </div>

          <span className="text-2xl font-bold text-gray-800">uiz</span>
        </div>

        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
          {[...Array(3)].map((_, i) => (
            <div
              key={i + 3}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-bounce"
              style={{ animationDelay: `${i * 0.1 + 0.15}s` }}
            ></div>
          ))}
        </div>

        <p className="text-gray-600 font-medium">
          Loading <span className="animate-pulse">...</span>
        </p>
      </div>
    </div>
  );
};

export default Loading;
