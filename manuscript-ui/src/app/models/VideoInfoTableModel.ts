export class VideoInfoTableModel {
    public id?: string;
    public video_id?: string;
    public createdTime?: Date;
    public updatedTime?: Date;
    public video_key?: string;
    public status?: string;
    public progress?: string;
    public step?: string;
    public step_progress?: string;
    public description?: string;


    constructor(videoInfoTableModel: VideoInfoTableModel) {
        Object.assign(this, videoInfoTableModel, {});
    }
}
