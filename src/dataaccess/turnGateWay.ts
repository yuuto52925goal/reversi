import { TurnRecord } from "./turnRecord";
import mysql from 'mysql2/promise'

export class TurnGateWay{
    async insertTurn( conn: mysql.Connection, id: number, turn: number, disc: number, date: Date): Promise<TurnRecord> {
        const turnInsertResult = await conn.execute<mysql.ResultSetHeader>(
            'insert into turns (game_id, turn_count, next_disc, end_at) values (?, ?, ?, ?)',
            [id, turn, disc, date]
        )
        const turnId = turnInsertResult[0].insertId
        return new TurnRecord(turnId, id, turn, disc, date)
    }

    async findForTurnCount(conn: mysql.Connection, gameId: number, turnCount: number): Promise<TurnRecord | undefined> {
        const turnSelectResult = await conn.execute<mysql.RowDataPacket[]>(
            'select id, game_id, turn_count, next_disc, end_at from turns where game_id = ? and turn_count = ?',
            [gameId, turnCount]
        )

        const turn = turnSelectResult[0][0]
        if (!turn){
            return undefined
        }

        return new TurnRecord(turn['id'], turn['game_id'], turn['turn_count'], turn['next_disc'], turn['end_at'])
    }
}