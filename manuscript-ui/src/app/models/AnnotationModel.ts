import {AnnotationCoordinatesModel} from "./AnnotationCoordinatesModel";

export class AnnotationModel {
  public id?: string;
  public documentId!: string;
  public uid!: string;
  public annotationCoordinates!: AnnotationCoordinatesModel;
  public value!: string;


  constructor(annotationModel: AnnotationModel) {
    Object.assign(this, annotationModel, {});
  }
}
