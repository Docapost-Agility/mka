export class FolderMenu {
    constructor(title, cmd, disabled){
        this._title = title;
        this._cmd = cmd;
        this._disabled = disabled;
    }


    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get cmd() {
        return this._cmd;
    }

    set cmd(value) {
        this._cmd = value;
    }

    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = value;
    }
}