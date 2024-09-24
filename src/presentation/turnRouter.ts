import express from 'express'
import { TurnService } from '../application/turnService'

export const turnRouter = express.Router()

const turnServise = new TurnService()

interface TurnGetResponse{
    turnCount: number,
    board: number[][],
    nextDisc: number | null,
    winnerDisc: number | null
}

turnRouter.post('/api/games/latest/turns', async (req, res) => {
    const requestBody = req.body
    const turnCount = parseInt(requestBody.turnCount)
    const disc = parseInt(requestBody.move.disc)
    const x = parseInt(requestBody.move.x)
    const y = parseInt(requestBody.move.y)
    
    await turnServise.registerTurn(turnCount, disc, x, y)
    res.status(201).end()
})

turnRouter.get('/api/games/latest/turns/:turnCount', async (req, res: express.Response<TurnGetResponse>) => {
    const turnCount = parseInt(req.params.turnCount)

    const output = await turnServise.findLatestGameTurnByTurnCount(turnCount)

    return res.json(output)
})