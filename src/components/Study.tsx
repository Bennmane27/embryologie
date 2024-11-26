import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Search, Circle, X } from 'lucide-react';
import { useGameStore } from '../store';
import { questions } from '../data';

export const Study: React.FC = () => {
  const { setShowStudy } = useGameStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [flippedQuestion, setFlippedQuestion] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <style>{`
        .card-flip {
          perspective: 1000px;
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }
        .card-flip.flipped {
          transform: rotateY(180deg);
        }
        .card-front,
        .card-back {
          position: relative;
          width: 100%;
          backface-visibility: hidden;
        }
        .card-back {
          position: absolute;
          inset: 0;
          transform: rotateY(180deg);
        }
      `}</style>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold">Mode Étude</h2>
          </div>
          <button
            onClick={() => setShowStudy(false)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une étape..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex">
          {/* Content column */}
          <div className="flex-grow pr-6">
            <div className="space-y-6">
              {expandedQuestion === null ? (
                filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    data-question={question.id}
                    className={`relative mb-${[18, 19, 20].includes(question.id) ? '96' : '6'} ${
                      isMobile ? 'card-flip' : ''
                    } ${flippedQuestion === question.id ? 'flipped' : ''}`}
                    style={{ 
                      minHeight: flippedQuestion === question.id ? '400px' : 'auto',
                    }}
                  >
                    <div 
                      className="card-front bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-100 cursor-pointer"
                      onClick={() => {
                        if (isMobile) {
                          setFlippedQuestion(question.id);
                        } else {
                          setExpandedQuestion(question.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                    >
                      <h3 className="text-lg font-semibold text-purple-900 mb-2">
                        Étape {question.id} : {question.title}
                      </h3>
                      <p className="text-purple-800">{question.description}</p>
                    </div>
                    {isMobile && (
                      <div 
                        className="card-back bg-white rounded-lg border border-purple-100 cursor-pointer overflow-hidden"
                        onClick={() => setFlippedQuestion(null)}
                        style={{
                          minHeight: [18, 19, 20].includes(question.id) ? '90vh' : '400px'
                        }}
                      >
                        <div className="flex flex-col h-full">
                          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 sticky top-0 z-10">
                            <h3 className="text-lg font-semibold text-purple-900">
                              Étape {question.id} : {question.title}
                            </h3>
                          </div>
                          <div className="p-4">
                            {question.imageUrl ? (
                              <img
                                src={question.imageUrl}
                                alt={`Étape ${question.id}`}
                                className={`w-full h-auto rounded-lg shadow-sm ${
                                  question.id === 18 || question.id === 19 ? 'max-w-[175px] max-h-[349px] mx-auto' : ''
                                } ${question.id === 20 ? 'max-w-[175px] max-h-[309px] mx-auto' : ''}`}
                              />
                            ) : (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                                Pas d'image pour cette étape
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-100 transition-transform duration-300">
                  <button
                    onClick={() => setExpandedQuestion(null)}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors mb-4"
                  >
                    <X className="w-5 h-5" />
                    Fermer
                  </button>
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">
                    Étape {questions[expandedQuestion - 1].id} : {questions[expandedQuestion - 1].title}
                  </h3>
                  <p className="text-purple-800 mb-4">{questions[expandedQuestion - 1].description}</p>
                  {questions[expandedQuestion - 1].imageUrl ? (
                    <div className="flex justify-center">
                      <div className="w-full flex justify-center">
                        <img
                          src={questions[expandedQuestion - 1].imageUrl}
                          alt={`Étape ${questions[expandedQuestion - 1].id}`}
                          className={`w-auto max-w-full h-auto rounded-lg shadow-sm object-contain ${
                            [18, 19, 20].includes(questions[expandedQuestion - 1].id) ? '' : 'max-h-[80vh]'
                          }`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                        Pas d'image pour cette étape
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Timeline column */}
          {!isMobile && (
            <div className="w-64 flex-shrink-0 relative">
              <div className="sticky top-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-200"></div>
                  <div className="space-y-4">
                    {questions.map((question) => (
                      <div key={question.id} className="relative flex items-start">
                        <div className="absolute left-4 top-4 -ml-2">
                          <Circle className="w-4 h-4 text-purple-500 fill-current" />
                        </div>
                        {question.imageUrl && (
                          <div className="ml-8">
                            <div className="text-xs text-purple-600 mb-1">Étape {question.id}</div>
                            <img
                              src={question.imageUrl}
                              alt={`Étape ${question.id}`}
                              className="w-32 h-auto rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer object-cover"
                              onClick={() => {
                                const element = document.querySelector(`[data-question="${question.id}"]`);
                                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};