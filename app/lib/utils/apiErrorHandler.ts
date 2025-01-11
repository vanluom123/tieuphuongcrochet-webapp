export class ApiError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

export const handleApiError = (error: unknown, defaultMessage = 'Đã xảy ra lỗi') => {
    if (error instanceof ApiError) {
        return {
            error: true,
            message: error.message,
            statusCode: error.statusCode
        };
    }

    if (error instanceof Error) {
        return {
            error: true,
            message: error.message,
            statusCode: 500
        };
    }

    return {
        error: true,
        message: defaultMessage,
        statusCode: 500
    };
}; 