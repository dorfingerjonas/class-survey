export interface FinalResult {
  question: string;
  result: Result[]
}

export interface Result {
  key: string;
  value: ResultValue
}

export interface ResultValue {
  absolute: number;
  relative: number;
}
