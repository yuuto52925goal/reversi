import express from 'express'
import morgan from 'morgan'
import 'express-async-errors'
import { gameRouter } from './presentation/gameRouter'
import { turnRouter } from './presentation/turnRouter'

const PORT = 3000

const app = express()

app.use(morgan('dev'))
app.use(express.static('static', { extensions: ['html'] }))
app.use(express.json())

app.get('/api/error', (req, res) => {
    throw new Error("Error endpoint")
})

app.use(gameRouter)

app.use(turnRouter)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log('your port is avaialble')
})

function errorHandler(error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) {
    res.status(500).send({
        message: "Unexpected error occured"
    })
}

