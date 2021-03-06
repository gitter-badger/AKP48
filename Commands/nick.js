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

function Nick() {
    //the name of the command.
    this.name = "Nick";

    //help text to show for this command.
    this.helpText = "Changes the bot's nickname on the network.";

    //usage message. only include the parameters. the command name will be automatically added.
    this.usageText = "<nickname>";

    //ways to call this command.
    this.aliases = ['nick'];

    //The power level needed to use this command.
    this.powerLevel = 9000;

    //whether or not to allow this command in a private message.
    this.allowPm = true;

    //whether or not to only allow this command if it's in a private message.
    this.isPmOnly = true;
}

Nick.prototype.execute = function(context) {
    if (context.arguments.length !== 1) {
        return false;
    }

    context.client.getIRCClient().send("NICK", context.arguments[0]);
    return true;
};

module.exports = Nick;
