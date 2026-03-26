import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ThreadStats {
  activeThreads: number;
  pendingLogs: number;
}

export interface IngestPayload {
  count: number;
  engineType: 'virtual' | 'platform';
}

@Injectable({
  providedIn: 'root'
})
export class ThreadsApiService {
  private readonly baseUrl = 'https://log-ingestion-engin.onrender.com';
  //private readonly baseUrl = 'http://localhost:8080';
  private statsApiUrl = this.baseUrl+'/api/logs/stats';
  private ingestApiUrl = this.baseUrl+'/api/logs/ingest';

  constructor(private http: HttpClient) { }

  getStats(): Observable<ThreadStats> {
    return this.http.get<ThreadStats>(this.statsApiUrl);
  }

  ingestLogs(payload: IngestPayload): Observable<any> {
    return this.http.post(this.ingestApiUrl, payload);
  }
}