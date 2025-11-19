import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useServiceWorker } from '../../hooks/useServiceWorker';
import * as swManager from '../../services/sw-registration';

// Mock service worker manager
vi.mock('../../services/sw-registration', () => ({
  swManager: {
    register: vi.fn(),
    update: vi.fn(),
  },
}));

describe('useServiceWorker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useServiceWorker());

    expect(result.current.offlineReady).toBe(false);
    expect(result.current.needRefresh).toBe(false);
    expect(typeof result.current.updateServiceWorker).toBe('function');
  });

  it('should register service worker on mount', () => {
    renderHook(() => useServiceWorker());

    expect(swManager.swManager.register).toHaveBeenCalledTimes(1);
    expect(swManager.swManager.register).toHaveBeenCalledWith(
      expect.objectContaining({
        onOfflineReady: expect.any(Function),
        onNeedRefresh: expect.any(Function),
      })
    );
  });

  it('should set offlineReady when callback is triggered', async () => {
    let onOfflineReadyCallback: (() => void) | undefined;

    vi.mocked(swManager.swManager.register).mockImplementation((callbacks) => {
      onOfflineReadyCallback = callbacks?.onOfflineReady;
      return Promise.resolve();
    });

    const { result } = renderHook(() => useServiceWorker());

    expect(result.current.offlineReady).toBe(false);

    // Trigger the callback
    onOfflineReadyCallback?.();

    await waitFor(() => {
      expect(result.current.offlineReady).toBe(true);
    });
  });

  it('should set needRefresh when callback is triggered', async () => {
    let onNeedRefreshCallback: (() => void) | undefined;

    vi.mocked(swManager.swManager.register).mockImplementation((callbacks) => {
      onNeedRefreshCallback = callbacks?.onNeedRefresh;
      return Promise.resolve();
    });

    const { result } = renderHook(() => useServiceWorker());

    expect(result.current.needRefresh).toBe(false);

    // Trigger the callback
    onNeedRefreshCallback?.();

    await waitFor(() => {
      expect(result.current.needRefresh).toBe(true);
    });
  });

  it('should call swManager.update when updateServiceWorker is called', async () => {
    const { result } = renderHook(() => useServiceWorker());

    await result.current.updateServiceWorker();

    expect(swManager.swManager.update).toHaveBeenCalledTimes(1);
  });

  it('should reset needRefresh when updating', async () => {
    let onNeedRefreshCallback: (() => void) | undefined;

    vi.mocked(swManager.swManager.register).mockImplementation((callbacks) => {
      onNeedRefreshCallback = callbacks?.onNeedRefresh;
      return Promise.resolve();
    });

    const { result } = renderHook(() => useServiceWorker());

    // Trigger needRefresh
    onNeedRefreshCallback?.();

    await waitFor(() => {
      expect(result.current.needRefresh).toBe(true);
    });

    // Update service worker
    await result.current.updateServiceWorker();

    await waitFor(() => {
      expect(result.current.needRefresh).toBe(false);
    });
  });
});
