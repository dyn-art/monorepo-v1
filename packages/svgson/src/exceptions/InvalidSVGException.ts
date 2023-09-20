export class InvalidSVGException extends Error {
  constructor() {
    super('Invalid SVG XML provided!');
  }
}
