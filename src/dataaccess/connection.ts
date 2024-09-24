import mysql from 'mysql2/promise'
export async function connectMYSQL(): Promise<mysql.Connection> {
    const connection = await mysql.createConnection({
        host: 'localhost',
        database: 'reversi',
        user: 'reversi',
        password: 'password'
    })
    return connection
}