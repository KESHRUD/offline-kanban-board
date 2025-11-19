import { registerSW } from 'virtual:pwa-register';

export interface SwRegistrationCallbacks {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOfflineReady?: () => void;
  onNeedRefresh?: () => void;
}

export class ServiceWorkerManager {
  private updateSW: ((reloadPage?: boolean) => Promise<void>) | null = null;

  async register(callbacks?: SwRegistrationCallbacks): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers are not supported');
      return;
    }

    try {
      this.updateSW = registerSW({
        immediate: true,
        onNeedRefresh() {
          callbacks?.onNeedRefresh?.();
        },
        onOfflineReady() {
          callbacks?.onOfflineReady?.();
          console.log('✅ App ready for offline use');
        },
        onRegistered(registration) {
          if (registration) {
            // Check for updates every hour
            setInterval(() => {
              registration.update();
            }, 60 * 60 * 1000);
          }
        },
        onRegisterError(error) {
          console.error('❌ Service Worker registration failed:', error);
        },
      });

      console.log('✅ Service Worker registered successfully');
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  }

  async update(): Promise<void> {
    if (this.updateSW) {
      await this.updateSW(true);
    }
  }

  async unregister(): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }
    this.updateSW = null;
  }
}

export const swManager = new ServiceWorkerManager();
