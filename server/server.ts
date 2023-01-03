'use strict';
import { Request, Response, Application } from 'express';

import babelRegister = require('@babel/register');
babelRegister({
  ignore: [/[\\\/](build|server\/server|node_modules)[\\\/]/],
  presets: [['typescript'], ['react-app', { runtime: 'automatic' }]],
  plugins: ['@babel/transform-modules-commonjs'],
  extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', 'ts', 'tsx'],
});

import express from 'express';
import compress from 'compression';
import { readFileSync } from 'fs';
import path from 'path';
import render from './render';
import { JS_BUNDLE_DELAY } from './dalays';

const PORT = process.env.PORT || 4000;
const app: Application = express();

app.use((req: Request, res: Response, next: () => void) => {
  if (req.url.endsWith('.js')) {
    // Artificially delay serving JS
    // to demonstrate streaming HTML.
    setTimeout(next, JS_BUNDLE_DELAY);
  } else {
    next();
  }
});

app.use(compress());
app.get(
  '/',
  handleErrors(async function (req: Request, res: Response) {
    await waitForWebpack();
    render(req.url, res);
  })
);
app.use(express.static('build'));
app.use(express.static('public'));

app
  .listen(PORT, () => {
    console.log(`Listening at ${PORT}...`);
  })
  .on('error', function (error: Error & { syscall: string; code: string }) {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const isPipe = (portOrPipe: unknown) => Number.isNaN(portOrPipe);
    const bind = isPipe(PORT) ? 'Pipe ' + PORT : 'Port ' + PORT;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

function handleErrors(fn: (req: Request, res: Response) => Promise<void>) {
  return async function (
    req: Request,
    res: Response,
    next: (x?: unknown) => void
  ) {
    try {
      return await fn(req, res);
    } catch (x) {
      next(x);
    }
  };
}

async function waitForWebpack() {
  while (true) {
    try {
      readFileSync(path.resolve(__dirname, '../build/main.js'));
      return;
    } catch (err) {
      console.log(
        'Could not find webpack build output. Will retry in a second...'
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
