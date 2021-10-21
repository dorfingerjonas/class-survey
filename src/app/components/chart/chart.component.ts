import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { Result } from '../../models/model';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: [ './chart.component.scss' ]
})
export class ChartComponent implements OnInit, OnChanges {

  @Input() id!: string;
  @Input() name!: string;
  @Input() result: Result[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.result) {
      setTimeout(() => {
        if (this.id) {
          new Chart(this.id, {
            type: 'pie',
            options: {
              aspectRatio: 2
            },
            data: {
              labels: this.result.map(value => value.key),
              datasets: [ {
                data: this.result.map(value => (value.value.relative * 100).toFixed(2)),
                backgroundColor: [
                  '#002065',
                  '#6aa3d8',
                  '#97daf5',
                  '#6a2d82',
                  '#cabad8',
                  '#e5008c',
                  '#facccf',
                  '#f36267',
                  '#b41e39',
                  '#f93a04',
                  '#f97810',
                  '#fdd913',
                  '#bac433',
                  '#60b146',
                  '#809e48',
                  '#009981',
                  '#94cfbb',
                  '#c8ae7c',
                  '#58595b',
                  '#bbbec2'
                ]
              } ]
            }
          });
        }
      });
    }
  }
}
