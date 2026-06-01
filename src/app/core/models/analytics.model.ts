export interface AnalyticsEvent {
  eventType: string; // e.g., 'CLICK', 'PAGE_VIEW', 'HOVER'
  componentId: string; // e.g., 'PROJECT_CARD_1', 'NAVBAR_ABOUT'
  metadata: Record<string, any>; // Flexible data like { projectTitle: 'Java API' }
  timestamp: number; // Unix timestamp (milliseconds)
  sessionId: string; // Unique for the current visit
}
