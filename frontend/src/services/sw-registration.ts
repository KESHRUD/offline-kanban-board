interface SwCallbacks {
  onOfflineReady?: () => void;
  onNeedRefresh?: () => void;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private callbacks: SwCallbacks = {};

  async register(callbacks: SwCallbacks): Promise<void> {
    this.callbacks = callbacks;

    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      // Check if there's a waiting service worker
      if (this.registration.waiting) {
        this.callbacks.onNeedRefresh?.();
      }

      // Listen for new service workers
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            this.callbacks.onNeedRefresh?.();
          } else if (newWorker.state === 'activated') {
            // Ready to work offline
            this.callbacks.onOfflineReady?.();
          }
        });
      });

      // If already active, we're ready
      if (this.registration.active) {
        this.callbacks.onOfflineReady?.();
      }

      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  async update(): Promise<void> {
    if (!this.registration) return;

    const waiting = this.registration.waiting;
    if (waiting) {
      waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  async unregister(): Promise<void> {
    if (this.registration) {
      await this.registration.unregister();
      this.registration = null;
    }
  }
}

export const swManager = new ServiceWorkerManager();
