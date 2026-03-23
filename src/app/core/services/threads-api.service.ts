import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ThreadStats {
  activeThreads: number;
  pendingLogs: number;
}

@Injectable({
  providedIn: 'root'
})
export class ThreadsApiService {
  private apiUrl = 'https://log-ingestion-engin.onrender.com/api/logs/stats';

  constructor(private http: HttpClient) { }

  getStats(): Observable<ThreadStats> {
    return this.http.get<ThreadStats>(this.apiUrl);
  }
}