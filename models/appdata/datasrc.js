const {DataSource} = require("typeorm");
const dotenv = require('dotenv')
dotenv.config()

const appDataSource = new DataSource(
    {
        type: "mysql",
        host: '127.0.0.1',
        port: '3306',
        username: "root",
        password: "1234",
        database: "WETHREAD_1ST"
    }
)

const initializedWell = async () => {
    try {
        appDataSource.initialize().then(
            () => {
                console.log("Initialized! Your DB is initialized via typeorm DataSource")
            }
        )
    } catch (e) {
        console.error(e)
    }
}

initializedWell()

module.exports = {appDataSource}