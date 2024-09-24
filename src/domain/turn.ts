import { Board } from "./board";
import { Disc } from "./disc";
import { Move } from "./move"
import { Point } from "./point";

export class Turn{
    constructor(private _gameId: number,
        private _turnCount: number,
        private _nextDisc: Disc,
        private _move: Move | undefined,
        private _board: Board,
        private _endAt: Date
    ){}

    plaveNext(disc: Disc, point: Point): Turn{
        const move = new Move(disc, point)
        const nextBorad = this._board.place(move)

        const nextDisc = disc === Disc.Dark ? Disc.Light : Disc.Dark

        return new Turn(
            this._gameId,
            this._turnCount + 1,
            nextDisc,
            move,
            nextBorad,
            new Date()
        )
    }

    get gameId (){
        return this._gameId
    }
    get turnCount(){
        return this._turnCount
    }
    get nextDisc(){
        return this._nextDisc
    }
    get endAt(){
        return this._endAt
    }
    get board(){
        return this._board
    }
}