export class GameRecord {
    constructor (private _id: number, private _startedAi:Date){

    }

    get id(){
        return this._id
    }

}