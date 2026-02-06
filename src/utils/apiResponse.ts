import { application, Request, Response } from "express"

type ApiResponseParams = {
    res: Response;
    data?: any;
    message: string;
    statusCode?: number;
}

export const successResponse = ({ res, data = null, message = "Success", statusCode = 200}: ApiResponseParams) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: data,
    });
}

export const errorResponse = ({ res, data = null, message = "Error", statusCode = 500 }: ApiResponseParams) => {
    return res.status(statusCode).json({
        success: false,
        message: message,
        data: data,
    });
}