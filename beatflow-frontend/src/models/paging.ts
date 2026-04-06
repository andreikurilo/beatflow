export type PlaybackHistoryItem = {
  id: string;
  trackId: string;
  deviceId: string;
  startedAt: string;
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
};
