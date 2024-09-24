# API architect

## Start a match

POST /api/games

## Show the board

GET /api/games/lates.turns/{turns}

response body

'''json
{
    "turnCount": 1,
    "board": [
        [0, 0, 0, 0, 0, 0, 0, 0]
        [0, 0, 0, 0, 0, 0, 0, 0]
        [0, 0, 0, 0, 0, 0, 0, 0]
        [0, 0, 0, 1, 2, 0, 0, 0]
        [0, 0, 0, 1, 1, 0, 0, 0]
        [0, 0, 0, 0, 0, 0, 0, 0]
        [0, 0, 0, 0, 0, 0, 0, 0]
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    "nextDisc": 1,
    "winnerDisc": 1
}


## Put a disk

POST /api/game/lates/turns

request

'''json
{
    "turnCount": 1,
    "move": {
        "disc": 1,
        "x": 0,
        "y": 0
    }
}

## Games History

'''json
{
    "games":[
        {
            "id": 1,
            "winnerDisc": 1,
            "startedAt": "Date"
        }
    ]
}

