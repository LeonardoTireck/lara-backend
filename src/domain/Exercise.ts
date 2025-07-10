export class Exercise {
  constructor(
    readonly name: string,
    readonly sets: Set[],
    readonly notes: string,
    readonly restInSeconds: number,
    readonly videoUrl: string,
  ) {}
}

type Set = {
  orderNumber: number;
  reps: number;
  weight: number;
};
