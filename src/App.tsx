import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import NewInterpretation from './components/NewInterpretation';
import History from './components/History';
import DetailPage from './components/DetailPage';
import Settings from './components/Settings';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/new', label: 'Buat Baru', icon: '➕' },
    { path: '/history', label: 'Riwayat', icon: '📋' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
        aria-label="Toggle Sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-40 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <h1 className="text-xl font-bold text-white flex items-center gap-2 animate-fade-in">
              🏥 
              <span className="leading-tight">Cogniscan AI</span>
            </h1>
            <p className="text-blue-100 text-xs mt-1">Interpretasi Medis</p>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-semibold text-gray-700">Powered by OpenAI</p>
              <p className="text-[10px] leading-tight">⚠️ Bukan pengganti diagnosis profesional</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64 min-h-screen flex flex-col transition-all duration-300">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 ml-12 lg:ml-0">
                {navItems.find(item => item.path === location.pathname)?.label || 'Cogniscan AI'}
              </h2>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-500">
              © 2024 Cogniscan AI - Rontgen/CT-Scan Interpreter
            </p>
            <p className="text-center text-xs text-gray-400 mt-2">
              Powered by OpenAI GPT-4 Vision
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewInterpretation />} />
          <Route path="/history" element={<History />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
