export interface Job {
    id: number,
    name: string,
    timestamp: Date,
    status: JobState,
    own: boolean,
    params?: string,
    message?: string
}

export enum JobState {
    RUNNING = 'running',
    SUCCESS = 'success',
    PARTIAL = 'partial',
    ERROR = 'error',
    CANCELED = 'canceled'
}
