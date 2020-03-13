export default class ReverMediaError extends Error {
  constructor(args) {
    super(args);

    this.name = 'Rever Media Error';
  }
}
