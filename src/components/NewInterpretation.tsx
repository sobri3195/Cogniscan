import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { OpenAIService } from '../services/openai.service';
import { StorageService } from '../services/storage.service';
import { ExaminationArea, Gender, InterpretationResult, ConcernLevel } from '../types/interpretation.types';
import { generateId, fileToBase64, validateImageFile, extractConcernLevel } from '../utils/helpers';

export default function NewInterpretation() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [examinationArea, setExaminationArea] = useState<ExaminationArea>('thorax');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageTransform, setImageTransform] = useState({ zoom: 1, rotation: 0, panX: 0, panY: 0 });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [qualityResult, setQualityResult] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const settings = StorageService.getSettings();
    const validation = validateImageFile(file, settings.maxFileSize);
    
    if (!validation.valid) {
      setError(validation.error || 'File tidak valid');
      return;
    }

    setError('');
    setImageFile(file);
    
    const dataUrl = await fileToBase64(file);
    setImagePreview(dataUrl);
    setImageTransform({ zoom: 1, rotation: 0, panX: 0, panY: 0 });
  };

  const handleZoom = (delta: number) => {
    setImageTransform(prev => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(3, prev.zoom + delta))
    }));
  };

  const handleRotate = () => {
    setImageTransform(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  };

  const handleReset = () => {
    setImageTransform({ zoom: 1, rotation: 0, panX: 0, panY: 0 });
  };

  const handleCheckQuality = async () => {
    if (!imageFile || !imagePreview) {
      setError('Silakan upload gambar terlebih dahulu');
      return;
    }

    const settings = StorageService.getSettings();
    if (!settings.apiKey) {
      setError('API Key belum diatur. Silakan atur di menu Settings');
      return;
    }

    setIsProcessing(true);
    setError('');
    setQualityResult('');
    setProgress('Memeriksa kualitas gambar...');

    try {
      const aiService = new OpenAIService(settings.apiKey);
      const result = await aiService.checkImageQuality(imagePreview);
      setQualityResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memeriksa kualitas gambar');
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  const handleInterpret = async () => {
    if (!imageFile || !imagePreview) {
      setError('Silakan upload gambar terlebih dahulu');
      return;
    }

    const settings = StorageService.getSettings();
    if (!settings.apiKey) {
      setError('API Key belum diatur. Silakan atur di menu Settings');
      return;
    }

    setIsProcessing(true);
    setError('');
    setProgress('Mengirim gambar ke AI...');

    try {
      const aiService = new OpenAIService(settings.apiKey);
      
      setProgress('Melakukan interpretasi...');
      const interpretation = await aiService.interpretImage(
        imagePreview,
        examinationArea,
        {
          age: age ? parseInt(age) : undefined,
          gender: gender || undefined,
          clinicalNotes: clinicalNotes || undefined
        }
      );

      setProgress('Menyimpan hasil...');
      
      const concernLevel: ConcernLevel = extractConcernLevel(interpretation);
      
      const result: InterpretationResult = {
        id: generateId(),
        timestamp: new Date(),
        examinationArea,
        patientData: {
          age: age ? parseInt(age) : undefined,
          gender: gender || undefined,
          clinicalNotes: clinicalNotes || undefined
        },
        imageData: {
          file: imageFile,
          dataUrl: imagePreview,
          base64: imagePreview
        },
        impression: interpretation,
        diagnosis: interpretation,
        concernLevel,
        recommendations: [],
        disclaimer: 'Interpretasi ini otomatis oleh AI dan bukan diagnosis. Harus ditinjau oleh dokter.',
        rawAIResponse: interpretation
      };

      StorageService.saveInterpretation(result);
      
      setProgress('Selesai!');
      setTimeout(() => {
        navigate(`/detail/${result.id}`);
      }, 500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal melakukan interpretasi');
      setProgress('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Buat Interpretasi Baru</h1>
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105"
        >
          ← Kembali ke Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 animate-scale-in hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-bold text-gray-900 mb-4">A. Input Data Pemeriksaan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area Pemeriksaan *
            </label>
            <select
              value={examinationArea}
              onChange={(e) => setExaminationArea(e.target.value as ExaminationArea)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="thorax">Thorax (Foto Dada)</option>
              <option value="head">Kepala (CT Brain)</option>
              <option value="kidney">Ginjal</option>
              <option value="abdomen">Abdomen</option>
              <option value="bone">Tulang/Ortopedi</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usia Pasien (opsional)
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Contoh: 45"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Kelamin (opsional)
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender | '')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tidak disebutkan</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan Klinis Singkat (opsional)
            </label>
            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Contoh: Pasien mengeluh batuk berkepanjangan, riwayat merokok 20 tahun"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 animate-scale-in hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">B. Upload & Preview Gambar</h2>
        
        <div className="space-y-4">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium border border-gray-300 hover:scale-105"
            >
              📁 Pilih Gambar (JPG/PNG)
            </button>
            {imageFile && (
              <span className="ml-2 sm:ml-4 text-xs sm:text-sm text-gray-600 break-all">
                {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
              </span>
            )}
          </div>

          {imagePreview && (
            <>
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 animate-fade-in" style={{ height: '300px', minHeight: '300px' }}>
                <div className="flex justify-center items-center h-full overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      transform: `scale(${imageTransform.zoom}) rotate(${imageTransform.rotation}deg) translate(${imageTransform.panX}px, ${imageTransform.panY}px)`,
                      transition: 'transform 0.2s',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleZoom(0.2)}
                  className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-all duration-300 hover:scale-105 text-sm"
                >
                  🔍+ Zoom
                </button>
                <button
                  onClick={() => handleZoom(-0.2)}
                  className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-all duration-300 hover:scale-105 text-sm"
                >
                  🔍- Zoom
                </button>
                <button
                  onClick={handleRotate}
                  className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-all duration-300 hover:scale-105 text-sm"
                >
                  🔄 Putar
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-all duration-300 hover:scale-105 text-sm"
                >
                  ↺ Reset
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 animate-scale-in hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">C. Aksi AI</h2>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleCheckQuality}
              disabled={isProcessing || !imageFile}
              className="px-4 sm:px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium border border-gray-300 transition-all duration-300 hover:scale-105"
            >
              🔍 Cek Kualitas Gambar
            </button>
            
            <button
              onClick={handleInterpret}
              disabled={isProcessing || !imageFile}
              className="px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              🤖 Interpretasi dengan AI
            </button>
          </div>

          {isProcessing && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-900">{progress}</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-900">
              ❌ {error}
            </div>
          )}

          {qualityResult && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Hasil Pemeriksaan Kualitas:</h3>
              <p className="text-green-800 whitespace-pre-wrap">{qualityResult}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-900 text-sm">
          ⚠️ <strong>Privasi & Keamanan:</strong> Gambar medis tidak disimpan di server eksternal. 
          Interpretasi dilakukan secara langsung dan data disimpan lokal di browser Anda.
        </p>
      </div>
    </div>
  );
}
