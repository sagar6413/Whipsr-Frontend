type LogData = unknown;

// Enhanced logging function with timestamps and context
export const log = {
    info: (context: string, message: string, data?: LogData) => {
        console.log(
            `[${new Date().toISOString()}] [TokenManager:${context}] [INFO] ${message}`,
            data || ""
        );
    },
    warn: (context: string, message: string, data?: LogData) => {
        console.warn(
            `[${new Date().toISOString()}] [TokenManager:${context}] [WARN] ${message}`,
            data || ""
        );
    },
    error: (context: string, message: string, data?: LogData) => {
        console.error(
            `[${new Date().toISOString()}] [TokenManager:${context}] [ERROR] ${message}`,
            data || ""
        );
    },
    debug: (context: string, message: string, data?: LogData) => {
        console.debug(
            `[${new Date().toISOString()}] [TokenManager:${context}] [DEBUG] ${message}`,
            data || ""
        );
    }
};