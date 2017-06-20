export class Document {
    constructor(logicalName, creatorFirstName, creatorLastName, date, id, mimeType){
        this.logicalName = logicalName;
        this.creatorFirstName = creatorFirstName;
        this.creatorLastName = creatorLastName;
        this.date = date;
        this.id = id;
        this.mimeType  = mimeType;
    }
}