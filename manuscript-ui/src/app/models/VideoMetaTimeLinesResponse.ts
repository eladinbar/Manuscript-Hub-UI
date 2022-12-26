export interface IVideoMetaTimeLinesResponse {
    id?: string;
    timeLines?: [];
}

export class VideoMetaTimeLinesResponse implements IVideoMetaTimeLinesResponse {
    public id?: string;
    public timeLines?: any;


    constructor(videoMetaTimeLinesResponse: IVideoMetaTimeLinesResponse) {
        Object.assign(this, videoMetaTimeLinesResponse, {});
    }
}
