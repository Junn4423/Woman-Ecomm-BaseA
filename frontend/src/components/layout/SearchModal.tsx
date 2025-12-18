'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularSearches = [
  'Váy hoa',
  'Đầm dự tiệc',
  'Áo sơ mi',
  'Quần jean',
  'Set đồ công sở',
];

const recentSearches = [
  'Váy maxi',
  'Áo croptop',
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
      setQuery('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute top-0 left-0 right-0 bg-white shadow-xl animate-slide-down">
        <div className="container-custom py-6">
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-secondary-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-14 pr-14 py-4 text-lg border-2 border-secondary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
              autoFocus
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-secondary-400 hover:text-secondary-600"
            >
              <X className="w-6 h-6" />
            </button>
          </form>

          {/* Suggestions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium text-secondary-500 mb-3">
                  <Clock className="w-4 h-4" />
                  Tìm kiếm gần đây
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="px-4 py-2 bg-secondary-100 rounded-full text-secondary-700 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium text-secondary-500 mb-3">
                <TrendingUp className="w-4 h-4" />
                Tìm kiếm phổ biến
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 bg-secondary-100 rounded-full text-secondary-700 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
