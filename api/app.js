import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
dotenv.config({path: './config/env/.env'});
import mongooseConnect from "./util/mongooseConnect.js";
import apiRouter from "./routes/index.js";
import CustomError from "./util/CustomError.js";
/*
import logger from './config/logger/logger.config'*/

mongooseConnect();
const app = express();


app.use(cors("*"));
if (process.env.MODE === 'production') app.use(morgan('dev'))
app.use(helmet())

app.use(function (req, res, next) {
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
    next()
})
app.use(express.json());
app.use(express.urlencoded());
app.use('/assets', express.static('assets'))
app.use("/api",apiRouter);



/*app.use((err, req, res, next) => {
    let customError = err;

    if (err.name === "SyntaxError" || err.name === "ValidationError") {
        customError = new CustomError(err.message, 400);
    }
    res.status(customError.status || 500).json({
        success: false,
        message: customError.message
    })
    customError.logMessage=customError.message;
    logger.error(customError);
});*/


app.set('trust proxy', true);

export default app;
