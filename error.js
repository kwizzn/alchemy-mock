export const getMeta = (err, req) => ({
  statusCode: err.statusCode || err.status || 500,
  type: err.constructor.name,
  version: req.version,
  requestId: req ? req.requestId : undefined,
  stack: err.stack ? err.stack.split('\n') : undefined,
});

export const notFoundHandler = (req, res) => res.status(404).json({ message: 'NOT_FOUND' });

export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(err);
  const logger = console; // req.getLogger('error');
  const meta = getMeta(err, res.req);
  logger.error(err instanceof Error ? err.message : err, meta);
  if (!res.headersSent) {
    res.status(meta.statusCode);
  }
  const message = req.env === 'production' && meta.statusCode >= 500 ? 'Internal Server Error' : err.message;
  return res.json({ message: message || 'Internal Server Error' });
};
