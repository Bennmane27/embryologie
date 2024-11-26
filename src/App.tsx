import React from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Game } from './components/Game';
import { Mistakes } from './components/Mistakes';
import { Study } from './components/Study';
import { useGameStore } from './store';

export default function App() {
  const { currentMode, showMistakes, showStudy } = useGameStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {showMistakes ? (
        <Mistakes />
      ) : showStudy ? (
        <Study />
      ) : currentMode === null ? (
        <Dashboard />
      ) : (
        <Game />
      )}
    </div>
  );
}