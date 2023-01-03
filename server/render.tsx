import * as React from 'react';

import { Response } from 'express';

import { renderToPipeableStream } from 'react-dom/server';

import App from '../src/App';
import { DataProvider } from '../src/data';
import { API_DELAY, ABORT_DELAY } from './dalays';

const assets = {
  'main.css': '/main.css',
  'main.js': '/main.js',
};

export default function render(url: string, res: Response) {
  res.socket &&
    res.socket.on('error', (error) => {
      console.error('Fetal', error);
    });

  let didError = false;

  const comments = createServerComments();

  const stream = renderToPipeableStream(
    <DataProvider comments={comments}>
      <App assets={assets} />
    </DataProvider>,
    {
      bootstrapScripts: [assets['main.js']],
      onShellReady() {
        res.statusCode = didError ? 500 : 200;
        res.setHeader('Content-type', 'text/html'), stream.pipe(res);
      },
      onError(x) {
        didError = true;
        console.log(x);
      },
    }
  );

  // Abandon and switch to client rendering if enough time passes.
  // Try lowering this to see the client recover.
  setTimeout(() => stream.abort(), ABORT_DELAY);
}

function createServerComments() {
  let done = false;
  let promise: Promise<void> | null = null;

  return {
    read() {
      if (done) {
        return;
      }
      if (promise) {
        throw promise;
      }

      promise = new Promise((resolve) => {
        setTimeout(() => {
          done = true;
          promise = null;
          resolve();
        }, API_DELAY);
      });

      throw promise;
    },
  };
}
