import {AnnotationCoordinatesModel} from "./AnnotationCoordinatesModel";

export class AnnotationModel {
  public id?: string;
  public userId!: string;
  public imageId!: string;
  public algorithmId!: string;
  public content!: string;
  public startX!: number;
  public startY!: number;
  public endX!: number;
  public endY!: number;


  constructor(annotationModel: AnnotationModel) {
    Object.assign(this, annotationModel, {});
  }
}
