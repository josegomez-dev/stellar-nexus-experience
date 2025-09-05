import { renderHook, act } from '@testing-library/react';
import {
  useLocalStorage,
  useLocalStorageFlag,
  usePageLoaded,
} from '@/components/hooks/useLocalStorage';

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

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  it('should return initial value when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

    expect(result.current[0]).toBe('initial-value');
  });

  it('should return stored value from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('"stored-value"');

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when value changes', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"new-value"');
    expect(result.current[0]).toBe('new-value');
  });

  it('should handle function updates', () => {
    localStorageMock.getItem.mockReturnValue('"5"');

    const { result } = renderHook(() => useLocalStorage('test-key', 0));

    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"51"');
    expect(result.current[0]).toBe('51');
  });
});

describe('useLocalStorageFlag', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it('should return default value when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorageFlag('test-flag', true));

    expect(result.current.value).toBe(true);
  });

  it('should return stored boolean value', () => {
    localStorageMock.getItem.mockReturnValue('false');

    const { result } = renderHook(() => useLocalStorageFlag('test-flag', true));

    expect(result.current.value).toBe(false);
  });

  it('should provide toggle function', () => {
    localStorageMock.getItem.mockReturnValue('true');

    const { result } = renderHook(() => useLocalStorageFlag('test-flag', false));

    act(() => {
      result.current.toggle();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-flag', 'false');
    expect(result.current.value).toBe(false);
  });

  it('should provide enable function', () => {
    localStorageMock.getItem.mockReturnValue('false');

    const { result } = renderHook(() => useLocalStorageFlag('test-flag', false));

    act(() => {
      result.current.enable();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-flag', 'true');
    expect(result.current.value).toBe(true);
  });

  it('should provide disable function', () => {
    localStorageMock.getItem.mockReturnValue('true');

    const { result } = renderHook(() => useLocalStorageFlag('test-flag', true));

    act(() => {
      result.current.disable();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-flag', 'false');
    expect(result.current.value).toBe(false);
  });
});

describe('usePageLoaded', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it('should set page as loaded on first call', () => {
    localStorageMock.getItem.mockReturnValue(null);

    renderHook(() => usePageLoaded('test-page'));

    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-pageLoaded', 'true');
  });

  it('should not set page as loaded if already loaded', () => {
    localStorageMock.getItem.mockReturnValue('true');

    renderHook(() => usePageLoaded('test-page'));

    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it('should return loaded status', () => {
    localStorageMock.getItem.mockReturnValue('true');

    const { result } = renderHook(() => usePageLoaded('test-page'));

    expect(result.current).toBe(true);
  });
});
