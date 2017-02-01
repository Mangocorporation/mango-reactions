import fetchMock from 'fetch-mock';
import mangoReactions  from '../src/reactions.js';

describe('(Class) Reactions', () => {
  let options;
  let reactions;
  let callbackFunction;
  beforeEach(() => {
    callbackFunction = sinon.spy();
    options = {
        postID: 1875882335977618, //The live straming post ID (see README.md)
        access_token: 'EAACZB8FGENw8BAJFjqTOAsj9AbTgVorI1hbWpN0K64no7OfEV3XTbHuu6PhaZALlMUKBWka5ZBojdMsve4I7BeT82NIyAYxZBJGZBKNKiX6Yv2mgavqlR1tGcttvvQLeAQPZAnUl5CsIoEytEvEeVm4m5oY8l6zdOKjcccsjxDBQZDZD', //see README.md
        callback: callbackFunction
    };

    reactions = new mangoReactions(options);
  });

  it('should have a constructor', () => {
    expect(reactions).respondTo('constructor');
  });
});

describe('(Class) API Call', () => {
  let reactions;
  let options;
  let callbackFunction;

  let sandbox;
  let server;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    server = sandbox.useFakeServer();
  });

  afterEach(() => {
    sandbox.restore();
    server.restore();
  });

  it('should doRequest()', (done) => {
    callbackFunction = sinon.spy();
    options = {
        postID: 1875882335977618, //The live straming post ID (see README.md)
        access_token: 'EAACZB8FGENw8BAJFjqTOAsj9AbTgVorI1hbWpN0K64no7OfEV3XTbHuu6PhaZALlMUKBWka5ZBojdMsve4I7BeT82NIyAYxZBJGZBKNKiX6Yv2mgavqlR1tGcttvvQLeAQPZAnUl5CsIoEytEvEeVm4m5oY8l6zdOKjcccsjxDBQZDZD', //see README.md
        callback: callbackFunction,
        test: true
    };
    const dataRaw = {
       "1875882335977618": {
          "reactions_like": {
             "data": [

             ],
             "summary": {
                "total_count": 3
             }
          },
          "reactions_love": {
             "data": [

             ],
             "summary": {
                "total_count": 1
             }
          },
          "reactions_wow": {
             "data": [

             ],
             "summary": {
                "total_count": 1
             }
          },
          "reactions_haha": {
             "data": [

             ],
             "summary": {
                "total_count": 2
             }
          },
          "reactions_sad": {
             "data": [

             ],
             "summary": {
                "total_count": 3
             }
          },
          "reactions_angry": {
             "data": [

             ],
             "summary": {
                "total_count": 2
             }
          },
          "id": "1875882335977618"
       }
    };

    reactions = new mangoReactions(options);

    reactions.doRequest().then(() => {
      expect(dataRaw).to.eql(dataRaw);
    }).then(done, done);

    setTimeout(() => server.respond([200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(dataRaw)]), 0);

  })

})
