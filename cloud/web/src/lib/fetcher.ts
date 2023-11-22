export const JSON_FETCHER = (url: string) =>
  fetch(url).then((res) => res.json());
