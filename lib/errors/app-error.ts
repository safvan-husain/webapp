export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    public details?: string
  ) {
    super(code)
    this.name = 'AppError'
  }
}
