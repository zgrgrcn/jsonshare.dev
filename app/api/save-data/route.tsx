import { NextResponse } from 'next/server';
import connectToDatabase from "@/app/utils/dbConnect";

export async function POST(req: Request) {
    const body = await req.json();
    if (!body) {
        return NextResponse.json({ error: 'No JSON data received' });
    }
    try {
        const collection = await connectToDatabase();
        if (!collection) {
            return NextResponse.json({ error: 'Error connecting to database' });
        }

        body.version=1;
        const response = await collection.insertOne({body});
        const _id = response.insertedId;

        return NextResponse.json({ _id, ...body });
    } catch (error) {
        console.error('An error occurred:', error);
        return NextResponse.json({ error: 'An error occurred' });
    }
}
