'use client';

import { v4 as uuidv4 } from 'uuid';

const VISITOR_ID_KEY = 'tovy_visitor_id';

export function getVisitorId(): string {
  if (typeof window === 'undefined') {
    return 'server-side-user';
  }

  let visitorId = localStorage.getItem(VISITOR_ID_KEY);

  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }

  return visitorId;
}

export function getTraceId(): string {
  return uuidv4();
}
