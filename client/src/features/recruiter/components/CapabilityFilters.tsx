import React from 'react';
import { Search, Filter } from 'lucide-react';

interface CapabilityFiltersProps {
  capabilityFilter: string;
  setCapabilityFilter: (v: string) => void;
  techFilter: string;
  setTechFilter: (v: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (v: string) => void;
  verificationFilter: string;
  setVerificationFilter: (v: string) => void;
  confidenceFilter: string;
  setConfidenceFilter: (v: string) => void;
  locationFilter: string;
  setLocationFilter: (v: string) => void;
  experienceFilter: string;
  setExperienceFilter: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export const CapabilityFilters: React.FC<CapabilityFiltersProps> = ({
  capabilityFilter,
  setCapabilityFilter,
  techFilter,
  setTechFilter,
  difficultyFilter,
  setDifficultyFilter,
  verificationFilter,
  setVerificationFilter,
  confidenceFilter,
  setConfidenceFilter,
  locationFilter,
  setLocationFilter,
  experienceFilter,
  setExperienceFilter,
  search,
  setSearch,
  onSearch,
}) => {
  return (
    <div
      className="forge-card"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Search Input Bar (Section 22: Search skills, technologies, or capabilities...) */}
      <form onSubmit={onSearch} style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={18}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Search skills, technologies, or capabilities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '100%' }}
          />
        </div>

        <button className="btn btn-primary" type="submit" style={{ padding: '0.6rem 1.25rem' }}>
          Search
        </button>
      </form>

      {/* Recruiter Search Filters (Section 23: Capability, Technology, Difficulty, Verification, Proof Confidence, Location, Experience) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Filter size={13} />
          <span>Filters:</span>
        </div>

        {/* 1. Capability */}
        <select
          value={capabilityFilter}
          onChange={(e) => setCapabilityFilter(e.target.value)}
          className="input-field"
          style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8125rem' }}
        >
          <option value="">Capability: All</option>
          <option value="Backend">Backend (&gt;= 80)</option>
          <option value="System Design">System Design (&gt;= 80)</option>
          <option value="Testing">Testing (&gt;= 85)</option>
          <option value="Database">Database (&gt;= 75)</option>
          <option value="Security">Security (&gt;= 70)</option>
        </select>

        {/* 2. Technology */}
        <select
          value={techFilter}
          onChange={(e) => setTechFilter(e.target.value)}
          className="input-field"
          style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8125rem' }}
        >
          <option value="">Technology: All</option>
          <option value="PostgreSQL">PostgreSQL</option>
          <option value="Redis">Redis</option>
          <option value="Go">Go</option>
          <option value="Rust">Rust</option>
          <option value="Node.js">Node.js</option>
          <option value="Docker">Docker</option>
        </select>

        {/* 3. Difficulty */}
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="input-field"
          style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8125rem' }}
        >
          <option value="">Difficulty: All</option>
          <option value="Advanced">Advanced (Top 5%)</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Beginner">Beginner</option>
        </select>

        {/* 4. Verification */}
        <select
          value={verificationFilter}
          onChange={(e) => setVerificationFilter(e.target.value)}
          className="input-field"
          style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8125rem' }}
        >
          <option value="">Verification: Any</option>
          <option value="Container Passed">Container Passed</option>
          <option value="Double-Blind Audited">Double-Blind Audited</option>
          <option value="Defense Verified">Defense Verified</option>
        </select>

        {/* 5. Proof Confidence */}
        <select
          value={confidenceFilter}
          onChange={(e) => setConfidenceFilter(e.target.value)}
          className="input-field"
          style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8125rem' }}
        >
          <option value="">Proof Confidence: Any</option>
          <option value="High">High Confidence</option>
          <option value="Medium">Medium Confidence</option>
        </select>

        {/* 6. Location */}
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="input-field"
          style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8125rem' }}
        >
          <option value="">Location: Any</option>
          <option value="Remote">Remote</option>
          <option value="Bengaluru">Bengaluru</option>
          <option value="San Francisco">San Francisco</option>
          <option value="London">London</option>
        </select>

        {/* 7. Experience */}
        <select
          value={experienceFilter}
          onChange={(e) => setExperienceFilter(e.target.value)}
          className="input-field"
          style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8125rem' }}
        >
          <option value="">Experience: Any</option>
          <option value="Junior / Student">Junior / Student</option>
          <option value="Mid-Level">Mid-Level</option>
          <option value="Senior / Staff">Senior / Staff</option>
        </select>
      </div>
    </div>
  );
};
