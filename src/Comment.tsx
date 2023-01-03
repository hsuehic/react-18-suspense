import React from 'react';

import { useComments } from './data';

export default function Comments() {
  const comments = useComments();

  return (
    <>
      {comments.map((comment, i) => (
        <p className='comment' key={i}>
          {comment}
        </p>
      ))}
    </>
  );
}
