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

function AyyActionHandler(logger) {
    //the name of the handler.
    this.name = "Ayy Action Handler";

    //whether or not to allow this handler in a private message.
    this.allowPm = true;

    //the regex used to match this handler
    this.regex = /ayy/i;

    // the amount of times we should respond with this handler, 0 is no limit
    this.limit = 1;

    //logger
    this.log = logger;
}

AyyActionHandler.prototype.execute = function(word, context) {
    context.getClient().getIRCClient().say(context.getChannel(), "ayy lmao");
};

module.exports = AyyActionHandler;