import type { ReactNode } from "react";

/**
 * Renders the plain-text bodies the admin writes (articles, policies, vaccine sections):
 * blank line = new paragraph, `## ` = sub-heading, lines starting with `- ` = bullet list.
 * Text is rendered as text, never as HTML.
 */
export function RichText({ text, headingLevel = 3 }: { text: string; headingLevel?: 2 | 3 | 4 }) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  const blocks: ReactNode[] = [];
  text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .forEach((block, index) => {
      const lines = block.split("\n");
      const parts: string[][] = [];
      // A block may start with "## Heading" and continue with list items or text.
      let current: string[] = [];
      for (const line of lines) {
        if (line.startsWith("## ")) {
          if (current.length) parts.push(current);
          parts.push([line]);
          current = [];
        } else current.push(line);
      }
      if (current.length) parts.push(current);

      parts.forEach((part, partIndex) => {
        const key = `${index}-${partIndex}`;
        if (part[0].startsWith("## ")) {
          blocks.push(
            <Heading key={key} className="mt-6 mb-2 text-lg font-bold text-brand-800 first:mt-0 desk:text-xl">
              {part[0].slice(3)}
            </Heading>,
          );
        } else if (part.every((line) => line.startsWith("- "))) {
          blocks.push(
            <ul key={key} className="grid list-disc gap-1.5 pl-5 marker:text-brand-bright">
              {part.map((line) => (
                <li key={line}>{line.slice(2)}</li>
              ))}
            </ul>,
          );
        } else {
          blocks.push(<p key={key}>{part.join(" ")}</p>);
        }
      });
    });
  return <div className="grid gap-3 text-[15px] leading-relaxed text-body desk:text-base">{blocks}</div>;
}
