import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '../services/storage.service';
import { DashboardStats, InterpretationResult } from '../types/interpretation.types';
import { formatShortDate, getAreaLabel, getConcernLevelLabel, getConcernLevelColor } from '../utils/helpers';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInterpretations, setRecentInterpretations] = useState<InterpretationResult[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const dashboardStats = StorageService.getStats();
    const interpretations = StorageService.getInterpretations().slice(0, 5);
    setStats(dashboardStats);
    setRecentInterpretations(interpretations);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <Link
          to="/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium hover:scale-105 shadow-lg hover:shadow-xl"
        >
          + Buat Interpretasi Baru
        </Link>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-scale-in hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-sm font-medium text-gray-600">Interpretasi Hari Ini</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.todayCount}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-scale-in hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-sm font-medium text-gray-600">Minggu Ini</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.weekCount}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-scale-in hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-sm font-medium text-gray-600">Total Interpretasi</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.lowConcern + stats.mediumConcern + stats.highConcern}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-scale-in hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-sm font-medium text-gray-600">Status Layanan AI</h3>
              <div className="flex items-center mt-2">
                <span className={`h-3 w-3 rounded-full ${stats.serviceStatus === 'online' ? 'bg-green-500' : 'bg-red-500'} mr-2 animate-pulse`}></span>
                <span className="text-lg font-semibold capitalize">{stats.serviceStatus}</span>
              </div>
              {stats.lastRequestTime && (
                <p className="text-xs text-gray-500 mt-1">
                  Terakhir: {formatShortDate(new Date(stats.lastRequestTime))}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200 animate-scale-in hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-sm font-medium text-green-900">Kekhawatiran Rendah</h3>
              <p className="text-3xl font-bold text-green-700 mt-2">{stats.lowConcern}</p>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200 animate-scale-in hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: '0.5s' }}>
              <h3 className="text-sm font-medium text-yellow-900">Kekhawatiran Sedang</h3>
              <p className="text-3xl font-bold text-yellow-700 mt-2">{stats.mediumConcern}</p>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200 animate-scale-in hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: '0.6s' }}>
              <h3 className="text-sm font-medium text-red-900">Kekhawatiran Tinggi</h3>
              <p className="text-3xl font-bold text-red-700 mt-2">{stats.highConcern}</p>
            </div>
          </div>
        </>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-200 animate-fade-in hover:shadow-xl transition-shadow duration-300">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">5 Interpretasi Terakhir</h2>
        </div>
        
        {recentInterpretations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Belum ada interpretasi. Buat interpretasi pertama Anda!</p>
            <Link 
              to="/new" 
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 hover:scale-105"
            >
              Buat Interpretasi Baru →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area Pemeriksaan</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnosis</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tingkat</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentInterpretations.map((interp) => (
                  <tr key={interp.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                      {formatShortDate(new Date(interp.timestamp))}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                      {getAreaLabel(interp.examinationArea)}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600">
                      {interp.diagnosis.substring(0, 50)}...
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <span className={`inline-flex px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${getConcernLevelColor(interp.concernLevel)}`}>
                        {getConcernLevelLabel(interp.concernLevel)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm">
                      <Link 
                        to={`/detail/${interp.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
