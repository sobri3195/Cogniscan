import { ExaminationArea, ConcernLevel } from '../types/interpretation.types';

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatShortDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const getAreaLabel = (area: ExaminationArea): string => {
  const labels: Record<ExaminationArea, string> = {
    thorax: 'Thorax (Foto Dada)',
    abdomen: 'Abdomen',
    kidney: 'Ginjal',
    head: 'Kepala (CT Brain)',
    bone: 'Tulang/Ortopedi',
    other: 'Lainnya'
  };
  return labels[area];
};

export const getConcernLevelLabel = (level: ConcernLevel): string => {
  const labels: Record<ConcernLevel, string> = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi'
  };
  return labels[level];
};

export const getConcernLevelColor = (level: ConcernLevel): string => {
  const colors: Record<ConcernLevel, string> = {
    low: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-red-600 bg-red-50'
  };
  return colors[level];
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const validateImageFile = (file: File, maxSizeMB: number): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Format file harus JPG atau PNG' };
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `Ukuran file maksimal ${maxSizeMB}MB` };
  }
  
  return { valid: true };
};

export const extractConcernLevel = (text: string): ConcernLevel => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('tingkat kekhawatiran: tinggi') || 
      lowerText.includes('kekhawatiran tinggi') ||
      lowerText.includes('concern: high') ||
      lowerText.includes('emergency') ||
      lowerText.includes('urgent')) {
    return 'high';
  }
  
  if (lowerText.includes('tingkat kekhawatiran: sedang') ||
      lowerText.includes('kekhawatiran sedang') ||
      lowerText.includes('concern: medium') ||
      lowerText.includes('moderate')) {
    return 'medium';
  }
  
  return 'low';
};

export const downloadAsText = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};
