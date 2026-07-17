import { Component } from '@angular/core';

import { Tools } from './tools/tools';

@Component({
  selector: 'app-root',
  imports: [Tools],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
