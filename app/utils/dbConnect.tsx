import { Pool } from "pg";

// Next.js dev modunda modulleri yeniden yukledigi icin havuzu global'de tutuyoruz,
// aksi halde her yeniden derlemede yeni bir baglanti havuzu aciliyor.
const globalForPg = global as unknown as { jsonsharePool?: Pool };

function getPool(): Pool {
    if (!globalForPg.jsonsharePool) {
        globalForPg.jsonsharePool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: 5,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
        });
    }
    return globalForPg.jsonsharePool;
}

const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidId(id: string | undefined): boolean {
    return typeof id === "string" && UUID_PATTERN.test(id);
}

export async function insertDocument(body: unknown): Promise<string> {
    const { rows } = await getPool().query<{ id: string }>(
        "INSERT INTO documents (body) VALUES ($1) RETURNING id",
        [JSON.stringify(body)],
    );
    return rows[0].id;
}

export async function findDocument(id: string): Promise<any | null> {
    const { rows } = await getPool().query<{ body: any }>(
        "SELECT body FROM documents WHERE id = $1",
        [id],
    );
    return rows.length > 0 ? rows[0].body : null;
}

export async function updateDocument(id: string, body: unknown): Promise<boolean> {
    const { rowCount } = await getPool().query(
        "UPDATE documents SET body = $1, updated_at = now() WHERE id = $2",
        [JSON.stringify(body), id],
    );
    return (rowCount ?? 0) > 0;
}

export default getPool;
