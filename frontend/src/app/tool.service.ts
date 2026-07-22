import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { Tool } from './tool';

const STORAGE_KEY = 'woodworking-tool-inventory';

/**
 * Persists the tool inventory in the browser's localStorage. The public API
 * mirrors the old HTTP service (Observable-returning CRUD) so the component
 * did not need to change when the app moved from the Rails API to local
 * storage for static GitHub Pages hosting.
 */
@Injectable({ providedIn: 'root' })
export class ToolService {
  list(): Observable<Tool[]> {
    return of(this.ordered(this.read()));
  }

  create(tool: Tool): Observable<Tool> {
    const errors = this.validate(tool);
    if (errors.length) {
      return throwError(() => ({ error: { errors } }));
    }
    const tools = this.read();
    const nextId = tools.reduce((max, t) => Math.max(max, t.id ?? 0), 0) + 1;
    const now = new Date().toISOString();
    const created: Tool = {
      ...tool,
      id: nextId,
      quantity: Number(tool.quantity),
      created_at: now,
      updated_at: now
    };
    tools.push(created);
    try {
      this.write(tools);
    } catch (err) {
      return throwError(() => ({ error: { errors: [(err as Error).message] } }));
    }
    return of(created);
  }

  update(id: number, tool: Tool): Observable<Tool> {
    const errors = this.validate(tool);
    if (errors.length) {
      return throwError(() => ({ error: { errors } }));
    }
    const tools = this.read();
    const index = tools.findIndex((t) => t.id === id);
    if (index === -1) {
      return throwError(() => ({ error: { errors: ['Tool not found'] } }));
    }
    const updated: Tool = {
      ...tools[index],
      ...tool,
      id,
      quantity: Number(tool.quantity),
      updated_at: new Date().toISOString()
    };
    tools[index] = updated;
    try {
      this.write(tools);
    } catch (err) {
      return throwError(() => ({ error: { errors: [(err as Error).message] } }));
    }
    return of(updated);
  }

  delete(id: number): Observable<void> {
    this.write(this.read().filter((t) => t.id !== id));
    return of(void 0);
  }

  /** Returns the full inventory for download/export. */
  exportAll(): Tool[] {
    return this.ordered(this.read());
  }

  /** Replaces the entire inventory (used by import). Throws on bad data. */
  replaceAll(tools: unknown): void {
    if (!Array.isArray(tools) || !tools.every((t) => t && typeof (t as Tool).name === 'string')) {
      throw new Error('Invalid inventory data');
    }
    this.write(tools as Tool[]);
  }

  private read(): Tool[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Tool[]) : [];
    } catch {
      return [];
    }
  }

  /**
   * Persists the inventory. Throws when localStorage is full, which tool
   * photos make a realistic outcome even though they are stored as
   * thumbnails — the per-origin budget is only a few megabytes.
   */
  private write(tools: Tool[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
    } catch {
      throw new Error(
        'Browser storage is full. Remove a photo from an existing tool, or export and trim your inventory.'
      );
    }
  }

  private ordered(tools: Tool[]): Tool[] {
    return [...tools].sort(
      (a, b) =>
        (a.category || '').localeCompare(b.category || '') || a.name.localeCompare(b.name)
    );
  }

  private validate(tool: Tool): string[] {
    const errors: string[] = [];
    if (!tool.name || !tool.name.trim()) {
      errors.push("Name can't be blank");
    }
    const quantity = Number(tool.quantity);
    if (!Number.isInteger(quantity) || quantity < 0) {
      errors.push('Quantity must be a non-negative integer');
    }
    return errors;
  }
}
