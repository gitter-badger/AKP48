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

function Help(logger) {
    //the name of the command.
    this.name = "Help";

    //help text to show for this command.
    this.helpText = "Shows documentation for the bot.";

    //usage message. only include the parameters. the command name will be automatically added.
    this.usageText = "[command]";

    //ways to call this command.
    this.aliases = ['help', 'halp'];

    //whether or not to allow this command in a private message.
    this.allowPm = true;

    //whether or not to only allow this command if it's in a private message.
    this.isPmOnly = false;
}

Help.prototype.execute = function(context) {
    var commandText = "";
    var sendTo = "";
    if(context.arguments.length) {
        commandText = context.arguments[0];
        if(commandText.startsWith(config.getCommandDelimiter(context.getChannel(), context.getClient().uuid))) {
            commandText = commandText.substring(config.getCommandDelimiter(context.getChannel(), context.getClient().uuid).length, commandText.length);
        }
    }
    var markdown = "";
    //for each command
    context.getCommandProcessor().commands.each(function (command) {
            //to tell us whether or not to send this message.
            var send = true;

            //check permission on user
            if(command.powerLevel) {
                if(config.getPerms().powerLevelFromContext(context) > command.powerLevel) {
                    send = false;
                }

                if(config.getPerms().powerLevel(context.getUser().getHostmask(),
                   "global", context.getClient().uuid) > command.powerLevel) {
                    send = true;
                }
            }

            if(send) {
                markdown += "##" + command.name + "  \n";
                markdown += "*" + command.helpText + "*  \n";

                markdown += "**Usage:** " + config.getCommandDelimiter(context.getChannel(), context.getClient().uuid)
                 + command.aliases[0] + " " + command.usageText.replace(/</, "&lt;")
                 .replace(/>/, "&gt;").replace(/\r?\n/, " | ") + "  \n";

                if(command.aliases.length > 1) {
                    markdown += "**Aliases:** ";
                    for (var i = 0; i < command.aliases.length; i++) {
                        if(command.aliases[i] == commandText) {
                            sendTo = command.name;
                        }
                        if(i != 0) {
                            markdown += command.aliases[i] + ", ";
                        }
                    };
                    markdown = markdown.slice(0, -2);
                    markdown += "  \n";
                } else {
                    if(command.aliases[0] == commandText) {
                        sendTo = command.name;
                    }
                }
            }
    });

    var self = this;
    var cachedResponse = getClientManager().getCache().getCached(("GistMarkdown"+markdown).sha1());
    if(cachedResponse) {
        if(!context.getUser().isRealIRCUser) {
            context.getClient().say(context, cachedResponse);
        } else {
            context.client.getIRCClient().notice(context.getUser().getNick(), cachedResponse);
        }
        return true;
    }

    //create gist of response
    getClientManager().getAPI("Gist").create({
        description: "Help for " + context.getClient().getNick(),
        files: {
            "help.md": {
                "content": markdown
            }
        }
    }, function(url) {
        if(!url){return;}
        if(sendTo) {
            url += "#" + encodeURI(sendTo.toLowerCase().replace(/\s/g, "-"));
        }
        getClientManager().getAPI("Google").shorten_url(url, function(url) {
            var cacheExpire = (Date.now() / 1000 | 0) + 1576800000; //make cache expire in 50 years
            getClientManager().getCache().addToCache(("GistMarkdown"+markdown).sha1(), url, cacheExpire);
            if(!context.getUser().isRealIRCUser) {
                context.getClient().say(context, url);
            } else {
                context.client.getIRCClient().notice(context.getUser().getNick(), url);
            }
        });
    });

    return true;
};

module.exports = Help;
