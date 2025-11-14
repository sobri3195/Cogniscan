import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '../services/storage.service';
import { InterpretationResult, ExaminationArea, ConcernLevel } from '../types/interpretation.types';
import { formatShortDate, getAreaLabel, getConcernLevelLabel, getConcernLevelColor } from '../utils/helpers';

export default function History() {
  const [interpretations, setInterpretations] = useState<InterpretationResult[]>([]);
  const [filteredInterpretations, setFilteredInterpretations] = useState<InterpretationResult[]>([]);
  
  const [filterArea, setFilterArea] = useState<ExaminationArea | 'all'>('all');
  const [filterConcern, setFilterConcern] = useState<ConcernLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    loadInterpretations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [interpretations, filterArea, filterConcern, searchQuery, dateFrom, dateTo]);

  const loadInterpretations = () => {
    const data = StorageService.getInterpretations();
    setInterpretations(data);
  };

  const applyFilters = () => {
    let filtered = [...interpretations];

    if (filterArea !== 'all') {
      filtered = filtered.filter(i => i.examinationArea === filterArea);
    }

    if (filterConcern !== 'all') {
      filtered = filtered.filter(i => i.concernLevel === filterConcern);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(i => 
        i.diagnosis.toLowerCase().includes(query) ||
        i.impression.toLowerCase().includes(query) ||
        getAreaLabel(i.examinationArea).toLowerCase().includes(query)
      );
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(i => new Date(i.timestamp) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(i => new Date(i.timestamp) <= toDate);
    }

    setFilteredInterpretations(filtered);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus interpretasi ini?')) {
      StorageService.deleteInterpretation(id);
      loadInterpretations();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Riwayat Interpretasi</h1>
        <Link
          to="/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium hover:scale-105 shadow-lg hover:shadow-xl"
        >
          + Buat Interpretasi Baru
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-scale-in hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter & Pencarian</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area Pemeriksaan
            </label>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value as ExaminationArea | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Area</option>
              <option value="thorax">Thorax</option>
              <option value="head">Kepala (CT Brain)</option>
              <option value="kidney">Ginjal</option>
              <option value="abdomen">Abdomen</option>
              <option value="bone">Tulang/Ortopedi</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tingkat Risiko
            </label>
            <select
              value={filterConcern}
              onChange={(e) => setFilterConcern(e.target.value as ConcernLevel | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Tingkat</option>
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pencarian Cepat
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari diagnosis, area..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterArea('all');
                setFilterConcern('all');
                setSearchQuery('');
                setDateFrom('');
                setDateTo('');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300 transition-all duration-300 hover:scale-105"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 animate-fade-in hover:shadow-xl transition-shadow duration-300">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Daftar Interpretasi ({filteredInterpretations.length})
          </h2>
        </div>

        {filteredInterpretations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Tidak ada interpretasi yang sesuai dengan filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnosis</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tingkat</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInterpretations.map((interp) => (
                  <tr key={interp.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                      {formatShortDate(new Date(interp.timestamp))}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                      {getAreaLabel(interp.examinationArea)}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                      {interp.diagnosis}
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <span className={`inline-flex px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${getConcernLevelColor(interp.concernLevel)}`}>
                        {getConcernLevelLabel(interp.concernLevel)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm space-x-2">
                      <Link 
                        to={`/detail/${interp.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:underline"
                      >
                        Lihat
                      </Link>
                      <button
                        onClick={() => handleDelete(interp.id)}
                        className="text-red-600 hover:text-red-700 font-medium transition-all duration-200 hover:underline"
                      >
                        Hapus
                      </button>
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
