import React from 'react';
import colors from '@/styles/color';

const DevDocs: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Color Palette Documentation</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(colors).map(([colorName, colorHex]) => (
          <div key={colorName} className="flex flex-col items-center p-4 border rounded-md">
            <div
              className="w-16 h-16 mb-2 rounded-full"
              style={{ backgroundColor: colorHex }}
            />
            <div className="text-center">
              <p className="font-semibold">{colorName}</p>
              <p className="text-sm text-gray-600">{colorHex}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevDocs;
