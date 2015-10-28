var Platformer = Platformer || {};

Platformer.Ladder = function (game_state, position, properties) {
	'use strict';
	Platformer.Prefab.call(this, game_state, position, properties);

	this.game_state.game.physics.arcade.enable(this);

	this.body.allowGravity = false;
	this.body.immovable = true;
	this.body.width = 2;
	this.body.height = 1;

	this.anchor.setTo(0.5, 0);
};

Platformer.Ladder.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Ladder.prototype.constructor = Platformer.TopLadder;