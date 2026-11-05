import React from 'react';
import katex from 'katex';

export default function Latex({ math, block = false, className = '' }) {
  let html = '';
  try {
    html = katex.renderToString(math, {
      displayMode: block,
      throwOnError: false,
    });
  } catch (error) {
    console.error('KaTeX error:', error);
    return <span className={`font-mono text-xs ${className}`}>{math}</span>;
  }

  return (
    <span
      className={`inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
