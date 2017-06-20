export class Folder {
    constructor(logicalName, creatorFirstName, creatorLastName, id, documents){
        this._logicalName = logicalName;
        this._creatorFirstName = creatorFirstName;
        this._creatorLastName = creatorLastName;
        this._id = id;
        this._documents = documents;
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

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get documents() {
        return this._documents;
    }

    set documents(value) {
        this._documents = value;
    }
}