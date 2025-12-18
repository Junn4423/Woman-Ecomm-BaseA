module.exports = ({ env }) => ({
  connection: {
    client: 'mongo',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 27017),
      database: env('DATABASE_NAME', 'ecommerce_cms'),
      username: env('DATABASE_USERNAME', 'admin'),
      password: env('DATABASE_PASSWORD', 'admin123456'),
      ssl: env.bool('DATABASE_SSL', false),
      authenticationDatabase: env('AUTHENTICATION_DATABASE', 'admin'),
    },
    options: {
      authenticationDatabase: env('AUTHENTICATION_DATABASE', 'admin'),
    },
  },
});
