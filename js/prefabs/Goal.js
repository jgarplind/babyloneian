var Platformer = Platformer || {};

Platformer.Goal = function (game_state, position, properties) {
	'use strict';
	Platformer.Prefab.call(this, game_state, position, properties);

	this.next_level = properties.next_level;

	this.game_state.game.physics.arcade.enable(this);

	this.animations.add('opening', [1, 2, 3, 4, 3, 2, 1], 6, false);
	this.frame = 1;

	this.anchor.setTo(0.25, 0.5);
};

Platformer.Goal.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Goal.prototype.constructor = Platformer.Goal;

Platformer.Goal.prototype.update = function () {
	'use strict';
	this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
	this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.players, this.reach_goal, null, this);
};

Platformer.Goal.prototype.reach_goal = function () {
	'use strict';
	if (this.game_state.groups.players.children[0].alive) {
		this.animations.play('opening');
		//start next level when goal animation finishes
		if (this.animations.currentFrame.index === 4) {
			if (soundToggle) {
				this.game_state.goalSound.play();
			}
			this.game_state.game.state.start('BootState', true, false, this.next_level);
		}
	}
};