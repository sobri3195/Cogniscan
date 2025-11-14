import { InterpretationResult, AISettings, DashboardStats } from '../types/interpretation.types';

const STORAGE_KEYS = {
  INTERPRETATIONS: 'rontgen_interpretations',
  SETTINGS: 'rontgen_settings',
  STATS: 'rontgen_stats'
};

const DEFAULT_SETTINGS: AISettings = {
  apiKey: 'sk-NFXkWmR7nGNkUgn2hyDyK4KkRswTsGJ7j0LZCFSPRMxQSlW3',
  model: 'gpt-4o-mini',
  maxFileSize: 5,
  theme: 'light',
  language: 'id'
};

export const StorageService = {
  getInterpretations(): InterpretationResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INTERPRETATIONS);
      if (!data) return [];
      const interpretations = JSON.parse(data);
      return interpretations.map((i: InterpretationResult) => ({
        ...i,
        timestamp: new Date(i.timestamp)
      }));
    } catch (error) {
      console.error('Error loading interpretations:', error);
      return [];
    }
  },

  saveInterpretation(interpretation: InterpretationResult): void {
    try {
      const interpretations = this.getInterpretations();
      interpretations.unshift(interpretation);
      localStorage.setItem(STORAGE_KEYS.INTERPRETATIONS, JSON.stringify(interpretations));
      this.updateStats();
    } catch (error) {
      console.error('Error saving interpretation:', error);
    }
  },

  getInterpretationById(id: string): InterpretationResult | null {
    const interpretations = this.getInterpretations();
    return interpretations.find(i => i.id === id) || null;
  },

  updateInterpretation(id: string, updates: Partial<InterpretationResult>): void {
    try {
      const interpretations = this.getInterpretations();
      const index = interpretations.findIndex(i => i.id === id);
      if (index !== -1) {
        interpretations[index] = { ...interpretations[index], ...updates };
        localStorage.setItem(STORAGE_KEYS.INTERPRETATIONS, JSON.stringify(interpretations));
      }
    } catch (error) {
      console.error('Error updating interpretation:', error);
    }
  },

  deleteInterpretation(id: string): void {
    try {
      const interpretations = this.getInterpretations();
      const filtered = interpretations.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEYS.INTERPRETATIONS, JSON.stringify(filtered));
      this.updateStats();
    } catch (error) {
      console.error('Error deleting interpretation:', error);
    }
  },

  getSettings(): AISettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (error) {
      console.error('Error loading settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AISettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  getStats(): DashboardStats {
    const interpretations = this.getInterpretations();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayInterpretations = interpretations.filter(i => 
      new Date(i.timestamp) >= todayStart
    );
    const weekInterpretations = interpretations.filter(i => 
      new Date(i.timestamp) >= weekStart
    );

    const lowConcern = interpretations.filter(i => i.concernLevel === 'low').length;
    const mediumConcern = interpretations.filter(i => i.concernLevel === 'medium').length;
    const highConcern = interpretations.filter(i => i.concernLevel === 'high').length;

    const lastInterpretation = interpretations[0];

    return {
      todayCount: todayInterpretations.length,
      weekCount: weekInterpretations.length,
      lowConcern,
      mediumConcern,
      highConcern,
      lastRequestTime: lastInterpretation ? new Date(lastInterpretation.timestamp) : undefined,
      serviceStatus: 'online'
    };
  },

  updateStats(): void {
    const stats = this.getStats();
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  },

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.INTERPRETATIONS);
    localStorage.removeItem(STORAGE_KEYS.STATS);
  }
};
