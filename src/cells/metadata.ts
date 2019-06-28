export interface ICellMetadata {
    attributes: ICellAttributes;
    userSettings: ICellSettings;
    type: string;
}

export interface ICellSettings {
    showCodeInputArea: boolean;
}

export interface ICellAttributes {
    created: number;  // ms since epoch
    id: string;
    info: ICellInfo;
}

interface ICellInfo {
    label: string;
    url: string;
    lastLoaded: number;
    status: string;
    subtitle: string;
    title: string;
}
