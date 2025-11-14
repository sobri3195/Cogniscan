import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import NewInterpretation from './components/NewInterpretation';
import History from './components/History';
import DetailPage from './components/DetailPage';
import Settings from './components/Settings';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">
                  🏥 Rontgen/CT-Scan AI Interpreter
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <Link
                  to="/"
                  className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                    isActive('/')
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📊 Dashboard
                </Link>
                <Link
                  to="/new"
                  className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                    isActive('/new')
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ➕ Buat Baru
                </Link>
                <Link
                  to="/history"
                  className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                    isActive('/history')
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📋 Riwayat
                </Link>
                <Link
                  to="/settings"
                  className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                    isActive('/settings')
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ⚙️ Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2024 Rontgen/CT-Scan AI Interpreter. Powered by OpenAI GPT-4 Vision.
          </p>
          <p className="text-center text-xs text-gray-400 mt-2">
            ⚠️ Interpretasi AI bukan pengganti diagnosis medis profesional
          </p>
        </div>
      </footer>
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
