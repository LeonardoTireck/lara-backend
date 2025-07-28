export class Parq {
  private _questions: string[];
  private _answers: string[];
  private constructor(questions: string[], answers: string[]) {
    this._questions = questions;
    this._answers = answers;
  }
  static create(questions: string[], answers: string[]) {
    return new Parq(questions, answers);
  }

  get questions() {
    return [...this._questions];
  }

  get answers() {
    return [...this._answers];
  }
}
