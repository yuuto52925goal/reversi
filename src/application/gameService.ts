import mysql from 'mysql2/promise'
import { GameGateway } from '../dataaccess/gameGateWay'
import { TurnGateWay } from '../dataaccess/turnGateWay'
import { SquareGateway } from '../dataaccess/squaresGateWay'
import { connectMYSQL } from '../dataaccess/connection'
import { INITIAL_BOARD, DARK } from '../application/constant'

const gameGateway = new GameGateway()
const turngateWay = new TurnGateWay()
const squareGateWay = new SquareGateway()

export class GameService{
    async startNewGame() {
        const now = new Date()
        const conn: mysql.Connection = await connectMYSQL()
        try{
            await conn.beginTransaction()
            const gameRecord = await gameGateway.insert(conn, now)
            const turnRecord = await turngateWay.insertTurn(conn, gameRecord.id, 0, DARK, now)
            await squareGateWay.insertAll(conn, turnRecord.id, INITIAL_BOARD)
            await conn.commit()
        }finally{
            await conn.end()
        }
    }
}