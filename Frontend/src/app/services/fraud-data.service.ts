import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FraudData, FraudDataCrudeDTO, FraudDataDTO } from '../model/fraud-data.model';

@Injectable({
  providedIn: 'root'
})
export class FraudDataService {

  private baseUrl = `${environment.backendHost}/api`; // Adjust the URL if necessary

  constructor(private http: HttpClient) { }

  // Create FraudData
  createFraudData(dto: FraudDataCrudeDTO): Observable<FraudData> {
    return this.http.post<FraudData>(`${this.baseUrl}/create`, dto);
  }

  // Get All FraudData with Limit
  getAllFraudData(): Observable<FraudData[]> {
    return this.http.get<FraudData[]>(`${this.baseUrl}/all`);
  }

  // Get Limited FraudData with Pagination
  getLimitedFraudData(page: number, size: number): Observable<FraudData[]> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<FraudData[]>(`${this.baseUrl}/fraud-data`, { params });
  }

  // Get FraudData by ID
  getFraudDataById(id: number): Observable<FraudData> {
    return this.http.get<FraudData>(`${this.baseUrl}/${id}`);
  }

  // Update FraudData
  updateFraudData(id: number, dto: FraudDataCrudeDTO): Observable<FraudData> {
    return this.http.put<FraudData>(`${this.baseUrl}/update/${id}`, dto);
  }

  // Delete FraudData
  deleteFraudData(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  // Filter FraudData by isFraud
  filterByIsFraud(isFraud: number): Observable<FraudData[]> {
    const params = new HttpParams().set('isFraud', isFraud.toString());
    return this.http.get<FraudData[]>(`${this.baseUrl}/filter/isFraud`, { params });
  }

   // Predict Fraud
   predictFraud(dto: FraudDataDTO): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/predict`, dto);
  }
}
