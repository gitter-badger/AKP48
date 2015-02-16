/**
 * Copyright (C) 2015  Austin Peterson
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var config = require('../config.json');
var Google = require('../API/google');
var Steam = require('../API/steam');
var c = require('irc-colors');

function LinkHandler() {
    //the name of the handler.
    this.name = "Link Handler";

    //name of the permission needed to use this handler. All users have 'user.handler.use' by default. Banned users have 'user.handler.banned' by default.
    this.permissionName = 'user.handler.use';

    //whether or not to allow this handler in a private message.
    this.allowPm = true;

    //the regex used to match this handler
    this.regex = require("../Regex/regex-weburl");

    //YouTube video regex
    this.youTubeRegex = require("../Regex/regex-youtube");

    //Steam app regex
    this.steamAppRegex = require("../Regex/regex-steamapp");

    //Steam pkg regex
    this.steamPkgRegex = require("../Regex/regex-steampkg");

    //Google API module.
    this.google = new Google(config.google.apiKey);

    //Steam API module.
    this.steam = new Steam();
}

LinkHandler.prototype.execute = function(word, context) {
    if(this.youTubeRegex.test(word)) {
        return this.YouTubeVideo(word, context);
    }

    if(this.steamPkgRegex.test(word)) {
        return this.SteamPackage(word, context);
    }

    if(this.steamAppRegex.test(word)) {
        return this.SteamApp(word, context);
    }

    if(!/noinfo/i.test(word)) {
        //libraries to fetch and parse page.
        var request = require('request');
        var cheerio = require('cheerio');


        var self = {};
        self.word = word;
        request({
          uri: word,
        }, function(error, response, body) {
          if (!error && response.statusCode == 200) {
              var $ = cheerio.load(body);
              if($("title").html()) {
                var oS = c.pink("[Link] ");
                oS += self.word + " -> \"";
                oS += $("title").html();
                oS += "\"";
                context.getClient().getIRCClient().say(context.getChannel().getName(), oS);
              }
          }       
        });
    }
};

LinkHandler.prototype.YouTubeVideo = function(link, context) {
    var id = this.youTubeRegex.exec(link);
    var noshow = /noinfo/i.exec(link);
    if(id != null && noshow == null) {
        this.google.youtube_video_info(id[1], function(res){
            context.getClient().getIRCClient().say(context.getChannel().getName(), res);
        });
    }
};

LinkHandler.prototype.SteamPackage = function(link, context) {
    var id = this.steamPkgRegex.exec(link);
    var nohist = /nohist/i.exec(link);
    if(id != null) {
        this.steam.getPkg(id[1], function(res) {
            context.getClient().getIRCClient().say(context.getChannel().getName(), res);
        }, ((nohist != null) ? true : false));
    }
};

LinkHandler.prototype.SteamApp = function(link, context) {
    var id = this.steamAppRegex.exec(link);
    var nohist = /nohist/i.exec(link);
    if(id != null) {
        this.steam.getGame(id[1], function(res) {
            context.getClient().getIRCClient().say(context.getChannel().getName(), res);
        }, ((nohist != null) ? true : false));
    }
};

module.exports = LinkHandler;