const dbConnection = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'admin',
        password: 'admin',
        database: 'mariadb',
    },
    migrations: {
        tableName: 'knex_migrations',
    }
}