/**
 * Copyright (C) 2015  Austin Peterson, Alan Hamid (feildmaster)
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

// TODO: only enable if we're in a git repo
function Git(logger) {
    //the name of the command.
    this.name = "Git";

    //help text to show for this command.
    this.helpText = "Allows controlling of the repository this bot is running off.";

    //usage message. only include the parameters. the command name will be automatically added.
    this.usageText = "checkout <branch> | fetch";

    //ways to call this command.
    this.aliases = ['git'];

    //dependencies that this module has.
    this.dependencies = [];

    //The power level needed to use this command.
    this.powerLevel = 9000;

    //whether or not to allow this command in a private message.
    this.allowPm = true;

    //whether or not to only allow this command if it's in a private message.
    this.isPmOnly = false;
}

Git.prototype.execute = function(context) {
    var args = context.getArguments();
    if (args.length < 1) {
        return false;
    }
    var message = "";

    switch (args.splice(0, 1)[0].toLowerCase()) {
        case "checkout":
            if (args.length != 1) {
                return false;
            }
            var branch = args.splice(0,1)[0];
            var nick = context.getUser().getNick();
            if (getClientManager().getAPI("Git").checkout(branch)) {
                message = "Checked out ".append(branch);
            } else {
                message = "Encountered an error while checking out ".append(branch);
            }
            break;
        case "fetch":
            if (args.length) {
                return false;
            }
            if (getClientManager().getAPI("Git").fetch()) {
                message = "Fetched head";
            } else {
                message = "Error while fetching head";
            }
        default: return false;
    }
    if (message) context.getClient().getIRCClient().notice(nick, message);

    return true;
};

module.exports = Git;
