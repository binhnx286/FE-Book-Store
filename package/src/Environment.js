export class Environment {
    static API_URL = process.env.REACT_APP_API_DOMAIN || 'http://localhost:3000/api';
    
    static getApiUrl(endpoint) {
      return `${this.API_URL}${endpoint}`;
    }

    static getSearchEndpoint() {
      return this.getApiUrl('/book/search');
    }

    // co the bo sung cac endpoint khac
    // static getBookEndpoint() {
    //     return this.getApiUrl('/books');
    //   }
    // static getAuthEndpoint() {
    //   return this.getApiUrl('/auth');
    // }
  }
  