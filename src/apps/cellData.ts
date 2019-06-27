import {
    ICellMetadata
} from '../cells/metadata';

import {
    IJobState
} from '../jobs/job';

export interface IAppCellMetadata extends ICellMetadata {
    appCell: IAppCellInfo;
    type: 'app';
}

interface IAppCellInfo {
    app: IAppInfo;
    exec?: IAppExecInfo;
    fsm: IAppFsm;
    output?: IAppOutput;
    params?: Map<string, any>;   // the app parameters. different for each app
    outdated: boolean;          // if true, there's a new version
    newAppName?: string;        // if outdated, the name of the new app
}

interface IAppExecInfo {
    jobState: IJobState;
    jobStateUpdated: number;    // ms since epoch when the state was last updated
    launchState: IAppLaunchState;
}

interface IAppLaunchState {
    cell_id: string;            // id of the cell that was launched
    event: string;              // name of the launch event
    event_at: string;           // timestamp
    job_id: string;             // job id that got returned
    run_id: string;             // run id from the cell that ran it
}

interface IAppInfo {
    gitCommitHash: string;      // git hash of the module/version
    id: string;                 // id of the app - module/app_id
    tag: string;                // which tag - release/beta/dev
    version: string;            // should be module version - semantic version
}

interface IAppFsm {
    currentState: {             // tracks the state of the finite state machine
        mode?: string;
        stage?: string;
    }
}

interface IAppOutput {
    byJob: Map<string, IAppOutputDetails>;  // the keys are job ids
}

interface IAppOutputDetails {
    cell: {
        id: string;             // cell id (UUID)
        created: boolean;       // whether or not the output cell has been created
    };
    createdAt: string;          // timestamp
    params: Map<string, any>;   // params fed into the output cell
}
