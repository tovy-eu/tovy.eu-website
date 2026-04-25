import { GTagEvent } from '@/types/gtag';

export const sendGTMEvent = (event: GTagEvent) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(event);
  }
};
