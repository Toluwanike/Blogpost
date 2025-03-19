'use client';

import { Input } from "@/components/ui/input";
import { useCallback } from "react";
import { debounce } from "lodash";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  // Debounce the search to avoid excessive re-renders
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value);
    }, 300),
    [onSearch]
  );

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <Input
        type="text"
        placeholder="Search posts by title..."
        onChange={(e) => debouncedSearch(e.target.value)}
        className="w-full"
      />
    </div>
  );
}