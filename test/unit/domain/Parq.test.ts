import { Parq } from '../../../src/domain/valueObjects/parq';

describe('Parq', () => {
  const sampleQuestions = ['Q1', 'Q2'];
  const sampleAnswers = ['A1', 'A2'];

  it('should create a Parq instance using the static create method', () => {
    const parq = Parq.create(sampleQuestions, sampleAnswers);
    expect(parq).toBeInstanceOf(Parq);
    expect(parq.questions).toEqual(sampleQuestions);
    expect(parq.answers).toEqual(sampleAnswers);
  });

  it('should return a copy of questions array to prevent external modification', () => {
    const parq = Parq.create(sampleQuestions, sampleAnswers);
    const questions = parq.questions;
    questions.push('New Question');
    expect(parq.questions).toEqual(sampleQuestions);
    expect(questions).not.toEqual(parq.questions);
  });

  it('should return a copy of answers array to prevent external modification', () => {
    const parq = Parq.create(sampleQuestions, sampleAnswers);
    const answers = parq.answers;
    answers.push('New Answer');
    expect(parq.answers).toEqual(sampleAnswers);
    expect(answers).not.toEqual(parq.answers);
  });

  it('should create a Parq instance from raw data using the static fromRaw method', () => {
    const rawData = {
      _questions: sampleQuestions,
      _answers: sampleAnswers,
    };
    const parq = Parq.fromRaw(rawData);
    expect(parq).toBeInstanceOf(Parq);
    expect(parq.questions).toEqual(sampleQuestions);
    expect(parq.answers).toEqual(sampleAnswers);
  });

  it('should return null or undefined when fromRaw is called with null or undefined data', () => {
    expect(Parq.fromRaw(null)).toBeNull();
    expect(Parq.fromRaw(undefined)).toBeUndefined();
  });

  it('should handle empty questions and answers arrays', () => {
    const parq = Parq.create([], []);
    expect(parq.questions).toEqual([]);
    expect(parq.answers).toEqual([]);
  });
});
