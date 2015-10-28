var Platformer = Platformer || {};

Platformer.Ladder = function (game_state, position, properties) {
	'use strict';
	Platformer.Prefab.call(this, game_state, position, properties);

	this.game_state.game.physics.arcade.enable(this);

	this.body.immovable = true;
	this.body.width = 2;
	this.body.height = 32*properties.height+1;

	this.anchor.setTo(0.5, 0);
};

Platformer.Ladder.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Ladder.prototype.constructor = Platformer.Ladder;

Platformer.Ladder.prototype.update = function () {
	'use strict';
	this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
};