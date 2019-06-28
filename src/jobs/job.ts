export interface IJobState {
    canceled: boolean | number;
    cell_id?: string;
    child_jobs: Array<string>;
    creation_time: number;
    error?: IJobError;
    exec_start_time: number;
    finish_time: number;
    finished: boolean | number;
    job_id: string;
    job_state: string;
    run_id?: string;
    status: IJobStatus;
}

interface IJobError {
    code: number;
    error: string;
    message: string;
    name: string;
}

interface IJobStatus {
    0: string; // timestamp, last updated
    1: string; // job stage
    2: string; // status string
    3: number; // progress
    4: string; // timestamp, est complete
    5: boolean | number; // complete
    6: boolean | number; // error
}
