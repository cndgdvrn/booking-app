class API_ERROR extends Error {
  private status: number;
  private errorCode?: string;

  constructor(message: string, status: number, errorCode?: string) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public get getStatus(): number {
    return this.status;
  }
  public get getErrorCode(): string | undefined {
    return this.errorCode;
  }
}

export default API_ERROR;
