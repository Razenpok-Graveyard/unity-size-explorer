export class BuildEntry {
  readonly path: string;
  readonly size: number;

  constructor(path: string, size: number) {
    this.path = path;
    this.size = size;
  }
}