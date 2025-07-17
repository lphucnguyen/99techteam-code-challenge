import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../constants/error';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

export default function errorHandler (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    let message = process.env.NODE_ENV === 'production' ? 'An internal server error occurred.' : err.message;

    console.error(err);

    if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof ZodError) {
        statusCode = StatusCodes.BAD_REQUEST;

        const details = err.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        }));

        res.status(statusCode).json({
            details: details
        });

        return;
    }

    res.status(statusCode).json({
        message: message
    });
};