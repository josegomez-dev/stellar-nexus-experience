'use client';

import { useState } from 'react';
import { DemoFeedback } from '@/lib/firebase-types';

interface SimpleFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: Partial<DemoFeedback>) => Promise<void>;
  demoId: string;
  demoName: string;
  completionTime: number;
}

export const SimpleFeedbackModal: React.FC<SimpleFeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  demoId,
  demoName,
  completionTime,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quickFeedbackOptions = [
    'Great demo! 🎉',
    'Easy to follow 👍',
    'Very helpful 💡',
    'Could be clearer 🤔',
    'Too complex 😅',
    'Needs more examples 📚',
  ];

  const handleQuickFeedback = (option: string) => {
    setFeedback(option);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        demoId,
        demoName,
        rating,
        feedback: feedback.trim() || 'No specific feedback provided',
        completionTime,
        difficulty: 'medium', // Default
        wouldRecommend: rating >= 4, // Auto-determine based on rating
      });

      onClose();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm'>
      <div className='relative w-full max-w-md mx-4 bg-gradient-to-br from-neutral-900 via-blue-900 to-neutral-900 rounded-2xl border border-white/20 shadow-2xl'>
        {/* Header */}
        <div className='relative p-6 border-b border-white/10'>
          <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-t-2xl'></div>
          <div className='relative z-10 text-center'>
            <h2 className='text-2xl font-bold text-white mb-2'>🎉 Demo Complete!</h2>
            <p className='text-gray-300 text-sm'>
              Quick feedback on <span className='font-semibold text-blue-400'>{demoName}</span>
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {/* Rating */}
          <div className='text-center'>
            <label className='block text-sm font-medium text-white mb-3'>How was it? ⭐</label>
            <div className='flex justify-center items-center space-x-2'>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type='button'
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-all duration-200 hover:scale-110 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <p className='text-xs text-gray-400 mt-2'>
              {rating === 0 && 'Click a star to rate ⭐'}
              {rating === 1 && 'Needs work 😔'}
              {rating === 2 && 'Could be better 🤔'}
              {rating === 3 && 'Good 👍'}
              {rating === 4 && 'Great! 🎉'}
              {rating === 5 && 'Amazing! 🚀'}
            </p>
          </div>

          {/* Quick Feedback Options */}
          <div>
            <label className='block text-sm font-medium text-white mb-2'>
              Quick thoughts (optional):
            </label>
            <div className='grid grid-cols-2 gap-2 mb-3'>
              {quickFeedbackOptions.map(option => (
                <button
                  key={option}
                  type='button'
                  onClick={() => handleQuickFeedback(option)}
                  className={`px-3 py-2 text-xs rounded-lg border transition-all duration-200 ${
                    feedback === option
                      ? 'bg-blue-500/20 border-blue-400/50 text-blue-300'
                      : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Custom feedback */}
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder='Or write your own thoughts...'
              rows={2}
              className='w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm'
            />
          </div>

          {/* Stats */}
          <div className='bg-white/5 rounded-lg p-3 text-center'>
            <p className='text-xs text-gray-400'>
              ⏱️ Completed in {Math.round(completionTime)} minutes
            </p>
          </div>

          {/* Buttons */}
          <div className='flex items-center justify-between pt-2'>
            <button
              type='button'
              onClick={handleSkip}
              disabled={isSubmitting}
              className='px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50 text-sm'
            >
              Skip
            </button>

            <button
              type='submit'
              disabled={isSubmitting || rating === 0}
              className='px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl text-sm'
            >
              {isSubmitting ? 'Sending...' : 'Submit 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
