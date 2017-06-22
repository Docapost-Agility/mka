export class FolderMenu {
    constructor(title, action, canDoAction){
        this._title = title;
        this._action = action;
        this._canDoAction = canDoAction;
    }


    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get action() {
        return this._action;
    }

    set action(value) {
        this._action = value;
    }

    get canDoAction() {
        return this._canDoAction;
    }

    set canDoAction(value) {
        this._canDoAction = value;
    }
}