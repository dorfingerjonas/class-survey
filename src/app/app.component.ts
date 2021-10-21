import { Component } from '@angular/core';
import { FinalResult } from './models/model';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
  title = 'class-survey';

  results: FinalResult[];
  showResult: boolean;

  constructor(private data: DataService) {
    this.results = [];
    this.showResult = false;

    this.data.results.subscribe(value => {
      this.results = value;
    });
  }
}
