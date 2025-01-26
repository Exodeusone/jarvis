module.exports = {
  schemaFile: './src/database/schema.ts',
  database: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      database: 'jarvis_db',
      user: 'jarvis',
      password: 'jarvis',
    },
  },
};
