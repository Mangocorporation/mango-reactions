// CREATE A CLASS WITH ALL THIS REFACTORED!
// don't forget to make copy of things like the default options before changing stuff
class mangoReactions {
  constructor(options) {
    // check defaults before copying
    this.options = this.validateOptions(options);
    this.init();
  }
  validateOptions(options) {
    const defaults = {
      postID: '',
      access_token: '',
      refreshTime: 5,
      reactions: ['LIKE', 'LOVE', 'WOW', 'HAHA', 'SAD', 'ANGRY'],
      error: false,
      message: [],
      url: 'https://github.com/raulmangolin/Mango-Facebook-Live-Reactions',
    };
    // prepare the variables;
    let error = false;
    let message = [];
    let callback;
    let postID;
    let accessToken;
    let refreshTime;
    // check if callback exists and is a function
    if (!options.callback && typeof options.callback === 'function') {
      error = true;
      message.push(`A callback function is required. See the documentation at ${defaults.url}.`);
    } else {
      callback = options.callback;
    }
    // check if postID exists
    if (!options.postID) {
      error = true;
      message.push(`A Facebook postID is required. See the documentation at ${defaults.url}.`);
    } else {
      postID = options.postID;
    }
    // check if access_token exists
    if (!options.access_token) {
      error = true;
      message.push(`A Facebook access_token is required.
        See the documentation at ${defaults.url}.`);
    } else {
      accessToken = options.access_token;
    }
    // check if refreshTime exists, if it's a number
    // and if it's greater then zero
    if (options.refreshTime &&
      typeof options.refreshTime === 'number' &&
      options.refreshTime > 0) {
      refreshTime = options.refreshTime;
    } else {
      refreshTime = defaults.refreshTime;
    }
    // if error, throw an message with the errors and break;
    if (error) {
      throw message;
    }
    // create a new object with all the info
    const result = {
      postID,
      access_token: accessToken,
      refreshTime,
      reactions: ['LIKE', 'LOVE', 'WOW', 'HAHA', 'SAD', 'ANGRY'],
      error,
      message,
      callback,
      url: 'https://github.com/raulmangolin/Mango-Facebook-Live-Reactions',
    };
    // return result
    return result;
  }
  mountRequest() {
    let result;
    if (this.cached_query) {
      result = this.cached_query;
    } else {
      // create a shallow copy of reactions to work with
      const reactions = this.options.reactions.slice();
      result = reactions.map((reaction) => {
        const code = `reactions_${reaction.toLowerCase()}`;
        return `reactions.type(${reaction}).limit(0).summary(total_count).as(${code})`;
      }).join(',');
      this.cached_query = result;
    }

    return result;
  }
  parseRequest(data) {
    // private function to get the total of reactions
    function getTotalCount(postID, reaction) {
      const r = `reactions_${reaction.toLowerCase()}`;
      const totalCount = data[postID][r].summary.total_count;
      return totalCount > 0 ? totalCount : 0;
    }

    let result = {};
    const postID = this.options.postID;
    const reactions = this.options.reactions.slice();
    reactions.map((reaction) => {
      result[reaction] = getTotalCount(postID, reaction);
      // map to loop but not change anything ;p fix later
      return reaction;
    });
    return result;
  }
  doRequest() {
    const postID = this.options.postID;
    const accessToken = this.options.access_token;
    const query = this.mountRequest();
    const callback = this.options.callback;
    const url = `https://graph.facebook.com/v2.8/?ids=${postID}&fields=${query}&access_token=${accessToken}`;
    fetch(url)
    .then((blob) => blob.json())
    .then((data) => callback(this.parseRequest(data)))
    .catch((error) => {
      throw error.message;
    });
  }
  init() {
    const refreshTime = this.options.refreshTime * 1000;
    // set on doRequest on this.interval  because you can stop later if needed
    this.interval = setInterval(this.doRequest.bind(this), refreshTime);
    // execute one first time the doRequest, the next
    // time it will be executed by setInterval
    this.doRequest();
  }
}
module.exports = mangoReactions;
export default mangoReactions;
