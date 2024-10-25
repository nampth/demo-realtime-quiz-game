require("dotenv").config();
export const ConstantConfigs = {
    PROD_ENV: 'prod',
    SALT_ROUND: 10,
    JWT_EXPIRE_MINS: 30,
    JWT_REFRESH_EXPIRE_DAYS: 7,
    FACEOTP_DB: process.env.QUERYLOG_DATABASE,
    MAX_RECORDS: 100,
    BACKEND_API_PATH: process.env.BACKEND_API_PATH,
    POST_METHOD: 'POST',
    GET_METHOD: 'GET',
    DELETE_METHOD: 'DELETE',
    JWT_OPTIONS: {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    },
    MAXIMUM_EXPORT_DAYS: 8
}