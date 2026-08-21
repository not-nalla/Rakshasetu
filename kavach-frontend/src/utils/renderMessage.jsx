import React from 'react';

export function renderMessage(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let listItems = [];
  let listType = null;

  const flushList = () => {
    if (listItems.length === 0) return;
    const tag = listType === 'ol' ? 'ol' : 'ul';
    const cls = listType === 'ol'
      ? 'list-decimal list-inside space-y-0.5 my-1.5'
      : 'list-disc list-inside space-y-0.5 my-1.5';
    elements.push(
      React.createElement(tag, { key: `list-${elements.length}`, className: cls },
        ...listItems.map((item, i) =>
          React.createElement('li', {
            key: i,
            className: 'text-sm text-slate-700 leading-relaxed',
            dangerouslySetInnerHTML: { __html: formatInline(item) }
          })
        )
      )
    );
    listItems = [];
    listType = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed === '') {
      flushList();
      continue;
    }

    const headerMatch = trimmed.match(/^(#{1,3})\s+(.*)/);
    if (headerMatch) {
      flushList();
      const level = headerMatch[1].length;
      const cls = level === 1
        ? 'text-base font-bold text-slate-900 mt-3 mb-1'
        : level === 2
          ? 'text-sm font-bold text-slate-800 mt-3 mb-1'
          : 'text-sm font-semibold text-slate-700 mt-2 mb-0.5';
      elements.push(
        React.createElement(level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3', {
          key: `h-${elements.length}`,
          className: cls,
          dangerouslySetInnerHTML: { __html: formatInline(headerMatch[2]) }
        })
      );
      continue;
    }

    const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.*)/);
    const bulletMatch = trimmed.match(/^[-*]\s+(.*)/);

    if (numberedMatch) {
      if (listType !== 'ol') flushList();
      listType = 'ol';
      listItems.push(numberedMatch[2]);
      continue;
    }

    if (bulletMatch) {
      if (listType !== 'ul') flushList();
      listType = 'ul';
      listItems.push(bulletMatch[1]);
      continue;
    }

    flushList();

    elements.push(
      React.createElement('p', {
        key: `p-${elements.length}`,
        className: 'text-sm text-slate-700 leading-relaxed',
        dangerouslySetInnerHTML: { __html: formatInline(trimmed) }
      })
    );
  }

  flushList();
  return elements;
}

function formatInline(text) {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-green-700 underline hover:text-green-900">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}
