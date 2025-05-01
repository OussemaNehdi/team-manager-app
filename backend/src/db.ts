// filepath: /home/me/team-manager-app/backend/src/db.ts
import { Pool } from 'pg';

export const pool = new Pool({
  user: process.env.DB_USER || 'myuser',
  host: process.env.DB_HOST ||'192.168.1.15', // IMPORTANT : YOU CAN JUST PUT host.docker.internal INSTEAD OF YOUR IP ADRESS WHICH CHANGES EVERY TIME
  database: process.env.DB_NAME || 'mydb',
  password: process.env.DB_PASSWORD || 'mypassword',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});