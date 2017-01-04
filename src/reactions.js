define([], function () {
    var defaults = {
        postID: '',
        access_token: '',
        refreshTime: 5,
        reactions: ['LIKE', 'LOVE', 'WOW', 'HAHA', 'SAD', 'ANGRY'],
        error: false,
        message: [],
        url: 'https://github.com/raulmangolin/Mango-Facebook-Live-Reactions'
    };

    var mangoReactions = function (options) {
        _validateOptions(options);
        if (defaults.error) {
            console.log(defaults.message);
            return {"error": defaults.error, "message": defaults.message};
        }

        _moutRequest();

        setInterval(_doRequest, defaults.refreshTime * 1000);
        _doRequest();
    };

    var _validateOptions = function (options) {
        if (!options.callback) {
            defaults.error = true;
            defaults.message.push('A callback function is required. See the documentation at ' + defaults.url);
        } else {
            defaults.callback = options.callback;
        }

        if (!options.postID) {
            defaults.error = true;
            defaults.message.push('A Facebook postID is required. See the documentation at ' + defaults.url);
        } else {
            defaults.postID = options.postID;
        }

        if (!options.access_token) {
            defaults.error = true;
            defaults.message.push('A Facebook access_token is required. See the documentation at ' + defaults.url);
        } else {
            defaults.access_token = options.access_token;
        }

        if (options.refreshTime && typeof options.refreshTime === "number" && options.refreshTime > 0) {
            defaults.refreshTime = options.refreshTime;
        }

        if (options.defaultCount && typeof options.defaultCount === "number" && options.defaultCount > 0) {
            defaults.defaultCount = options.defaultCount;
        }
    };

    var _moutRequest = function () {
        defaults.query = defaults.reactions.map(function (e) {
            var code = 'reactions_' + e.toLowerCase();
            return 'reactions.type(' + e + ').limit(0).summary(total_count).as(' + code + ')'
        }).join(',');
    };

    var _doRequest = function () {
        var url = 'https://graph.facebook.com/v2.8/?ids=' + defaults.postID + '&fields=' + defaults.query + '&access_token=' + defaults.access_token;

        var me = this;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    defaults.callback(_parseRequest(xhr.responseText))
                }
            }
        };
        xhr.onerror = function (e) {
            console.log("A error has occurred. :(")
        };
        xhr.send(null);
    };

    var _parseRequest = function (response) {
        var data = JSON.parse(response);
        var result = {
            "LIKE": data[defaults.postID].reactions_like.summary.total_count,
            "LOVE": data[defaults.postID].reactions_love.summary.total_count,
            "WOW": data[defaults.postID].reactions_sad.summary.total_count,
            "HAHA": data[defaults.postID].reactions_haha.summary.total_count,
            "SAD": data[defaults.postID].reactions_angry.summary.total_count,
            "ANGRY": data[defaults.postID].reactions_wow.summary.total_count
        };

        return result
    };

    return mangoReactions;
});