import React, { useState, useEffect } from 'react';
import { Trophy, XCircle, BookOpen, FileText, History, GraduationCap } from 'lucide-react';
import { useGameStore } from '../store';
import { questions } from '../data';
import { Session } from '../types';
import { SessionDetails } from './SessionDetails';

export const Dashboard: React.FC = () => {
  const { score, mistakes, setMode, setShowMistakes, setShowStudy, sessions, setUserName, loadSessions } = useGameStore();
  const [showNameInput, setShowNameInput] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'title' | 'description' | null>(null);
  const [inputName, setInputName] = useState('');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const totalQuestions = questions.length;

  useEffect(() => {
    loadSessions();
  }, []);

  const handleModeSelect = (mode: 'title' | 'description') => {
    setSelectedMode(mode);
    setShowNameInput(true);
  };

  const handleStartSession = () => {
    if (inputName.trim()) {
      setUserName(inputName);
      setMode(selectedMode!);
      setShowNameInput(false);
      setInputName('');
    }
  };

  return (
    <div className="container mx-auto p-6">
      {showNameInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Commencer une nouvelle session</h3>
            <p className="text-gray-600 mb-4">
              Entrez votre nom pour commencer le mode {selectedMode === 'title' ? 'Titre' : 'Description'}
            </p>
            <input
              type="text"
              placeholder="Votre nom"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStartSession()}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowNameInput(false);
                  setInputName('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleStartSession}
                disabled={!inputName.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Commencer
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedSession && (
        <SessionDetails
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Score actuel</h2>
              <p className="text-sm text-gray-600">Sur {totalQuestions} questions</p>
            </div>
          </div>
          <p className="text-4xl font-bold text-purple-600">{score}/{totalQuestions}</p>
        </div>

        <button 
          onClick={() => setShowMistakes(true)}
          className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow text-left"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Erreurs</h2>
              <p className="text-sm text-gray-600">Cliquez pour voir les détails</p>
            </div>
          </div>
          <p className="text-4xl font-bold text-red-500">{mistakes.length}</p>
        </button>

        <button
          onClick={() => setShowStudy(true)}
          className="md:col-span-2 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg p-8 transition-all duration-200 transform hover:-translate-y-1"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-full">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold">Mode Étude</h3>
          </div>
          <p className="text-sm opacity-90">
            Révisez toutes les étapes avant de vous tester
          </p>
        </button>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handleModeSelect('title')}
            className="bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl shadow-lg p-8 transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/10 rounded-full">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold">Mode Titre</h3>
            </div>
            <p className="text-sm opacity-90">
              Trouvez le bon titre correspondant à la description donnée
            </p>
          </button>

          <button
            onClick={() => handleModeSelect('description')}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg p-8 transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/10 rounded-full">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold">Mode Description</h3>
            </div>
            <p className="text-sm opacity-90">
              Trouvez la bonne description correspondant au titre donné
            </p>
          </button>
        </div>

        <div className="md:col-span-2">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
              <History className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-purple-900">Sessions précédentes</h3>
            </div>
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucune session pour le moment</p>
              ) : (
                sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className="w-full bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-purple-900">
                          {session.userName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Mode {session.mode === 'title' ? 'Titre' : 'Description'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">
                          {session.correctAnswers}/{session.questionsAnswered}
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.completed ? 'Terminé' : 'Abandonné'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};