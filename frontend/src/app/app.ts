import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface HelloResponse {
  message: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly http = inject(HttpClient);

  protected readonly message = signal('Loading…');

  constructor() {
    this.http.get<HelloResponse>('http://localhost:3000/api/hello').subscribe({
      next: (res) => this.message.set(res.message),
      error: () => this.message.set('Could not reach the Rails backend.')
    });
  }
}
