import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './router.js';
import 'dotenv/config';
import { notFoundHandler, errorHandler } from './error.js';

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  req.debug = {
    req: {
      method: req.method,
      path: req.path,
      headers: req.headers,
      query: req.query,
      body: req.body,
      cookies: req.cookies,
      // app: req.app,
      baseUrl: req.baseUrl,
      fresh: req.fresh,
      host: req.host,
      hostname: req.hostname,
      ip: req.ip,
      ips: req.ips,
      originalUrl: req.originalUrl,
      params: req.params,
      protocol: req.protocol,
      route: req.secure,
      signedCookies: req.signedCookies,
      stale: req.stale,
      subdomains: req.subdomains,
      xhr: req.xhr,
    },
  };
  console.log(`** req[${new Date().toISOString().replace(/T/, ' ')}]`, req.debug);
  next();
})

app.use('/', router);

app.use((req, res) => {
  res.json(req.debug);
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Alchemy mock listening on port ${port}`);
});
