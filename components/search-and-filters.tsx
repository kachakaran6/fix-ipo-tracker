'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Download, X } from 'lucide-react';
import { IPOName } from '@/lib/types';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedIPO: string;
  onIPOFilter: (value: string) => void;
  ipoNames: IPOName[];
  onExport: () => void;
  applicationsCount: number;
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  selectedIPO,
  onIPOFilter,
  ipoNames,
  onExport,
  applicationsCount,
}: SearchAndFiltersProps) {
  const clearFilters = () => {
    onSearchChange('');
    onIPOFilter('all');
  };

  const hasActiveFilters = searchTerm || (selectedIPO && selectedIPO !== 'all');

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by PAN or application number..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedIPO || 'all'} onValueChange={onIPOFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by IPO" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All IPOs</SelectItem>
            {ipoNames.map((ipo) => (
              <SelectItem key={ipo.id} value={ipo.name}>
                {ipo.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {applicationsCount} application{applicationsCount !== 1 ? 's' : ''}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={applicationsCount === 0}
          className="hover:bg-green-50 hover:border-green-300 hover:text-green-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}