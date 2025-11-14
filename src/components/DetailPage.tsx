import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage.service';
import { InterpretationResult } from '../types/interpretation.types';
import { formatDate, getAreaLabel, getConcernLevelLabel, getConcernLevelColor, copyToClipboard, downloadAsText } from '../utils/helpers';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [interpretation, setInterpretation] = useState<InterpretationResult | null>(null);
  const [staffNotes, setStaffNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [imageTransform, setImageTransform] = useState({ zoom: 1, rotation: 0 });
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (id) {
      const data = StorageService.getInterpretationById(id);
      if (data) {
        setInterpretation(data);
        setStaffNotes(data.staffNotes || '');
      }
    }
  }, [id]);

  const handleSaveNotes = () => {
    if (id) {
      StorageService.updateInterpretation(id, { staffNotes });
      setIsEditingNotes(false);
    }
  };

  const handleCopy = async () => {
    if (!interpretation) return;
    
    const text = `
INTERPRETASI RONTGEN/CT-SCAN AI
================================

Tanggal: ${formatDate(interpretation.timestamp)}
Area Pemeriksaan: ${getAreaLabel(interpretation.examinationArea)}

${interpretation.patientData.age ? `Usia: ${interpretation.patientData.age} tahun\n` : ''}${interpretation.patientData.gender ? `Jenis Kelamin: ${interpretation.patientData.gender}\n` : ''}${interpretation.patientData.clinicalNotes ? `Catatan Klinis: ${interpretation.patientData.clinicalNotes}\n` : ''}
HASIL INTERPRETASI
==================

${interpretation.rawAIResponse || interpretation.diagnosis}

Tingkat Kekhawatiran: ${getConcernLevelLabel(interpretation.concernLevel)}

${staffNotes ? `\nCATATAN STAF\n============\n${staffNotes}\n` : ''}
DISCLAIMER
==========
${interpretation.disclaimer}
`;

    await copyToClipboard(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownload = () => {
    if (!interpretation) return;
    
    const text = `
INTERPRETASI RONTGEN/CT-SCAN AI
================================

Tanggal: ${formatDate(interpretation.timestamp)}
Area Pemeriksaan: ${getAreaLabel(interpretation.examinationArea)}

${interpretation.patientData.age ? `Usia: ${interpretation.patientData.age} tahun\n` : ''}${interpretation.patientData.gender ? `Jenis Kelamin: ${interpretation.patientData.gender}\n` : ''}${interpretation.patientData.clinicalNotes ? `Catatan Klinis: ${interpretation.patientData.clinicalNotes}\n` : ''}
HASIL INTERPRETASI
==================

${interpretation.rawAIResponse || interpretation.diagnosis}

Tingkat Kekhawatiran: ${getConcernLevelLabel(interpretation.concernLevel)}

${staffNotes ? `\nCATATAN STAF\n============\n${staffNotes}\n` : ''}
DISCLAIMER
==========
${interpretation.disclaimer}
`;

    const filename = `interpretasi-${interpretation.examinationArea}-${new Date(interpretation.timestamp).toISOString().split('T')[0]}.txt`;
    downloadAsText(text, filename);
  };

  if (!interpretation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Interpretasi tidak ditemukan</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Detail Interpretasi</h1>
        <button
          onClick={() => navigate('/history')}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Kembali ke Riwayat
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {interpretation.imageData && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Preview Gambar</h2>
            
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 mb-4" style={{ height: '400px' }}>
              <div className="flex justify-center items-center h-full overflow-hidden">
                <img
                  src={interpretation.imageData.dataUrl}
                  alt="Medical scan"
                  style={{
                    transform: `scale(${imageTransform.zoom}) rotate(${imageTransform.rotation}deg)`,
                    transition: 'transform 0.2s',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setImageTransform(prev => ({ ...prev, zoom: Math.min(3, prev.zoom + 0.2) }))}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-sm"
              >
                🔍+ Zoom
              </button>
              <button
                onClick={() => setImageTransform(prev => ({ ...prev, zoom: Math.max(0.5, prev.zoom - 0.2) }))}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-sm"
              >
                🔍- Zoom
              </button>
              <button
                onClick={() => setImageTransform(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-sm"
              >
                🔄 Rotate
              </button>
              <button
                onClick={() => setImageTransform({ zoom: 1, rotation: 0 })}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-sm"
              >
                ↺ Reset
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Pemeriksaan</h2>
          
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-600">Tanggal & Waktu</dt>
              <dd className="text-gray-900">{formatDate(interpretation.timestamp)}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-600">Area Pemeriksaan</dt>
              <dd className="text-gray-900">{getAreaLabel(interpretation.examinationArea)}</dd>
            </div>
            
            {interpretation.patientData.age && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Usia Pasien</dt>
                <dd className="text-gray-900">{interpretation.patientData.age} tahun</dd>
              </div>
            )}
            
            {interpretation.patientData.gender && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Jenis Kelamin</dt>
                <dd className="text-gray-900 capitalize">{interpretation.patientData.gender}</dd>
              </div>
            )}
            
            {interpretation.patientData.clinicalNotes && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Catatan Klinis</dt>
                <dd className="text-gray-900">{interpretation.patientData.clinicalNotes}</dd>
              </div>
            )}
            
            <div>
              <dt className="text-sm font-medium text-gray-600">Tingkat Kekhawatiran</dt>
              <dd className="mt-1">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getConcernLevelColor(interpretation.concernLevel)}`}>
                  {getConcernLevelLabel(interpretation.concernLevel)}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hasil Interpretasi AI</h2>
        
        <div className="prose max-w-none">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap">
            {interpretation.rawAIResponse || interpretation.diagnosis}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Catatan Staf/Admin</h2>
          {!isEditingNotes && (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ✏️ Edit Catatan
            </button>
          )}
        </div>
        
        {isEditingNotes ? (
          <div className="space-y-3">
            <textarea
              value={staffNotes}
              onChange={(e) => setStaffNotes(e.target.value)}
              rows={6}
              placeholder="Tambahkan catatan atau observasi tambahan..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Simpan Catatan
              </button>
              <button
                onClick={() => {
                  setIsEditingNotes(false);
                  setStaffNotes(interpretation.staffNotes || '');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            {staffNotes || <span className="text-gray-500 italic">Belum ada catatan</span>}
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-900 text-sm">
          ⚠️ <strong>Disclaimer:</strong> {interpretation.disclaimer}
        </p>
      </div>

      <div className="flex gap-4 justify-center pb-8">
        <button
          onClick={handleCopy}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300 font-medium"
        >
          {copySuccess ? '✓ Tersalin!' : '📋 Salin Hasil Interpretasi'}
        </button>
        
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          💾 Download (.txt)
        </button>
      </div>
    </div>
  );
}
