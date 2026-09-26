import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CAREER_DOMAINS,
  PROFESSION_CONFIGS,
  getProfessionConfig,
} from '../data/careerTaxonomy';
import type {
  CareerDomain,
  ProfessionConfig,
} from '../data/careerTaxonomy';

interface CareerContextType {
  selectedDomain: CareerDomain;
  selectedProfession: ProfessionConfig;
  setProfession: (professionName: string) => void;
  setDomainById: (domainId: string) => void;
  allDomains: CareerDomain[];
  availableProfessions: string[];
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [professionName, setProfessionName] = useState<string>(() => {
    return localStorage.getItem('kaushal_career_profession') || 'Software Developer';
  });

  const selectedProfession = getProfessionConfig(professionName);

  const selectedDomain =
    CAREER_DOMAINS.find(d => d.id === selectedProfession.domainId) || CAREER_DOMAINS[0];

  const setProfession = (name: string) => {
    if (PROFESSION_CONFIGS[name]) {
      setProfessionName(name);
      localStorage.setItem('kaushal_career_profession', name);
    }
  };

  const setDomainById = (domainId: string) => {
    const dom = CAREER_DOMAINS.find(d => d.id === domainId);
    if (dom && dom.professions.length > 0) {
      // Set to first available profession in domain or configured one
      const targetProf = dom.professions.find(p => PROFESSION_CONFIGS[p]) || dom.professions[0];
      setProfession(targetProf);
    }
  };

  const availableProfessions = selectedDomain.professions;

  return (
    <CareerContext.Provider
      value={{
        selectedDomain,
        selectedProfession,
        setProfession,
        setDomainById,
        allDomains: CAREER_DOMAINS,
        availableProfessions,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};

export const useCareer = () => {
  const ctx = useContext(CareerContext);
  if (!ctx) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return ctx;
};
