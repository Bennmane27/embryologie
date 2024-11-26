import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store';
import { questions } from '../data';
import { ArrowLeft, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { Question } from '../types';

export const Game: React.FC = () => {
  const { currentMode, incrementScore, addMistake, setMode, score, startSession, endSession, userName, addAnswer } = useGameStore();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionsAsked, setQuestionsAsked] = useState<number[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    if (currentMode === 'title' || currentMode === 'description') {
      startSession(currentMode, userName);
    }
    setQuestionsAsked([]);
    generateNewQuestion();
  }, [currentMode]);

  const handleExit = () => {
    if (questionsAsked.length > 0 && !gameComplete) {
      setShowExitConfirm(true);
    } else {
      endSession(false);
    }
  };

  const confirmExit = () => {
    endSession(false);
    setShowExitConfirm(false);
  };

  const generateNewQuestion = () => {
    const availableQuestions = questions.filter(q => !questionsAsked.includes(q.id));
    
    if (availableQuestions.length === 0) {
      setGameComplete(true);
      endSession(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const currentQ = availableQuestions[randomIndex];
    setCurrentQuestion(currentQ);
    setQuestionsAsked(prev => [...prev, currentQ.id]);

    const wrongOptions = questions
      .filter((q) => q.id !== currentQ.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map((q) => (currentMode === 'title' ? q.title : q.description));

    const allOptions = [
      ...(currentMode === 'title' ? [currentQ.title] : [currentQ.description]),
      ...wrongOptions,
    ].sort(() => Math.random() - 0.5);

    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowCorrectAnswer(false);
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
    
    setSelectedAnswer(answer);
    const isAnswerCorrect = currentMode === 'title'
      ? answer === currentQuestion.title
      : answer === currentQuestion.description;

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      incrementScore();
    } else {
      addMistake(currentQuestion);
    }

    addAnswer(currentQuestion.id, isAnswerCorrect, answer);
    setShowCorrectAnswer(true);

    setTimeout(() => {
      if (questionsAsked.length === questions.length) {
        setGameComplete(true);
        endSession(true);
      } else {
        generateNewQuestion();
      }
    }, 2500);
  };

  if (gameComplete) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
              <Trophy className="w-12 h-12 text-purple-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Félicitations {userName} !</h2>
          <p className="text-xl mb-4">Vous avez terminé toutes les questions !</p>
          <p className="text-gray-600 mb-8">
            Score final : {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
          </p>
          <button
            onClick={() => setMode(null)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-1"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleExit}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au tableau de bord
        </button>
        <div className="bg-purple-100 px-4 py-2 rounded-full text-purple-700 font-medium">
          Question {questionsAsked.length}/{questions.length}
        </div>
      </div>

      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Quitter la session ?</h3>
            <p className="text-gray-600 mb-6">
              Voulez-vous vraiment quitter ? Votre progression sera enregistrée comme une session abandonnée.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={confirmExit}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {currentMode === 'title'
              ? 'Trouvez le titre correspondant'
              : 'Trouvez la description correspondante'}
          </h2>
          <div className="text-sm text-gray-600">
            Session de {userName}
          </div>
        </div>

        <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
          <p className="text-purple-900 text-lg">
            {currentMode === 'title' ? currentQuestion.description : currentQuestion.title}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const showCorrect = isSelected && isCorrect;
            const showIncorrect = isSelected && !isCorrect;
            const isCorrectAnswer = currentMode === 'title' 
              ? option === currentQuestion.title 
              : option === currentQuestion.description;

            return (
              <button
                key={index}
                onClick={() => !selectedAnswer && handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`p-6 text-left border-2 rounded-xl transition-all duration-200 flex justify-between items-center ${
                  isSelected
                    ? showCorrect
                      ? 'bg-green-50 border-green-500'
                      : showIncorrect
                      ? 'bg-red-50 border-red-500'
                      : 'border-purple-300'
                    : showCorrectAnswer && isCorrectAnswer
                    ? 'bg-green-50 border-green-500'
                    : 'border-purple-100 hover:bg-purple-50 hover:border-purple-300'
                }`}
              >
                <span className="text-lg">{option}</span>
                {(isSelected || (showCorrectAnswer && isCorrectAnswer)) && (
                  isCorrectAnswer ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  )
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};