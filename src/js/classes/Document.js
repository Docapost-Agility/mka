export class Document {
    constructor(logicalName, creatorFirstName, creatorLastName, date, id, mimeType) {
        this._logicalName = logicalName;
        this._creatorFirstName = creatorFirstName;
        this._creatorLastName = creatorLastName;
        this._date = date;
        this._id = id;
        this._mimeType = mimeType;
    }

    get logicalName() {
        return this._logicalName;
    }

    set logicalName(value) {
        this._logicalName = value;
    }

    get creatorFirstName() {
        return this._creatorFirstName;
    }

    set creatorFirstName(value) {
        this._creatorFirstName = value;
    }

    get creatorLastName() {
        return this._creatorLastName;
    }

    set creatorLastName(value) {
        this._creatorLastName = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get mimeType() {
        return this._mimeType;
    }

    set mimeType(value) {
        this._mimeType = value;
    }
}