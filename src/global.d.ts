interface Window {
  gtag: (...args: unknown[]) => void;
  dataLayer: Record<string, unknown>[];
  Calendly?: {
    initInlineWidget: (options: { url: string; parentElement: HTMLElement | null }) => void;
  };
}
