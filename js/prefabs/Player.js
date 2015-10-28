var Platformer = Platformer || {};

Platformer.Player = function (game_state, position, properties) {
	'use strict';
	Platformer.Prefab.call(this, game_state, position, properties);

	this.boost = 0;

	this.walking_speed = +properties.walking_speed;
	this.jumping_speed = +properties.jumping_speed;
	this.climbing_speed = +properties.climbing_speed;
	this.bouncing = +properties.bouncing;
	this.jumpPossible = true;

	this.game_state.game.physics.arcade.enable(this);
	this.body.collideWorldBounds = true;

	this.animations.add('walking', [0, 1, 2, 1], 6, true);

	this.alive = true;

	this.frame = 3;

	this.anchor.setTo(0.5);

	this.cursors = this.game_state.game.input.keyboard.createCursorKeys();
	
	game.input.gamepad.start();
    this.pad1 = game.input.gamepad.pad1;

	this.game_state.camera.follow(this);
};

Platformer.Player.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Player.prototype.constructor = Platformer.Player;

Platformer.Player.prototype.update = function () {
	'use strict';
	this.collisionLogic();
	this.walkingLogic();
	this.jumpingLogic();
	this.climbingLogic();
	this.dyingLogic();
};

// Collision check
Platformer.Player.prototype.collisionLogic = function () {
	if (this.alive) {
		this.collideWorld();
		this.collideObjects();
	}
};

// Collides with map
Platformer.Player.prototype.collideWorld = function () {
	this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
	this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision2);
};

// Collides with objects
Platformer.Player.prototype.collideObjects = function () {
	this.game_state.game.physics.arcade.collide(this, this.game_state.groups.enemies, this.hit_enemy, null, this);
	this.game_state.game.physics.arcade.collide(this, this.game_state.groups.shrooms, this.hit_shroom, null, this);
};

// When colliding with enemy, one dies.
Platformer.Player.prototype.hit_enemy = function (player, enemy) {
	'use strict';
	if (this.alive) {
		if (enemy.body.touching.up) {
			if (enemy.spiky) {
				this.kill();
			} else {
				enemy.kill();
				if (soundToggle) {
					this.game_state.killSound.play();
				}
				player.bounce();
			}
		} else if (enemy.dangerous) {
			this.kill();
		}
	}
};

// Player bounce
Platformer.Player.prototype.bounce = function () {
	this.body.velocity.y = -this.bouncing * (1 + this.boost);
};

// Colliding with shroom. Player changes size.
Platformer.Player.prototype.hit_shroom = function (player, shroom) {
	'use strict';
	if (this.alive) {
		if (shroom.body.touching.up) {
			if (!player.boost) {
				player.boost += 0.55;
				player.scale.setTo(1.5, 1.5);
			} else {
				player.boost -= 0.55;
				player.scale.setTo(1, 1);
			}
			shroom.destroy();
			if (soundToggle) {
				this.game_state.killSound.play();
			}
			player.bounce();
		}
	}
};

// Detects keyboard/gamepad input and determines walking direciton
Platformer.Player.prototype.walkingLogic = function () {
	if ((this.cursors.right.isDown && !this.cursors.left.isDown) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
		this.walkRight();
	} else if ((this.cursors.left.isDown && !this.cursors.right.isDown) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
		this.walkLeft();
	} else {
		this.walkStop();
	}
};

Platformer.Player.prototype.walkRight = function () {
	this.body.velocity.x = this.walking_speed * (1 + this.boost);
	this.animations.play('walking');
	this.scale.setTo(Math.abs(this.scale.x) * (-1), Math.abs(this.scale.x));
};

Platformer.Player.prototype.walkLeft = function () {
	this.body.velocity.x = -this.walking_speed * (1 + this.boost);
	this.animations.play('walking');
	this.scale.setTo(Math.abs(this.scale.x) * 1, Math.abs(this.scale.x));
};

Platformer.Player.prototype.walkStop = function () {
	this.body.drag.x = 1000;
	this.animations.stop();
	this.frame = 3;
};

// Determines if a player should jump or not
Platformer.Player.prototype.jumpingLogic = function () {
	if ((this.cursors.up.isDown || this.pad1.isDown(0)) && this.body.blocked.down && this.jumpPossible) {
		this.jump();
		// Disallows unintended continious jumping
		this.jumpPossible = false;
	// Allows new jump if jump key released
	} else if (!this.cursors.up.isDown && !this.pad1.isDown(0)) {
		this.jumpPossible = true;
	}
};

// Player jumps
Platformer.Player.prototype.jump = function () {
	this.body.checkCollision.up = true;
	this.body.velocity.y = -this.jumping_speed * (1 + this.boost);
	if (soundToggle) {
		this.game_state.jumpSound.play();
	}
};

// Allows lively players overlapping the ladder to climb
Platformer.Player.prototype.climbingLogic = function () {
	if (this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.ladders) && this.alive) {
		this.body.checkCollision.up = false;
		if (this.cursors.up.isDown || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
			this.climbUp();
		} else if ((this.cursors.down.isDown || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) && this.body.velocity.y >= -1) {
			this.climbDown();
		} else {
			this.climbStop();
		}
	}
};

Platformer.Player.prototype.climbUp = function () {
	if (this.body.blocked.down) {
		this.game_state.jumpSound.stop();			
	}
	this.body.velocity.y = -this.climbing_speed;
};

Platformer.Player.prototype.climbDown = function () {
	this.body.velocity.y = this.climbing_speed - 32.2;
};

Platformer.Player.prototype.climbStop = function () {
	this.body.velocity.y = -16.7;
};

// Checks and handles player death
Platformer.Player.prototype.dyingLogic = function () {
	// Die if touching water
	if (this.alive && this.bottom > this.game_state.game.world.height - 32) {
		this.kill();
	}

	// Level restart when leaving window
	if (this.bottom > this.game_state.game.world.height + 32) {
		this.game_state.restart_level();
	}

	// Turn dead guy in the air, Mario style
	if (this.body.velocity.y >= -300 && !this.alive) {
		this.scale.setTo(this.scale.x, -Math.abs(this.scale.y));
	}
};

Platformer.Player.prototype.kill = function () {
	'use strict';
	this.game_state.jumpSound.stop();
	if (soundToggle) {
		this.game_state.deathSound.play();
	}
	this.body.velocity.y = -450;
	this.body.checkCollision = false;
	this.body.collideWorldBounds = false;
	this.alive = false;
};