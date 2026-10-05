import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Utility to parse and render text that may contain LaTeX math equations.
 * Delimiters supported:
 * - Block math: $$ ... $$ or \[ ... \]
 * - Inline math: $ ... $ or \( ... \)
 */
export function parseMathSegments(text) {
  if (!text) return [];

  const segments = [];
  // Regex to match block or inline LaTeX
  const mathRegex = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\$(?:\\\$|[^\$\n])+?\$|\\\([\s\S]+?\\\))/g;

  let lastIndex = 0;
  let match;

  while ((match = mathRegex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = mathRegex.lastIndex;

    // Plain text before the math token
    if (matchStart > lastIndex) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex, matchStart)
      });
    }

    const raw = match[0];
    let isBlock = false;
    let formula = '';

    if (raw.startsWith('$$') && raw.endsWith('$$')) {
      isBlock = true;
      formula = raw.slice(2, -2).trim();
    } else if (raw.startsWith('\\[') && raw.endsWith('\\]')) {
      isBlock = true;
      formula = raw.slice(2, -2).trim();
    } else if (raw.startsWith('\\(') && raw.endsWith('\\)')) {
      isBlock = false;
      formula = raw.slice(2, -2).trim();
    } else if (raw.startsWith('$') && raw.endsWith('$')) {
      isBlock = false;
      formula = raw.slice(1, -1).trim();
    }

    try {
      const renderedHtml = katex.renderToString(formula, {
        displayMode: isBlock,
        throwOnError: false
      });
      segments.push({
        type: isBlock ? 'block-math' : 'inline-math',
        content: formula,
        html: renderedHtml
      });
    } catch (err) {
      segments.push({
        type: 'text',
        content: raw
      });
    }

    lastIndex = matchEnd;
  }

  // Any remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(lastIndex)
    });
  }

  return segments;
}

/**
 * Component to render text with embedded LaTeX formulas.
 */
export function MathText({ text, className = '', as = 'span', style = {} }) {
  if (!text) return null;

  const segments = parseMathSegments(text);
  const Tag = as;

  return (
    <Tag className={`math-rendered-content ${className}`} style={style}>
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          // Preserve newlines in plain text parts
          const lines = seg.content.split('\n');
          return (
            <React.Fragment key={idx}>
              {lines.map((line, lIdx) => (
                <React.Fragment key={lIdx}>
                  {line}
                  {lIdx < lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        }

        // Render KaTeX HTML
        if (seg.type === 'block-math') {
          return (
            <div
              key={idx}
              className="katex-display-wrapper"
              dangerouslySetInnerHTML={{ __html: seg.html }}
            />
          );
        }

        return (
          <span
            key={idx}
            className="katex-inline-wrapper"
            dangerouslySetInnerHTML={{ __html: seg.html }}
          />
        );
      })}
    </Tag>
  );
}

/**
 * Helper to render an HTML string with math (useful for vanilla JS or string interpolations)
 */
export function renderMathToHtml(text) {
  if (!text) return '';
  const segments = parseMathSegments(text);
  return segments.map(seg => {
    if (seg.type === 'text') {
      return seg.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    }
    if (seg.type === 'block-math') {
      return `<div class="katex-display-wrapper">${seg.html}</div>`;
    }
    return `<span class="katex-inline-wrapper">${seg.html}</span>`;
  }).join('');
}
