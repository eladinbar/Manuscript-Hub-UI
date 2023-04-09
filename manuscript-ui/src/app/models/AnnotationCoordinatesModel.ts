export class AnnotationCoordinatesModel {
  public startX!: number;
  public startY!: number;
  public endX!: number;
  public endY!: number;


  constructor(annotationCoordinatesModel: AnnotationCoordinatesModel) {
    Object.assign(this, annotationCoordinatesModel, {});
  }
}
