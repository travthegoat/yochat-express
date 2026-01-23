import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/apiResponse.js";
import { ZodError } from "zod";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof ZodError) {
        const errors: any[] = JSON.parse(err.message);
        const formattedErrors: Record<string, string[]> = {};

        errors.forEach((error) => {
            if (!formattedErrors[error.path]) {
                formattedErrors[error.path] = [];
            }

            formattedErrors[error.path].push(error.message);
        });

        return errorResponse({ res, message: "Validation Error", data: formattedErrors, statusCode: 400 });
        
    }

    console.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : "Something went wrong";
    return errorResponse({ res, message, statusCode });

}