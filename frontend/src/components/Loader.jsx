import React from 'react';

export default function Loader({ full }) {
  return (
    <div className={full ? 'flex min-h-[60vh] items-center justify-center' : 'flex items-center justify-center py-10'}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-ink/10 border-t-brand" />
    </div>
  );
}
