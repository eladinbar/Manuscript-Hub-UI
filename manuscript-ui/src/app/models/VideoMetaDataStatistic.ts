export interface IVideoMetaDataStatistic {
    video_duration?: number;
    number_of_embedding_regions?: string;
    detection_tracking_time?: any;
    refinement_time?: any;
    average_er_size?: Number;
    video_format?: string;
    id?: string;
    duration_of_valid_ers?: any;
    video_dimensions?: object;
    meta?: object;
    embedding_regions_info?: object;
    fp_tracking_time?: Number;
}

export class VideoMetaDataStatistic implements IVideoMetaDataStatistic {
    public id?: string;
    public video_duration?: number;
    public number_of_embedding_regions?: string;
    public detection_tracking_time?: any;
    public refinement_time?: any;
    public average_er_size?: Number;
    public duration_of_valid_ers?: Number;
    public video_dimensions?: object;


    constructor(videoMetaDataStatistic: IVideoMetaDataStatistic) {
        Object.assign(this, videoMetaDataStatistic, {});
    }
}
