import express from 'express'
import { GameService } from '../application/gameService'

export const gameRouter = express.Router()

const gameServise = new GameService()

gameRouter.post('/api/games', async (req, res) => {
    await gameServise.startNewGame()
    res.status(201).end()
})