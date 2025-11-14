import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage.service';
import { AISettings } from '../types/interpretation.types';

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AISettings>({
    apiKey: '',
    model: 'gpt-4o-mini',
    maxFileSize: 5,
    theme: 'light',
    language: 'id'
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const savedSettings = StorageService.getSettings();
    if (!savedSettings.apiKey) {
      savedSettings.apiKey = 'sk-NFXkWmR7nGNkUgn2hyDyK4KkRswTsGJ7j0LZCFSPRMxQSlW3';
    }
    setSettings(savedSettings);
  }, []);

  const handleSave = () => {
    StorageService.saveSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleClearData = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua data interpretasi? Tindakan ini tidak dapat dibatalkan.')) {
      StorageService.clearAllData();
      alert('Semua data telah dihapus');
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Sistem</h1>
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105"
        >
          ← Kembali ke Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-scale-in hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Konfigurasi OpenAI API</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key *
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-24"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
              >
                {showApiKey ? '🙈 Hide' : '👁️ Show'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              API Key disimpan lokal di browser Anda. Dapatkan API key dari{' '}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                OpenAI Platform
              </a>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model AI
            </label>
            <select
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="gpt-4o-mini">GPT-4O Mini (Recommended)</option>
              <option value="gpt-4o">GPT-4O</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              GPT-4O Mini lebih cepat dan ekonomis untuk interpretasi medis
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-scale-in hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pengaturan Upload</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Batas Ukuran File (MB)
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={settings.maxFileSize}
            onChange={(e) => setSettings({ ...settings, maxFileSize: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maksimal ukuran file gambar yang dapat diupload (1-20 MB)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-scale-in hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tampilan & Bahasa</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light (Terang)</option>
              <option value="dark">Dark (Gelap) - Coming Soon</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bahasa
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value as 'id' | 'en' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English - Coming Soon</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-scale-in hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-red-600">Zona Berbahaya</h2>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Menghapus semua data interpretasi yang tersimpan. Tindakan ini tidak dapat dibatalkan.
          </p>
          <button
            onClick={handleClearData}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            🗑️ Hapus Semua Data
          </button>
        </div>
      </div>

      <div className="flex gap-4 justify-center pb-8">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          {saveSuccess ? '✓ Tersimpan!' : '💾 Simpan Pengaturan'}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-fade-in">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Informasi Keamanan & Privasi</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>API Key disimpan lokal di browser Anda (localStorage)</li>
          <li>Gambar medis hanya dikirim ke OpenAI untuk proses interpretasi</li>
          <li>Data interpretasi disimpan lokal dan tidak dikirim ke server eksternal</li>
          <li>Sistem ini tidak menggunakan login atau autentikasi</li>
          <li>Pastikan untuk menjaga kerahasiaan API Key Anda</li>
        </ul>
      </div>
    </div>
  );
}
