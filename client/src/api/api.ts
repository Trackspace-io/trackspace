const DEFAULT_API_URL = 'http://localhost:8000';

let _apiUrl = DEFAULT_API_URL;

if (process.env.REACT_APP_API_URL) {
  _apiUrl = process.env.REACT_APP_API_URL;
}

export { _apiUrl };
