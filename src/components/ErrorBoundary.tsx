import { Component, type ReactNode } from 'react';
import { nl } from '../content/nl';
import { createIndexedDbStorage } from '../storage/storage';

interface State {
  failed: boolean;
}

/** Vangt onverwachte fouten op, zodat de speler nooit naar een leeg scherm kijkt. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(error);
  }

  private reset = async () => {
    if (!window.confirm(nl.error.resetConfirm)) return;
    try {
      await createIndexedDbStorage().clear();
    } finally {
      window.location.hash = '#/';
      window.location.reload();
    }
  };

  render() {
    if (!this.state.failed) return this.props.children;
    const t = nl.error;
    return (
      <div className="screen not-found" role="alert">
        <h1 className="kop kop--36">{t.title}</h1>
        <p>{t.text}</p>
        <button type="button" className="btn btn--groen btn--groot" onClick={() => window.location.reload()}>
          {t.retry}
        </button>
        <button type="button" className="link-btn" onClick={this.reset}>
          {t.reset}
        </button>
      </div>
    );
  }
}
