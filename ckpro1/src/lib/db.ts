import { Pool } from 'pg';

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'DB_Main',
	password: 'masterkey',
	port: 5432,
});

export default pool;