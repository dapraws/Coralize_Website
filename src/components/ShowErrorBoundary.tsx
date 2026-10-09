import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

/**
 * The kiosk runs unattended for hours. A render fault anywhere below this
 * boundary would otherwise unmount the whole tree and leave a blank display
 * with nobody around to reload it — so catch it, show something on brand, and
 * recover on our own after a moment.
 */
export class ShowErrorBoundary extends Component<
  { children: ReactNode; onRecover?: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  private timer: number | undefined;

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Coralize: recovering from a render fault", error, info);
    this.timer = window.setTimeout(() => {
      this.setState({ failed: false });
      this.props.onRecover?.();
    }, 2500);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timer);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-paper">
        <div className="text-center">
          <img
            src="/art/app-icon.webp"
            alt=""
            className="mx-auto h-16 w-16 animate-pulse rounded-2xl"
          />
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.34em] text-ink/45">
            Resurfacing…
          </p>
        </div>
      </div>
    );
  }
}
