import React from 'react';
import { ArrowLeft, XCircle } from 'lucide-react';
import { useGameStore } from '../store';

export const Mistakes: React.FC = () => {
  const { mistakes, setShowMistakes } = useGameStore();

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-100 rounded-full">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold">Erreurs ({mistakes.length})</h2>
          </div>
          <button
            onClick={() => setShowMistakes(false)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
        </div>

        {mistakes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune erreur pour le moment !</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mistakes.map((mistake, index) => (
              <div key={index} className="bg-red-50 rounded-lg p-6 border border-red-100">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Étape {mistake.id} : {mistake.title}
                </h3>
                <p className="text-red-700">{mistake.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};