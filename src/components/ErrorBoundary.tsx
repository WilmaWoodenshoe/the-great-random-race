import { Component, type ErrorInfo, type ReactNode } from 'react';
import { nl } from '../content/nl';
import { createIndexedDbStorage } from '../storage/storage';

interface State {
  failed: boolean;
  message?: string;
  where?: string;
}

/** Vangt onverwachte fouten op, zodat de speler nooit naar een leeg scherm kijkt. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(error: unknown): State {
    return { failed: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error(error);
    // Waar het misging: het eerste scherm-onderdeel en de eerste regels van de fout.
    const component = info.componentStack?.trim().split('\n')[0]?.trim() ?? '';
    const stack = error instanceof Error ? (error.stack ?? '').split('\n').slice(1, 3).map((l) => l.trim()).join(' | ') : '';
    this.setState({ where: [component, stack].filter(Boolean).join(' | ') });
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
        {this.state.message && <small className="error__detail">{this.state.message}</small>}
        {this.state.where && <small className="error__detail">{this.state.where}</small>}
      </div>
    );
  }
}
