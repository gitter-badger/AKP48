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

function Ping() {
    //the name of the command.
    this.name = "Ping";

    //help text to show for this command.
    this.helpText = "Pong. If the word 'time' is included as a parameter, includes the current time in the response.";

    //usage message. only include the parameters. the command name will be automatically added.
    this.usageText = "[time]";

    //ways to call this command.
    this.aliases = ['ping'];

    //whether or not to allow this command in a private message.
    this.allowPm = true;

    //whether or not to only allow this command if it's in a private message.
    this.isPmOnly = false;
}

Ping.prototype.execute = function(context) {
    var oS = "Pong. ";
    if(context.arguments.length && context.arguments[0].toLowerCase() == "time") {
        oS += (Date.now() / 1000 | 0);
    }
    context.getClient().say(context, oS);
    return true;
};

module.exports = Ping;