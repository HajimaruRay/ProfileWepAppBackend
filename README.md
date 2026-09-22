# ProfileWepAppBackend

## Database Setup

This backend connects directly to MySQL from Node.js. Configure DB_HOST,
DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, and DB_SSL in this backend's .env file
(see .env.example). Process environment variables take precedence. Run npm
start from this directory.

Aiven for MySQL usually requires TLS, so set:

```env
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
```

On Vercel, add these values in Project Settings -> Environment Variables. For
the Aiven CA certificate, use DB_SSL_CA and paste the full certificate content
with `\n` line breaks. For local development, you can use DB_SSL_CA_PATH with an
absolute path to the downloaded `ca.pem` file.

The login query expects a user table containing userId, userNameHash, and
passwordHash, with SHA-256 hexadecimal hashes for username and password.
