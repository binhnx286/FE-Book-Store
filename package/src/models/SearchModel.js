class SearchModel {
    constructor(term = '', type = 'name') {
      this.term = term;
      this.type = type;
    }
    
    static fromObject(obj) {
      return new SearchModel(obj.term, obj.type);
    }

    toQueryString() {
      return `?${this.type}=${this.term}`;
    }
  }
  export default SearchModel;