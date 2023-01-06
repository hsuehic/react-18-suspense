import React, { useState } from 'react';

import { useComments } from './data';

export default function Comments() {
  const originComments = useComments();
  const [comments, setComments] = useState(originComments);
  const [comment, setComment] = useState('');

  return (
    <>
      <div>
        <textarea
          value={comment}
          rows={4}
          cols={50}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
      </div>
      <div>
        <button
          onClick={() => {
            setComments([comment, ...comments]);
            setComment('');
          }}
        >
          Add
        </button>
      </div>
      {comments.map((comment, i) => (
        <p className='comment' key={i}>
          {comment}
        </p>
      ))}
    </>
  );
}
