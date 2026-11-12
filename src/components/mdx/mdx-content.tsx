import React from "react";
import { slugify } from "@/lib/mdx";
import { cn } from "@/lib/utils";

export interface MDXContentProps {
  content: string;
  className?: string;
}

export function MDXContent({ content, className }: MDXContentProps) {
  // Tách nội dung thành các dòng và nhóm thành các khối
  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];

  let currentList: string[] = [];
  let listKeyCounter = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul
          key={`list-${listKeyCounter++}`}
          className="my-4 space-y-2 pl-2 text-sm sm:text-base text-muted leading-relaxed"
        >
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-accent font-bold mt-1 select-none">•</span>
              <span className="flex-1">{parseInline(item)}</span>
            </li>
          ))}
        </ul>,
      );
      currentList = [];
    }
  };

  function parseInline(text: string): React.ReactNode {
    // Tách bold **text** và inline code `code`
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    let lastIndex = 0;
    let match;
    let partIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const token = match[0];
      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={partIndex++} className="font-semibold text-text">
            {token.slice(2, -2)}
          </strong>,
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code
            key={partIndex++}
            className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-accent border border-border"
          >
            {token.slice(1, -1)}
          </code>,
        );
      } else if (token.startsWith("[") && token.includes("](")) {
        const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          parts.push(
            <a
              key={partIndex++}
              href={linkMatch[2]}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline font-medium"
            >
              {linkMatch[1]}
            </a>,
          );
        }
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trimEnd() || "";

    // List item: "- " or "* "
    if (/^\s*[-*]\s+(.*)$/.test(line)) {
      const match = line.match(/^\s*[-*]\s+(.*)$/);
      if (match && match[1]) {
        currentList.push(match[1]);
      }
      continue;
    }

    // Nếu không phải list item thì flush list cũ ra trước
    flushList();

    if (!line.trim()) {
      continue;
    }

    // Heading H2: "## Title"
    if (line.startsWith("## ")) {
      const title = line.replace(/^##\s+/, "").trim();
      const id = slugify(title);
      elements.push(
        <h2
          key={`h2-${i}`}
          id={id}
          className="scroll-mt-24 mt-12 mb-4 border-b border-border pb-3 text-xl sm:text-2xl font-bold tracking-tight text-text flex items-center justify-between group"
        >
          <span>{title}</span>
          <a
            href={`#${id}`}
            aria-label={`Liên kết đến mục ${title}`}
            className="text-muted/40 hover:text-accent font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity ml-2"
          >
            #
          </a>
        </h2>,
      );
      continue;
    }

    // Heading H3: "### Title"
    if (line.startsWith("### ")) {
      const title = line.replace(/^###\s+/, "").trim();
      const id = slugify(title);
      elements.push(
        <h3
          key={`h3-${i}`}
          id={id}
          className="scroll-mt-24 mt-8 mb-3 text-base sm:text-lg font-bold tracking-tight text-text flex items-center justify-between group"
        >
          <span>{title}</span>
          <a
            href={`#${id}`}
            aria-label={`Liên kết đến mục ${title}`}
            className="text-muted/40 hover:text-accent font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-2"
          >
            #
          </a>
        </h3>,
      );
      continue;
    }

    // Normal Paragraph
    elements.push(
      <p
        key={`p-${i}`}
        className="my-3 text-sm sm:text-base text-muted leading-relaxed"
      >
        {parseInline(line)}
      </p>,
    );
  }

  flushList();

  return (
    <div
      className={cn(
        "prose-custom max-w-none text-text leading-relaxed",
        className,
      )}
    >
      {elements}
    </div>
  );
}
