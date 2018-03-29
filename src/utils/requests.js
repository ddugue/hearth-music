import { DEFAULT_HEADERS, ROOT_URL } from '../constants';

export function fetchJSON(uri) {
  return new Promise((resolve, reject) => {
    let status = 0;
    let ok;
    const payload = {
      headers: new Headers(DEFAULT_HEADERS),
    };
    const url = uri.startsWith('http') ? uri : ROOT_URL + uri;
    fetch(url, payload)
      .then((response) => {
        ok = response.ok;
        status = response.status;
        return response;
      })
      .then(res => res.text())
      .then(text => (text.length ? JSON.parse(text) : {}))
      .then((json) => {
        if (!ok) {
          reject({
            status,
            body: json,
          });
        } else {
          resolve(json);
        }
      })
      .catch((e) => {
        console.error(e);
        reject({
          status,
          error: e,
        });
      });
  });
}
