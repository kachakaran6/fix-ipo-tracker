import { IPOApplication, IPOName } from './types';

const IPO_APPLICATIONS_KEY = 'ipo-applications';
const IPO_NAMES_KEY = 'ipo-names';

export const storageUtils = {
  // IPO Applications
  getApplications: (): IPOApplication[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(IPO_APPLICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveApplications: (applications: IPOApplication[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(IPO_APPLICATIONS_KEY, JSON.stringify(applications));
  },

  addApplication: (application: Omit<IPOApplication, 'id' | 'timestamp'>): IPOApplication => {
    const newApplication: IPOApplication = {
      ...application,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    
    const applications = storageUtils.getApplications();
    applications.push(newApplication);
    storageUtils.saveApplications(applications);
    
    return newApplication;
  },

  deleteApplication: (id: string): void => {
    const applications = storageUtils.getApplications();
    const filtered = applications.filter(app => app.id !== id);
    storageUtils.saveApplications(filtered);
  },

  // IPO Names
  getIPONames: (): IPOName[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(IPO_NAMES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveIPONames: (names: IPOName[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(IPO_NAMES_KEY, JSON.stringify(names));
  },

  addIPOName: (name: string): IPOName => {
    const newIPOName: IPOName = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    
    const names = storageUtils.getIPONames();
    names.push(newIPOName);
    storageUtils.saveIPONames(names);
    
    return newIPOName;
  },

  deleteIPOName: (id: string): void => {
    const names = storageUtils.getIPONames();
    const filtered = names.filter(name => name.id !== id);
    storageUtils.saveIPONames(filtered);
  },
};