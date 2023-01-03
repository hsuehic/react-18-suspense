import React, { createContext, useContext } from 'react';

interface Comments {
  read: () => void;
}
const DataContext = createContext<Comments | null>(null);

export function DataProvider({
  children,
  comments,
}: {
  children: React.ReactElement;
  comments: Comments | null;
}) {
  return (
    <DataContext.Provider value={comments}>{children}</DataContext.Provider>
  );
}

export const comments = [
  "Wait, it doesn't wait for react to load?",
  'How does this event work?',
  'I like marshmallows',
];

export function useComments() {
  const ctx = useContext(DataContext);
  if (ctx !== null) {
    ctx.read();
  }
  return comments;
}
