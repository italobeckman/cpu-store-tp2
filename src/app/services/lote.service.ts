import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class LoteService {
  private apiUrl = 'http://localhost:8080/lotes'; // ajuste a URL conforme necessário

  constructor(private http: HttpClient) {}

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  findById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  findByCodigo(codigo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search/${codigo}`);
  }

  create(dto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create/`, dto);
  }

  update(id: number, dto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  findEstoqueById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estoque/${id}`);
  }
}