export class AnnotationsModel {
  public startX?: number;
  public startY?: number;
  public endX?: number;
  public endY?: number;


  constructor(annotationsModel: AnnotationsModel) {
    Object.assign(this, annotationsModel, {});
  }
}
