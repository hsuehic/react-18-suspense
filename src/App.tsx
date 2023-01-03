import React, { Suspense, lazy } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import Html from './Html';
import Spinner from './Spinner';
import Layout from './Layout';
import NavBar from './NavBar';

const Comments = lazy(() => import('./Comment') /* webpackPrefetch: true */);
const Sidebar = lazy(() => import('./Sidebar') /* webpackPrefetch: true */);
const Post = lazy(() => import('./Post') /* webpackPrefetch: true */);

export default function App({
  assets,
}: {
  assets: { 'main.js': string; 'main.css': string };
}) {
  return (
    <Html assets={assets} title='Hello Suspense'>
      <Suspense fallback={<Spinner />}>
        <ErrorBoundary fallback={<Error />}>
          <Content />
        </ErrorBoundary>
      </Suspense>
    </Html>
  );
}

function Content() {
  return (
    <Layout>
      <NavBar />
      <aside className='sidebar'>
        <Suspense fallback={<Spinner />}>
          <Sidebar />
        </Suspense>
      </aside>
      <article className='post'>
        <Suspense fallback={<Spinner />}>
          <Post />
        </Suspense>
        <section className='comments'>
          <h2>Comments</h2>
          <Suspense fallback={<Spinner />}>
            <Comments />
          </Suspense>
        </section>
        <h2>Thanks for reading!</h2>
      </article>
    </Layout>
  );
}

function Error() {
  return (
    <div>
      <h1>Application Error</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>Error</pre>
    </div>
  );
}
