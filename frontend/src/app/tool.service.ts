import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Tool } from './tool';

const API_URL = 'http://localhost:3000/api/tools';

@Injectable({ providedIn: 'root' })
export class ToolService {
  private readonly http = inject(HttpClient);

  list(): Observable<Tool[]> {
    return this.http.get<Tool[]>(API_URL);
  }

  create(tool: Tool): Observable<Tool> {
    return this.http.post<Tool>(API_URL, { tool });
  }

  update(id: number, tool: Tool): Observable<Tool> {
    return this.http.patch<Tool>(`${API_URL}/${id}`, { tool });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
