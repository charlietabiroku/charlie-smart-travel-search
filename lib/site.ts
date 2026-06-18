const defaultSiteUrl = "https://charlie-smart-travel-search.example.com";

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl;
  return trimTrailingSlash(url);
}

export function getSiteDomainLabel() {
  try {
    return new URL(getSiteUrl()).host;
  } catch {
    return "charlie-smart-travel-search.example.com";
  }
}
