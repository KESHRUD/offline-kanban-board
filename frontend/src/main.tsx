import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'

// Enable MSW in development mode
async function enableMocking() {
  // Only enable MSW if explicitly requested via URL parameter
  if (import.meta.env.MODE === 'development') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('msw') === 'on') {
      const { startMockWorker } = await import('./mocks/browser');
      await startMockWorker();
      console.log('🔶 MSW enabled - API calls are mocked');
    }
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>,
  );
});
