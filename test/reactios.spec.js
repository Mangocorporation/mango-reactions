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
