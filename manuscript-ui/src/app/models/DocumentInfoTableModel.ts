export class DocumentInfoTableModel {
    public id?: string;
    public documentId?: string;
    public createdTime?: Date;
    public updatedTime?: Date;
    public fileName?: string;
    public status?: string;



    constructor(documentTableModel: DocumentInfoTableModel) {
        Object.assign(this, documentTableModel, {});
    }
}
