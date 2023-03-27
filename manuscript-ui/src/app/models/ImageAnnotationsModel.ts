import {AnnotationsModel} from "./AnnotationsModel";

export class ImageAnnotationsModel {
  public id?: string;
  public documentId?: string;
  public uid?: string;
  public annotation?: AnnotationsModel;
  public value?: string;


  constructor(imageAnnotationsModel: ImageAnnotationsModel) {
    Object.assign(this, imageAnnotationsModel, {});
  }
}
