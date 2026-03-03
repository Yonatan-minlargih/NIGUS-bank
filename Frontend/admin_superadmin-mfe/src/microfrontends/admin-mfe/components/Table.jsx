import React from 'react';

const Table = ({ 
  columns, 
  data, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-white">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="backdrop-blur-[12px] rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-white/10 transition-colors duration-150">
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-white"
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
