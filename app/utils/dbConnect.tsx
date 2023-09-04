import {Collection, Db, MongoClient, ServerApiVersion} from "mongodb";

// @ts-ignore
const client: MongoClient = new MongoClient(process.env.DATABASE_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export default async function connectToDatabase() {
    try {
        await client.connect();
        const db: Db = client.db(process.env.DATABASE_NAME)

        // @ts-ignore
        const collection = db.collection(process.env.COLLECTION_NAME);
        return collection;
    } catch (error) {
        // Ensures that the client will close when you finish/error
        console.error('connectToDatabase error', error);
        await client.close();
    }
}
