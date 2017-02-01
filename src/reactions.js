import fetch from 'isomorphic-fetch';
class mangoReactions {
  constructor({
    postID = this.mandatory(),
    access_token = this.mandatory(),
    callback = this.mandatory(),
    refreshTime = 5,
    test = false,
  }) {
    this.options = this.mergeDefault({ postID, access_token, callback, refreshTime });
    if (!test) {
      this.init();
    }
  }
  mandatory() {
    throw new Error('oops missing parameters');
  }
  mergeDefault(options) {
    // default object, for now it only has the reactions
    const def = {
      reactions: ['LIKE', 'LOVE', 'WOW', 'HAHA', 'SAD', 'ANGRY'],
    };
    // create a new object with all the info
    const result = Object.assign(def, options);
    // return result
    return result;
  }
  parseRequest(data) {
    // private function to get the total of reactions
    function getTotalCount(postID, reaction) {
      const r = `reactions_${reaction.toLowerCase()}`;
      const totalCount = data[postID][r].summary.total_count;
      return totalCount > 0 ? totalCount : 0;
    }

    const { postID } = this.options;
    // clone reactions
    const reactions = this.options.reactions.slice();
    // generate a object based on reactions array
    // with the proper count
    const result = Object.assign(...reactions.map(reaction => ({
      [reaction]: getTotalCount(postID, reaction),
    })));
    return result;
  }
  doRequest() {
    const { postID, access_token, callback } = this.options;
    const query = this.memoizedMountRequest();
    const url = `https://graph.facebook.com/v2.8/?ids=${postID}&fields=${query}&access_token=${access_token}`;
    return fetch(url)
    .then((blob) => blob.json())
    .then((data) => callback(this.parseRequest(data)))
    .catch((error) => {
      throw new Error(error.message);
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
// there's no way to make memoization on classes yet..
mangoReactions.prototype.memoizedMountRequest = (function memoization() {
  let cache;
  return function cachedMountRequest() {
    if (cache !== undefined) {
      return cache;
    }

    const reactions = this.options.reactions.slice();
    cache = reactions.map((reaction) => {
      const code = `reactions_${reaction.toLowerCase()}`;
      return `reactions.type(${reaction}).limit(0).summary(total_count).as(${code})`;
    }).join(',');
    return cache;
  };
}());

module.exports = mangoReactions;
export default mangoReactions;
