import Link from "next/link";
import type { ComponentProps } from "react";

import { isExternalHref, isNavigable } from "@/lib/routes";

type AppLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * The one link used across the site. It picks the right element for the target:
 * - a page that is not built yet → a plain `<span>` (keeps the look, never clickable)
 * - `tel:`, `mailto:`, http(s) and `#action` → a native `<a>`; a hash must fire
 *   `hashchange`, which Next's client router does not do
 * - a built page → `next/link`
 */
export function AppLink({ href, className, children, ...props }: AppLinkProps) {
  if (!isNavigable(href)) {
    return (
      <span className={className} aria-hidden={props["aria-hidden"]} aria-disabled="true" data-pending-page="">
        {children}
      </span>
    );
  }

  if (isExternalHref(href) || href.startsWith("#")) {
    // Drop the props that only mean something to next/link.
    const { prefetch, replace, scroll, shallow, passHref, legacyBehavior, locale, onNavigate, ...anchorProps } = props;
    void [prefetch, replace, scroll, shallow, passHref, legacyBehavior, locale, onNavigate];
    const opensNewTab = href.startsWith("http");
    return (
      <a
        href={href}
        className={className}
        {...anchorProps}
        {...(opensNewTab && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}
