var Platformer = Platformer || {};

Platformer.SpikeEnemy = function (game_state, position, properties) {
	'use strict';
	Platformer.Enemy.call(this, game_state, position, properties);

	if (properties.spiky) {
		this.spiky = true;
	}

	this.dangerous = false;

	this.body.immovable = true;

};

Platformer.SpikeEnemy.prototype = Object.create(Platformer.Enemy.prototype);
Platformer.SpikeEnemy.prototype.constructor = Platformer.SpikeEnemy;