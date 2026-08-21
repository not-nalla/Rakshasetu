import { useState } from 'react';

export default function SearchPillBar({ placeholder = 'Search...', onSearch, className = '' }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="flex-1 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-3 rounded-full bg-white border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-safetyLime/50 focus:border-safetyLime transition-all"
        />
      </div>
      <button
        type="submit"
        className="px-6 py-3 rounded-full bg-brandDark text-white text-sm font-semibold hover:bg-slate-800 transition-colors duration-150"
      >
        Search
      </button>
    </form>
  );
}
