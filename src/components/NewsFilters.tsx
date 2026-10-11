import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Language, SortOrder } from '../types/blogger';
import { BLOGGER_CATEGORIES, UI_STRINGS } from '../data/blogger-config';
import { CategoryIcon } from './CategoryIcon';

interface NewsFiltersProps {
  lang: Language;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  totalResults: number;
}

export const NewsFilters: React.FC<NewsFiltersProps> = ({
  lang,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  totalResults,
}) => {
  const t = UI_STRINGS[lang];

  return (
    <div className="backdrop-blur-xl bg-white/70 border border-white/80 rounded-3xl p-4 sm:p-6 shadow-lg shadow-slate-900/5 space-y-5">
      {/* Search Input & Sort Order */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200/80 bg-white/80 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Order Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-slate-200 bg-white/80 text-xs font-semibold text-slate-700 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.sortBy}:</span>
            <select
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value as SortOrder)}
              className="bg-transparent font-bold text-slate-900 border-none outline-hidden cursor-pointer"
            >
              <option value="newest">{t.newestFirst}</option>
              <option value="oldest">{t.oldestFirst}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Glass Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {t.filterByCategory}
          </span>
          <span>
            {lang === 'bn' ? `মোট ${totalResults} টি প্রতিবেদন` : `${totalResults} articles`}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
          {/* All category pill */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200/80'
            }`}
          >
            {t.allCategories}
          </button>

          {BLOGGER_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? cat.isEmergency
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                      : 'bg-emerald-800 text-white border-emerald-800 shadow-md'
                    : cat.isEmergency
                    ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                    : 'bg-white/80 text-slate-700 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <CategoryIcon name={cat.iconName} className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === 'bn' ? cat.bn : cat.en}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
