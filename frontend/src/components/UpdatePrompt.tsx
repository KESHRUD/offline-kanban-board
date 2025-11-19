import { useServiceWorker } from '../hooks/useServiceWorker';
import '../styles/UpdatePrompt.css';

export function UpdatePrompt() {
  const { offlineReady, needRefresh, updateServiceWorker } = useServiceWorker();

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="update-prompt" role="alert">
      {needRefresh ? (
        <div className="update-prompt-content">
          <span className="update-icon">🔄</span>
          <div className="update-message">
            <strong>New version available!</strong>
            <p>Click to update and reload</p>
          </div>
          <button
            className="btn-update"
            onClick={updateServiceWorker}
          >
            Update Now
          </button>
        </div>
      ) : (
        <div className="update-prompt-content offline-ready">
          <span className="update-icon">✅</span>
          <div className="update-message">
            <strong>App ready to work offline</strong>
          </div>
        </div>
      )}
    </div>
  );
}
