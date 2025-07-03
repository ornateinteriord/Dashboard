import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { Pagination } from './Pagination';
import { PaginationInfo } from '../../types';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  filterable?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onSearch?: (term: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  filterable = false,
  pagination,
  onPageChange,
  onSort,
  onSearch,
  loading = false,
  emptyMessage = 'No data available',
  className = ''
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: string) => {
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);
    onSort?.(key, newDirection);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch?.(term);
  };

  const getValue = (item: T, key: string): any => {
    return key.includes('.') 
      ? key.split('.').reduce((obj, k) => obj?.[k], item)
      : item[key];
  };

  if (loading) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200"></div>
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filter Bar */}
      {(searchable || filterable) && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {searchable && (
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  icon={Search}
                />
              </div>
            )}
            {filterable && (
              <Button variant="secondary" icon={Filter} size="sm">
                Filters
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Data Table - Responsive container */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto min-w-full">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors duration-200' : ''
                    }`}
                    style={{ width: column.width, minWidth: column.width || '120px' }}
                    onClick={() => column.sortable && handleSort(column.key as string)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp 
                            className={`h-3 w-3 ${
                              sortKey === column.key && sortDirection === 'asc' 
                                ? 'text-blue-600' 
                                : 'text-gray-400'
                            }`} 
                          />
                          <ChevronDown 
                            className={`h-3 w-3 -mt-1 ${
                              sortKey === column.key && sortDirection === 'desc' 
                                ? 'text-blue-600' 
                                : 'text-gray-400'
                            }`} 
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 md:px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-4 md:px-6 py-4 whitespace-nowrap">
                        {column.render 
                          ? column.render(item)
                          : <span className="text-sm text-gray-900">{getValue(item, column.key as string)}</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && onPageChange && (
          <Pagination
            pagination={pagination}
            onPageChange={onPageChange}
          />
        )}
      </Card>
    </div>
  );
}