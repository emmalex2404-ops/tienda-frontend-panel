import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Productos {
  private apiUrl = 'https://api-productos.hexamx.com.mx';

  constructor(private http: HttpClient) {}

  getHeaders(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias`);
  }

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos`);
  }

  crearProducto(producto: any, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, producto, this.getHeaders(token));
  }

  actualizarProducto(id: number, producto: any, token: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/${id}`, producto, this.getHeaders(token));
  }

  eliminarProducto(id: number, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${id}`, this.getHeaders(token));
  }
}
