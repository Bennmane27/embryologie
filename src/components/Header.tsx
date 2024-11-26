import React from 'react';
import { Brain } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Embryologie Flash</h1>
        </div>
      </div>
    </header>
  );
};