var Platformer = Platformer || {};

Platformer.Shroom = function (game_state, position, properties) {
	'use strict';
	Platformer.Prefab.call(this, game_state, position, properties);

	this.game_state.game.physics.arcade.enable(this);

	this.body.allowGravity = true;
	this.body.immovable = true;

	this.player = this.game_state.groups.players.children[0];

	this.anchor.setTo(0.5, 0.5);

	this.emitter = game.add.emitter(this.x, this.y, 1);
	this.emitter.makeParticles('blend');
	this.emitter.gravity = -1000;
	this.emitter.maxParticleSpeed = 0;
	this.emitter.minRotation = 0;
	this.emitter.maxRotation = 0;
	this.emitter.setAlpha(0, 0.5, 100);

	this.line = new Phaser.Line(this.player.x, this.player.y, this.x, this.y);
};

Platformer.Shroom.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Shroom.prototype.constructor = Platformer.Shroom;

Platformer.Shroom.prototype.update = function () {
	'use strict';
	this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
	this.line.setTo(this.player.x, this.player.y, this.x, this.y);
	if (this.line.length > 100 && this.line.length < 110) {
		this.emitter.start(true, 100, null, 1);
	}
};