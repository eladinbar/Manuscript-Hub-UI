export interface IinfoVideoModel {
    id?: string;
    createdTime?: Date;
    updatedTime?: Date;
    inputUrl?: string;
    inputUrlTmp?: string;
    videoKey?: string;
    outputUrlTmp?: string;
    outputUrl?: string;
    indexing?: string;
}

export class InfoVideoModel implements IinfoVideoModel {
    public id?: string;
    public createdTime?: Date;
    public updatedTime?: Date;
    public inputUrl?: string;
    public inputUrlTmp?: string;
    public videoKey?: string;
    public outputUrlTmp?: string;
    public outputUrl?: string;
    public indexing?: string;


    constructor(videoModel: IinfoVideoModel) {
        Object.assign(this, videoModel, {});
    }
}
