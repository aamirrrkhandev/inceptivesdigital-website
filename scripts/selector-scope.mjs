export function scopeDocumentTypes(selector) {
  return selector
    .replace(/:root\b/g, ":where(.migrated-page)")
    .replace(
      /(^|[\s>+~,(])(?:html|body)(?=$|[\s>+~.#\[:),])/g,
      "$1:where(.migrated-page)",
    );
}
