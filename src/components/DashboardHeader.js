export default function DashboardHeader() {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-400 rounded-lg p-8 mb-6 relative overflow-hidden">
      <div className="flex items-center justify-between relative z-10">
        <div className="text-white">
          <div className="text-sm font-medium mb-2 opacity-90">
            CURRENT PLAN
          </div>
          <h1 className="text-4xl font-bold mb-4">Researcher</h1>
          <div className="mb-4">
            <div className="text-sm opacity-90 mb-2">API Limit</div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: "24%" }}
              ></div>
            </div>
            <div className="text-sm opacity-90">24 / 1,000 Requests</div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">Operational</span>
          </div>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            📊 Manage Plan
          </button>
        </div>
      </div>
    </div>
  );
}
