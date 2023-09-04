import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from "@/app/utils/dbConnect";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("incoming request")
    if (req.method === 'POST') {
        console.log("incoming post request")
        try {
            const collection = await connectToDatabase();

            const jsonData  = req.body ;


            await jsonData.save(); // Save the data to the database

            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Error saving data to the database' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
