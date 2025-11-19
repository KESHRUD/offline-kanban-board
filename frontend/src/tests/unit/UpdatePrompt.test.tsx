import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UpdatePrompt } from '../../components/UpdatePrompt';
import * as swHook from '../../hooks/useServiceWorker';

describe('UpdatePrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when no update is available', () => {
    vi.spyOn(swHook, 'useServiceWorker').mockReturnValue({
      offlineReady: false,
      needRefresh: false,
      updateServiceWorker: vi.fn(),
    });

    const { container } = render(<UpdatePrompt />);
    expect(container.firstChild).toBeNull();
  });

  it('should show offline ready message', () => {
    vi.spyOn(swHook, 'useServiceWorker').mockReturnValue({
      offlineReady: true,
      needRefresh: false,
      updateServiceWorker: vi.fn(),
    });

    render(<UpdatePrompt />);
    expect(screen.getByText(/App ready to work offline/i)).toBeInTheDocument();
  });

  it('should show update available message with button', () => {
    vi.spyOn(swHook, 'useServiceWorker').mockReturnValue({
      offlineReady: false,
      needRefresh: true,
      updateServiceWorker: vi.fn(),
    });

    render(<UpdatePrompt />);
    expect(screen.getByText(/New version available!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Now/i })).toBeInTheDocument();
  });

  it('should call updateServiceWorker when update button is clicked', async () => {
    const mockUpdate = vi.fn();
    vi.spyOn(swHook, 'useServiceWorker').mockReturnValue({
      offlineReady: false,
      needRefresh: true,
      updateServiceWorker: mockUpdate,
    });

    render(<UpdatePrompt />);
    const updateButton = screen.getByRole('button', { name: /Update Now/i });
    
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
