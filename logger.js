const debug = process.env.DEBUG?.split(',') || [];
console.log(debug.length ? `Logging ${debug.join(', ')}` : 'Enable verbose logging with `DEBUG=cdn,query,headers,body npm start`');

export default function logger() {
  return (req, res, next) => {
    if (req.path.startsWith('/cdn') && !debug.includes('cdn')) {
      return next();
    }

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
    console.info(
      `[${new Date().toISOString().replace(/T/, ' ').substring(0, 19)}]`,
      req.method,
      req.path,
      Object.keys(req.query)?.length ? `[Q: ${Object.entries(req.query).map(([k, v]) => `${k}=${v}`).join(`, `)}]` : '',
      req.body ? `[B: ${debug.includes('body') ? req.body : JSON.stringify(req.body).length}]` : '',
    );
    if (Object.keys(req.query)?.length && debug.includes('query')) {
      console.info('Query:', req.query);
    }
    if (req.body && debug.includes('headers')) {
      console.info('Headers:', req.headers);
    }
    if (req.body && debug.includes('body')) {
      console.info('Body', req.body);
    }
    // console.debug(`** req[${new Date().toISOString().replace(/T/, ' ')}]`, req.debug);

    next();
  };
}
