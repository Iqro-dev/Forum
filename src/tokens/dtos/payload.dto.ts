export abstract class Payload {
  readonly sub?: string;
  readonly username: string;
  readonly iat?: number;
  readonly exp?: number;
}
