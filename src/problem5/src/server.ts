import http from 'http';
import config from './config/config';
import app from './app';

const server = http.createServer(app);

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof config.port === 'string'
    ? 'Pipe ' + config.port
    : 'Port ' + config.port;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);

      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);

      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});