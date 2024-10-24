import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';

ConfigModule.forRoot(); 
const config = {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/migrations/*{.ts,.js}"],
    synchronize: false,
};



export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);