import { useState, useEffect } from 'react';
import { swManager } from '../services/sw-registration';

export interface ServiceWorkerState {
  offlineReady: boolean;
  needRefresh: boolean;
  updateServiceWorker: () => Promise<void>;
}

export function useServiceWorker(): ServiceWorkerState {
  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    swManager.register({
      onOfflineReady: () => {
        setOfflineReady(true);
        console.log('📱 App ready to work offline');
      },
      onNeedRefresh: () => {
        setNeedRefresh(true);
        console.log('🔄 New content available, please refresh');
      },
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  const updateServiceWorker = async () => {
    setNeedRefresh(false);
    await swManager.update();
  };

  return {
    offlineReady,
    needRefresh,
    updateServiceWorker,
  };
}
