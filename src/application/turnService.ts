import { connectMYSQL } from '../dataaccess/connection'
import { GameGateway } from '../dataaccess/gameGateWay'
import { TurnGateWay } from '../dataaccess/turnGateWay'
import { SquareGateway } from '../dataaccess/squaresGateWay'
import { MoveGateway } from '../dataaccess/movesGateWay'
import { DARK, LIGHT } from '../application/constant'
import { Board } from '../domain/board'
import { Turn } from '../domain/turn'
import { toDisc } from '../domain/disc'
import { Point } from '../domain/point'

const gameGateway = new GameGateway()
const turngateWay = new TurnGateWay()
const squareGateWay = new SquareGateway()
const moveGateWay = new MoveGateway()

interface TurnGetResponse{
    turnCount: number,
    board: number[][],
    nextDisc: number | null,
    winnerDisc: number | null
}

export class TurnService{
    async findLatestGameTurnByTurnCount(turnCount: number): Promise<TurnGetResponse>{
        const conn = await connectMYSQL()
        try{
            const gameRecord = await gameGateway.findLatest(conn)
            if (!gameRecord){
                throw new Error("Latest game not found")
            }
            const turnRecord = await turngateWay.findForTurnCount(conn, gameRecord.id, turnCount)
            console.log(turnRecord)
            if(!turnRecord){
                throw new Error('No turn record')
            }
            const squareRecords = await squareGateWay.findForTurnId(conn, turnRecord.id)
            const board = Array.from(Array(8)).map(() => Array.from(Array(8)))
            squareRecords.forEach((s) => {
                board[s.y][s.x] = s.disc
            })
    
            return {
                turnCount,
                board,
                nextDisc: turnRecord.nextDisc,
                winnerDisc: null
            }
    
        }finally{
            conn.end()
        }
    }

    async registerTurn(turnCount: number, disc: number, x: number, y: number){
        const conn = await connectMYSQL()

    try{
        await conn.beginTransaction()
        const gameRecord = await gameGateway.findLatest(conn)
        if (!gameRecord){
            return new Error("Latest game not found")
        }
        const previousCount = turnCount - 1
        const preTurnRecord = await turngateWay.findForTurnCount(conn, gameRecord.id, previousCount)
        if(!preTurnRecord){
            return new Error('No turn record')
        }

        const squareRecords = await squareGateWay.findForTurnId(conn, preTurnRecord.id)
        const board = Array.from(Array(8)).map(() => Array.from(Array(8)))
        squareRecords.forEach((s) => {
            board[s.y][s.x] = s.disc
        })


        const previousTurn = new Turn(
            gameRecord.id,
            previousCount,
            toDisc(preTurnRecord.nextDisc),
            undefined,
            new Board(board),
            preTurnRecord.endAt
        )

        const newTurn = previousTurn.plaveNext(toDisc(disc), new Point(x, y))

        
        const turnRecord = await turngateWay.insertTurn(conn, newTurn.gameId, newTurn.turnCount, newTurn.nextDisc, newTurn.endAt)
        if(!turnRecord) new Error('No turn record')
        
        await squareGateWay.insertAll(conn, turnRecord.id, newTurn.board.discs)

        await moveGateWay.insert(conn, turnRecord.id, disc, x, y)

        await conn.commit()
    }finally{
        conn.end()
    }
    }
}