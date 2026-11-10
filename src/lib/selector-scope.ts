// Old catalog selectors sometimes treated a body-class prefix as an exact match.
// Keep actual body classes on the wrapper; component classes belong below it.
export function normalizeRootSelectors(css: string, bodyClass: string) {
  const rootClasses = new Set(("migrated-page " + bodyClass).split(/\s+/));
  return css.replace(
    /:where\(\.migrated-page\)(\.([a-zA-Z_][\w-]*))/g,
    (selector, classSelector: string, name: string) =>
      rootClasses.has(name)
        ? selector
        : ":where(.migrated-page) " + classSelector,
  );
}
