import { NarrativeConfig, IIconConfigData } from './config';

export interface IDataIconInfo {
    className: string;
    color: string;
}

export function getIconInfo(dataType: string) : IDataIconInfo {
    let cfg = new NarrativeConfig();
    let iconCfg = <IIconConfigData>cfg.get('icons');
    return {
        className: getIcon(dataType, iconCfg).join(' '),
        color: getIconColor(dataType, iconCfg)
    };
}

function getIcon(dataType: string, iconCfg: IIconConfigData) : string[] {
    if (dataType in iconCfg.data) {
        return iconCfg.data[dataType];
    }
    else {
        return iconCfg.data.DEFAULT;
    }
}

function getIconColor(dataType: string, iconCfg: IIconConfigData): string {
    let color = iconCfg.colorMapping[dataType];
    if (color === undefined) {
        let code = 0;
        for (let i=0; i<dataType.length; code+=dataType.charCodeAt(i++));
        color = iconCfg.colors[code % iconCfg.colors.length];
    }
    return color;
}
