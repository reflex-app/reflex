export class BaseError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)

    Object.setPrototypeOf(this, new.target.prototype)
    this.name = Error.name
    this.statusCode = statusCode
    Error.captureStackTrace(this)
  }
}

export function defaultErrorHandler(err) {
  if (err instanceof Error) {
    return {
      message: `Error: (${err.message})`,
    }
  }
}
