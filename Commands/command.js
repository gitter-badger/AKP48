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

function Command(logger) {
    //the name of the command.
    this.name = "Custom Command Configuration";

    //help text to show for this command.
    this.helpText = "Used to create and manage custom commands.";

    //usage message. only include the parameters. the command name will be automatically added.
    this.usageText = "[--global] <create|add <name> <response> | delete|remove <name> | edit <name> <response>>";

    //ways to call this command.
    this.aliases = ['command', 'cmd', 'customcommand'];

    //dependencies that this module has.
    this.dependencies = [];

    //The power level needed to use this command.
    this.powerLevel = 9000;

    //whether or not to allow this command in a private message.
    this.allowPm = true;

    //whether or not to only allow this command if it's in a private message.
    this.isPmOnly = false;

    this.CCD = new (require("../lib/CCD.js"))(logger);
}

Command.prototype.execute = function(context) {
    var global = (context.arguments[0] == "--global");

    if(global) {
        context.arguments.splice(1);
    }

    switch(context.arguments[0]) {
        case "create":
        case "add":
            this.createCommand(context, global);
            break;
        case "delete":
        case "remove":
            this.removeCommand(context, global);
            break;
        case "help":
        default:
            this.help(context);
            break;
    }
    return true;
};

Command.prototype.createCommand = function (context, global) {
    var args = context.arguments.slice(1);
    var name = args[0];
    args.splice(1);
    var message = args.join(" ");

    var nick = context.getUser().getNick();

    message = message.replace(/\[setByNick\]/g, nick);

    var channel = context.getChannel();
    var server = context.getClient().uuid;

    if(global) {
        channel = server = "global";
    }

    if (!this.CCD.addCommand({name: name, msg: message, channel: channel, server: server})) {
        context.getClient().say(context, "Could not add command! Ask AKP for help.");
    } else {
        context.getClient().say(context, "Command added!");
    }
    return true;
};

Command.prototype.removeCommand = function (context, global) {
    var args = context.arguments.slice(1);
    var name = args[0];

    var channel = context.getChannel();
    var server = context.getClient().uuid;

    if(global) {
        channel = server = "global";
    }

    if (!this.CCD.removeCommand(server, channel, name)) {
        context.getClient().say(context, "Could not remove command! Ask AKP for help.");
    } else {
        context.getClient().say(context, "Command removed!");
    }
    return true;
};

Command.prototype.help = function (context) {
    var url = "https://gist.github.com/AKPWebDesign/cda34eb5e7b9b11f433a";
    //Simply return the (shortened) link to the help file.
    getClientManager().getAPI("Google").shorten_url(url, function(url) {
        if(!context.getUser().isRealIRCUser) {
            context.getClient().say(context, url);
        } else {
            context.client.getIRCClient().notice(context.getUser().getNick(), url);
        }
    });
};

module.exports = Command;
