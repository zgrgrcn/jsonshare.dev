import { NextResponse } from 'next/server';
import connectToDatabase from "@/app/utils/dbConnect";
import { ObjectId } from 'mongodb';

export async function GET(req: Request, context: { params: { jsonId: string } }) {
    const jsonId = context.params.jsonId;

    const collection = await connectToDatabase();
    if (!collection) {
        return NextResponse.json({ error: 'Error connecting to database' });
    }

    const myJson = await collection.findOne({ _id: new ObjectId(jsonId) });
    return NextResponse.json({ success: true, jsonId, jsonData: myJson.body.jsonData });
}

export async function PATCH(req: Request, context: { params: { jsonId: string } }) {
    const jsonId = context.params.jsonId;

    const collection = await connectToDatabase();
    if (!collection) {
        return NextResponse.json({ error: 'Error connecting to database' });
    }

    const body = await req.json();
    await collection.updateOne({ _id: new ObjectId(jsonId) }, { $set: { body } });
    return NextResponse.json({ success: true, jsonId, jsonData: req.body });
}