import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FinalResult, Result, ResultValue } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly resultsList: FinalResult[] = [];
  private readonly resultsSubject: Subject<FinalResult[]>;

  constructor(private http: HttpClient) {
    this.resultsList = [];
    this.resultsSubject = new Subject<FinalResult[]>();

    this.init();
  }

  get results(): Observable<FinalResult[]> {
    return this.resultsSubject;
  }

  init(): void {
    this.http.get('assets/export.csv', { responseType: 'text' }).subscribe(data => {
      const lines = data.split('\n');

      if (lines.length > 0) {
        const firstLine = lines.shift()!.split(',');
        const countedNames = new Map();

        for (const line of lines) {
          const items = line.split(',');

          for (let i = 1; i < items.length; i++) {
            if (items[i] !== '""') {
              const title = firstLine[i].substring(1, firstLine[i].length - 1);
              const name = items[i].substring(1, items[i].length - 1);

              if (!countedNames.get(title)) {
                countedNames.set(title, new Map());
              }

              if (!countedNames.get(title)?.get(name)) {
                countedNames.get(title)?.set(name, 1);
              } else {
                countedNames.get(title)?.set(name, countedNames.get(title).get(name) + 1);
              }
            }
          }
        }

        const result = new Map();

        for (const title of countedNames.keys()) {
          for (const name of countedNames.get(title).keys()) {
            const strippedTitle = title.substring(0, title.length - 11);
            const weight = 4 - parseInt(title[title.length - 9]);

            if (!result.get(strippedTitle)) {
              result.set(strippedTitle, new Map());
            }

            if (!result.get(strippedTitle).get(name)) {
              result.get(strippedTitle).set(name, { absolute: countedNames.get(title).get(name) * weight });
            } else {
              result.get(strippedTitle).get(name).absolute += countedNames.get(title).get(name) * weight;
            }
          }
        }

        for (const question of result.values()) {
          let sum: number = Array.from(question.values()).reduce((v1: number, v2: any) => v1 + v2.absolute, 0) as number;

          for (const personResult of question.values()) {
            personResult.relative = personResult.absolute / sum;
          }
        }

        for (const title of result.keys()) {
          const sortedResult: Result[] = Array.from(result.get(title).keys())
            .map(k => {
              return { key: k as string, value: result.get(title).get(k) as ResultValue };
            })
            .sort((v1, v2) => v2.value.absolute - v1.value.absolute);

          this.resultsList.push({
            question: title,
            result: sortedResult
          });
        }
      }

      this.resultsSubject.next(this.resultsList);
    });
  }
}
