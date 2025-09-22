import { renderHook, act } from '@testing-library/react';
import { useDemoCompletionHistory } from '../../hooks/useDemoCompletionHistory';

// Mock the contexts
jest.mock('../../contexts/WalletContext', () => ({
  useGlobalWallet: () => ({
    walletData: {
      publicKey: 'test-wallet-address',
      network: 'TESTNET',
      isMainnet: false,
    },
    isConnected: true,
  }),
}));

jest.mock('../../contexts/ToastContext', () => ({
  useToast: () => ({
    addToast: jest.fn(),
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useDemoCompletionHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with empty history', () => {
    const { result } = renderHook(() => useDemoCompletionHistory());
    
    expect(result.current.completionHistory).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should add completion record', () => {
    const { result } = renderHook(() => useDemoCompletionHistory());
    
    act(() => {
      result.current.addCompletion({
        demoId: 'hello-milestone',
        demoName: 'Baby Steps to Riches',
        score: 85,
        pointsEarned: 85,
        completionTime: 120,
        isFirstCompletion: true,
      });
    });

    expect(result.current.completionHistory).toHaveLength(1);
    expect(result.current.completionHistory[0]).toMatchObject({
      demoId: 'hello-milestone',
      demoName: 'Baby Steps to Riches',
      score: 85,
      pointsEarned: 85,
      completionTime: 120,
      isFirstCompletion: true,
    });
  });

  it('should calculate demo statistics correctly', () => {
    const { result } = renderHook(() => useDemoCompletionHistory());
    
    // Add multiple completions
    act(() => {
      result.current.addCompletion({
        demoId: 'hello-milestone',
        demoName: 'Baby Steps to Riches',
        score: 80,
        pointsEarned: 80,
        completionTime: 120,
        isFirstCompletion: true,
      });
    });

    act(() => {
      result.current.addCompletion({
        demoId: 'hello-milestone',
        demoName: 'Baby Steps to Riches',
        score: 90,
        pointsEarned: 20, // 25% of original for replay
        completionTime: 100,
        isFirstCompletion: false,
      });
    });

    expect(result.current.getCompletionCount('hello-milestone')).toBe(2);
    expect(result.current.getTotalPointsEarned('hello-milestone')).toBe(100);
    expect(result.current.getBestScore('hello-milestone')).toBe(90);
    expect(result.current.getAverageScore('hello-milestone')).toBe(85);
  });

  it('should filter demo history by demo ID', () => {
    const { result } = renderHook(() => useDemoCompletionHistory());
    
    act(() => {
      result.current.addCompletion({
        demoId: 'hello-milestone',
        demoName: 'Baby Steps to Riches',
        score: 85,
        pointsEarned: 85,
        completionTime: 120,
        isFirstCompletion: true,
      });
    });

    act(() => {
      result.current.addCompletion({
        demoId: 'other-demo',
        demoName: 'Other Demo',
        score: 90,
        pointsEarned: 90,
        completionTime: 100,
        isFirstCompletion: true,
      });
    });

    const helloMilestoneHistory = result.current.getDemoHistory('hello-milestone');
    expect(helloMilestoneHistory).toHaveLength(1);
    expect(helloMilestoneHistory[0].demoId).toBe('hello-milestone');
  });
});
