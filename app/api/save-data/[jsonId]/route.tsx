import { NextResponse } from 'next/server';
import { findDocument, isValidId, updateDocument } from "@/app/utils/dbConnect";

export async function GET(req: Request, context: { params: { jsonId: string } }) {
    const jsonId = context.params.jsonId;
    if (!isValidId(jsonId)) {
        return NextResponse.json({ error: 'JSON not found' }, { status: 404 });
    }

    try {
        const body = await findDocument(jsonId);
        if (!body) {
            return NextResponse.json({ error: 'JSON not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, jsonId, jsonData: body.jsonData });
    } catch (error) {
        console.error('save-data GET failed', error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}

export async function PATCH(req: Request, context: { params: { jsonId: string } }) {
    const jsonId = context.params.jsonId;
    if (!isValidId(jsonId)) {
        return NextResponse.json({ error: 'JSON not found' }, { status: 404 });
    }

    let body: any;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'No JSON data received' }, { status: 400 });
    }

    try {
        const updated = await updateDocument(jsonId, body);
        if (!updated) {
            return NextResponse.json({ error: 'JSON not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, jsonId, jsonData: body.jsonData });
    } catch (error) {
        console.error('save-data PATCH failed', error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}
