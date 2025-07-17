import { StatusCodes } from 'http-status-codes';

export class CustomError extends Error {
    public statusCode: StatusCodes;

    constructor(message: string, statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string = 'Resource not found') {
        super(message, StatusCodes.NOT_FOUND);
    }
}