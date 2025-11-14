export type ExaminationArea = 
  | 'thorax'
  | 'abdomen'
  | 'kidney'
  | 'head'
  | 'bone'
  | 'other';

export type ConcernLevel = 'low' | 'medium' | 'high';

export type Gender = 'male' | 'female' | 'other';

export interface PatientData {
  age?: number;
  gender?: Gender;
  clinicalNotes?: string;
}

export interface ImageData {
  file: File;
  dataUrl: string;
  base64: string;
}

export interface ThoraxFindings {
  projection?: string;
  kvQuality?: string;
  symmetry?: string;
  inspiration?: string;
  softTissueAndBone?: string;
  costophrenicAngle?: string;
  diaphragm?: string;
  trachea?: string;
  heartSize?: string;
  parenchyma?: string;
}

export interface CTBrainFindings {
  softTissue?: string;
  boneWindow?: string;
  sulcusGyrus?: string;
  bleeding?: string;
  ventricles?: string;
  basalCistern?: string;
  midlineShift?: string;
  bleedingVolume?: string;
  shiftDegree?: string;
}

export interface KidneyAbdomenFindings {
  kidneyStones?: string;
  kidneyStructure?: string;
  obstruction?: string;
  hydronephrosis?: string;
  urinaryBladder?: string;
  surroundingSoftTissue?: string;
}

export interface GeneralFindings {
  mass?: string;
  lesion?: string;
  tissueThickening?: string;
  freeFluid?: string;
  structuralAbnormalities?: string;
}

export interface InterpretationResult {
  id: string;
  timestamp: Date;
  examinationArea: ExaminationArea;
  patientData: PatientData;
  imageData?: ImageData;
  
  thoraxFindings?: ThoraxFindings;
  ctBrainFindings?: CTBrainFindings;
  kidneyAbdomenFindings?: KidneyAbdomenFindings;
  generalFindings?: GeneralFindings;
  
  impression: string;
  diagnosis: string;
  concernLevel: ConcernLevel;
  recommendations: string[];
  disclaimer: string;
  
  rawAIResponse?: string;
  staffNotes?: string;
}

export interface AISettings {
  apiKey: string;
  model: string;
  maxFileSize: number;
  theme: 'light' | 'dark';
  language: 'id' | 'en';
}

export interface DashboardStats {
  todayCount: number;
  weekCount: number;
  lowConcern: number;
  mediumConcern: number;
  highConcern: number;
  lastRequestTime?: Date;
  serviceStatus: 'online' | 'offline' | 'error';
}
