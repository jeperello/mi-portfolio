import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmartBatchService {
  private apiUrl = 'https://smart-reprocessing-batch.onrender.com/api/v1/batch/run';
  private statusUrl = 'https://smart-reprocessing-batch.onrender.com/api/v1/batch/status';
  private reloadUrl = 'https://smart-reprocessing-batch.onrender.com/api/v1/batch/reload';

  constructor(private http: HttpClient) { }

  runBatch(): Observable<string> {
    return this.http.post(this.apiUrl, {}, { responseType: 'text' });
  }

  getBatchStatus(): Observable<any> {
    return this.http.get(this.statusUrl);
  }

  reloadData(): Observable<string> {
    return this.http.post(this.reloadUrl, {}, { responseType: 'text' });
  }
}
