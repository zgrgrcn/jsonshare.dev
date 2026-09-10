import { NextResponse } from 'next/server';
import { insertDocument } from "@/app/utils/dbConnect";

export async function POST(req: Request) {
    let body: any;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'No JSON data received' }, { status: 400 });
    }
    if (!body) {
        return NextResponse.json({ error: 'No JSON data received' }, { status: 400 });
    }

    try {
        body.version = 1;
        const _id = await insertDocument(body);
        return NextResponse.json({ _id, ...body });
    } catch (error) {
        console.error('save-data POST failed', error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}
