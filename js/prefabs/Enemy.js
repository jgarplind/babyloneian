var Platformer = Platformer || {};

Platformer.Enemy = function (game_state, position, properties) {
	'use strict';	
	Platformer.Prefab.call(this, game_state, position, properties);

	this.game_state.game.physics.arcade.enable(this);

	this.dangerous = true;
	this.body.immovable = true;

	this.scale.setTo(-properties.direction, 1);
	this.anchor.setTo(0.5);
};

Platformer.Enemy.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Enemy.prototype.constructor = Platformer.Enemy;

Platformer.Enemy.prototype.update = function () {
	'use strict';
	this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
};