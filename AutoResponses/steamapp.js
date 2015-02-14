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

var Steam = require('../API/steam');

function SteamAppHandler() {
    //the name of the handler.
    this.name = "Steam App Link Handler";

    //name of the permission needed to use this handler. All users have 'user.handler.use' by default. Banned users have 'user.handler.banned' by default.
    this.permissionName = 'user.handler.use';

    //whether or not to allow this handler in a private message.
    this.allowPm = true;

    //the regex used to match this handler
    this.regex = /(?:store\.steampowered\.com\/app\/)([0-9]+)/gi;

    //Steam API module
    this.steam = new Steam();
}

SteamAppHandler.prototype.execute = function(context) {
	//arrays for steam id finding.
    var steamIds = [];
    var result = [];
    //find the steam ids.
    while((result = this.regex.exec(context.getFullMessage())) !== null) {
        steamIds.push(result[1]);
    }

    for (var q = 0; q < Math.min(steamIds.length, 3); q++) {
        this.steam.getGame(steamIds[q], function(res) {
			context.getClient().getIRCClient().say(context.getChannel().getName(), res);
        });
    }
};

module.exports = SteamAppHandler;