import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'sessions.db');
const db = new sqlite3.Database(dbPath);

export async function GET() {
    return new Promise<NextResponse>((resolve) => {
        db.all("SELECT * FROM sessions ORDER BY created_at DESC", [], (err, rows) => {
            if (err) {
                resolve(NextResponse.json({ error: err.message }, { status: 500 }));
            } else {
                resolve(NextResponse.json({ sessions: rows }, { status: 200 }));
            }
        });
    });
}

export async function POST(req: Request) {
    const body = await req.json();
    const { socket_position, duration, start_temp, end_temp } = body;

    return new Promise<NextResponse>((resolve) => {
        const stmt = db.prepare("INSERT INTO sessions (socket_position, duration, start_temp, end_temp) VALUES (?, ?, ?, ?)");
        stmt.run(socket_position, duration, start_temp, end_temp, function (this: sqlite3.RunResult, err: Error | null) {
            if (err) {
                resolve(NextResponse.json({ error: err.message }, { status: 500 }));
            } else {
                resolve(NextResponse.json({ id: this.lastID, message: "Session saved" }, { status: 201 }));
            }
        });
        stmt.finalize();
    });
}
