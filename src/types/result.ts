
export enum ResultStatus {
    OK = "ok",
    Failed = "failed"
}

export interface Result<T = unknown> {
    success: ResultStatus;
    data?: T;
    error?: string;
}