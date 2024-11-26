import React from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Session } from '../types';
import { questions } from '../data';

interface SessionDetailsProps {
  session: Session;
  onClose: () => void;
}

export const SessionDetails: React.FC<SessionDetailsProps> = ({ session, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Session de {session.userName}</h3>
            <p className="text-sm text-gray-600">{session.date}</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
        </div>

        <div className="mb-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="font-medium">Mode : {session.mode === 'title' ? 'Titre' : 'Description'}</p>
            <p className="font-medium">
              Score : {session.correctAnswers}/{session.questionsAnswered} (
              {Math.round((session.correctAnswers / session.questionsAnswered) * 100)}%)
            </p>
            <p className="text-sm text-gray-600">
              Statut : {session.completed ? 'Terminé' : 'Abandonné'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {session.answers.map((answer, index) => {
            const question = questions.find((q) => q.id === answer.questionId);
            if (!question) return null;

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  answer.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium mb-2">
                      Question {index + 1} : {question.title}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">{question.description}</p>
                    <p className="text-sm">
                      Réponse donnée : <span className="font-medium">{answer.answer}</span>
                    </p>
                  </div>
                  {answer.correct ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};