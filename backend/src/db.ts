// filepath: /home/me/team-manager-app/backend/src/db.ts
import { Pool } from 'pg';



export const pool = new Pool({
  user: process.env.DB_USER || 'neondb_owner',                     // Neon username
  host: process.env.DB_HOST || 'ep-tight-sunset-a4asw5br-pooler.us-east-1.aws.neon.tech',  // Neon host
  database: process.env.DB_NAME || 'neondb',                       // Neon database name
  password: process.env.DB_PASSWORD || 'npg_CmYKl3hsd2kT',         // Neon password
  port: parseInt(process.env.DB_PORT || '5432', 10),               // Neon port (default 5432)
  ssl: { rejectUnauthorized: false }                               // Neon requires SSL; this disables cert verification (ok for dev)
});



// export const pool = new Pool({
//   user: process.env.DB_USER || 'myuser',
//   host: process.env.DB_HOST || '192.168.1.15', // IMPORTANT : YOU CAN JUST PUT host.docker.internal for windows INSTEAD OF YOUR IP ADRESS WHICH CHANGES EVERY TIME
//   database: process.env.DB_NAME || 'mydb',
//   password: process.env.DB_PASSWORD || 'mypassword',
//   port: parseInt(process.env.DB_PORT || '5432', 10),
// });