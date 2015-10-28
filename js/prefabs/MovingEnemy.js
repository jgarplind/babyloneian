var Platformer = Platformer || {};

Platformer.MovingEnemy = function (game_state, position, properties) {
	'use strict';
	Platformer.Enemy.call(this, game_state, position, properties);

	this.walking_speed = +properties.walking_speed;
	this.walking_distance = +properties.walking_distance;

	//save x to keep track of distance walked
	this.previous_x = this.x;

	this.game_state.game.physics.arcade.enable(this);
	this.body.velocity.x = properties.direction * this.walking_speed;
};

Platformer.MovingEnemy.prototype = Object.create(Platformer.Enemy.prototype);
Platformer.MovingEnemy.prototype.constructor = Platformer.MovingEnemy;

Platformer.MovingEnemy.prototype.update = function () {
	'use strict';
	this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
	//change direc if walked max dist
	if (Math.abs(this.x - this.previous_x) > this.walking_distance) {
		this.body.velocity.x *= -1;
		this.previous_x = this.x;
		this.scale.setTo(-this.scale.x, 1);
	}
};