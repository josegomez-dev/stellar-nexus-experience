'use client';

import React from 'react';
import { logInfo, logWarning, logError } from '@/lib/bugfender';

export const BugfenderTestPanel: React.FC = () => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const testLogs = () => {
    logInfo('Test info log from panel', { timestamp: new Date().toISOString() });
    logWarning('Test warning log from panel', { level: 'warning' });
    logError('Test error log from panel', new Error('This is a test error'));
  };

  const testCrash = () => {
    // This will trigger the error handler
    throw new Error('Test crash from Bugfender panel');
  };

  const sendIssue = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const { Bugfender } = await import('@bugfender/sdk');
      const result = await Bugfender.sendIssue('Test issue from panel', 'This is a test issue sent from the debug panel');
      logInfo('Issue sent successfully', { result });
    } catch (error) {
      logError('Failed to send issue', error);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 w-80 bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm max-h-48 overflow-y-auto z-40">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Bugfender Test Panel</h3>
        <div className="text-xs text-green-400">🐛 Active</div>
      </div>

      <div className="space-y-2">
        <button
          onClick={testLogs}
          className="w-full text-left bg-blue-600 text-white px-3 py-2 rounded text-xs hover:bg-blue-700 transition-colors"
        >
          📝 Test Logs (Info/Warning/Error)
        </button>

        <button
          onClick={sendIssue}
          className="w-full text-left bg-green-600 text-white px-3 py-2 rounded text-xs hover:bg-green-700 transition-colors"
        >
          🚀 Send Test Issue
        </button>

        <button
          onClick={() => {
            try {
              testCrash();
            } catch (error) {
              console.error('Caught test crash:', error);
            }
          }}
          className="w-full text-left bg-red-600 text-white px-3 py-2 rounded text-xs hover:bg-red-700 transition-colors"
        >
          💥 Test Error Handler
        </button>

        <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
          Check Bugfender dashboard to see logs
        </div>
      </div>
    </div>
  );
};
