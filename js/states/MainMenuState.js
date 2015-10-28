var Phaser = Phaser || {};
var Platformer = Platformer || {};

var icon;
var current_y;
var current_x;

var xshift;
var yshift;

var sound;
var music;

var soundToggle = true;
var musicToggle = true;

// Array with all menu options
var menuOptions = [];

// Index of the selected menu option
var selected = 0;

// Keeps track of arrow keys, making sure multiple input requires repressing the key
var flipable = true;

Platformer.MainMenuState = function () {
	'use strict';
	Phaser.State.call(this);
};

Platformer.prototype = Object.create(Phaser.State.prototype);
Platformer.prototype.constructor = Platformer.MainMenuState;

Platformer.MainMenuState.prototype.init = function (level_file) {
	'use strict';
	// Set window
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;

	// this.menuOptions = [];
	// this.selected = 0;
	// this.flipable = true;
};

Platformer.MainMenuState.prototype.preload = function () {
	'use strict';
	// Menu items
	game.load.image('start', 'assets/images/start.png');
	game.load.image('load', 'assets/images/load.png');
	game.load.image('options', 'assets/images/options.png');
	game.load.image('music', 'assets/images/music.png');
	game.load.image('sound', 'assets/images/sound.png');
	game.load.image('nomusic', 'assets/images/nomusic.png');
	game.load.image('nosound', 'assets/images/nosound.png');
	game.load.image('level1', 'assets/images/level1_opt.png');
	game.load.image('level2', 'assets/images/level2_opt.png');
	game.load.image('level3', 'assets/images/level3_opt.png');
	game.load.image('level4', 'assets/images/level4_opt.png');

	// Misc menu items
	game.load.image('background', 'assets/images/background.png');
	game.load.image('logo', 'assets/images/BabyLONEian.png');
	game.load.image('icon', 'assets/images/icon.png');

	// Sounds
	game.load.audio('background', 'assets/sounds/background.mp3');
	game.load.audio('levelmusic', 'assets/sounds/levelmusic.mp3');
	game.load.audio('select', 'assets/sounds/99/menuSelect.mp3');
	game.load.audio('bounce', 'assets/sounds/99/bounce.mp3');
	game.load.audio('kill', 'assets/sounds/99/monsterKill.mp3');
	game.load.audio('death', 'assets/sounds/99/death.mp3');
	game.load.audio('applause', 'assets/sounds/applause.wav');

	game.load.image('blend', 'assets/images/flare_0.png');
	
	// Pause menu
	game.load.image('pause', 'assets/images/UI/pause.png');
	game.load.image('menu', 'assets/images/buttons-90x90.png', 270, 180);
};

Platformer.MainMenuState.prototype.create = function () {
	'use strict';
	var background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
    background.anchor.setTo(0.5, 0.5);

    var logo = game.add.sprite(game.world.centerX, 75, 'logo');
    logo.anchor.setTo(0.5, 0.5);

    menuOptions.push(this.game.add.image(150, 175, 'start'));
    menuOptions.push(this.game.add.image(150, 225, 'load'));
    menuOptions.push(this.game.add.image(150, 275, 'options'));

    icon = game.add.sprite(100, 195, 'icon');
    icon.anchor.setTo(0.5, 0.5);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    music = game.add.audio('background');
    music.play('', 0, 0.5, true);

    sound = game.add.audio('select', 0.03);

    this.select(0);
};

Platformer.MainMenuState.prototype.update = function () {
	'use strict';
	current_x = icon.x;
	current_y = icon.y;
	if (flipable) {
		if (this.cursors.up.isDown && selected > 0 && selected !== 3) {
			if(soundToggle) {
				sound.play();
			}
			if (selected <= 2 && menuOptions.length > 2) {
				this.stopShow();
			}
			this.move('up');
			selected -= 1;
			this.select(selected);
			this.unselect(selected+1);
			flipable = false;
		} else if (this.cursors.down.isDown && selected < menuOptions.length - 1 && selected !== 2) {
			if (soundToggle) {
				sound.play();
			}
			if (selected <= 2 && menuOptions.length > 2) {
				this.stopShow();
			}
			this.move('down');
			selected += 1;
			this.select(selected);
			this.unselect(selected-1);
			flipable = false;
		} else if (this.cursors.left.isDown && selected > 2) {
			if (soundToggle) {
				sound.play();
			}
			this.move('left');
			var oldSelected = selected;
			if (menuOptions.length === 5) {
				selected = 2;
				this.select(selected);
				this.unselect(oldSelected);
				this.stopShow();
			} else if (menuOptions.length === 7) {
				selected = 1;
				this.select(selected);
				this.unselect(oldSelected);
				this.stopShow();
			}
			flipable = false;
		} else if (this.cursors.right.isDown && (selected === 1 || selected === 2) && menuOptions[3]) {
			if (soundToggle) {
				sound.play();
			}
			this.move('right');
			var oldSelected = selected;
			selected = 3;
			this.select(selected);
			this.unselect(oldSelected);
			flipable = false;
		}
	} else {
		if (this.cursors.up.isUp && this.cursors.down.isUp && this.cursors.left.isUp && this.cursors.right.isUp) {
			flipable = true;
		}
	}
}

// Detects enter click and executes the correct function depending on the currently selected item
document.onkeydown = function (e) {
	e = e || window.event;
	var callbackContext = Phaser.GAMES[0].state.callbackContext;
	if(e.keyCode === 13) {
		switch (selected) {
		case 0:
			callbackContext.launchGame(1);
			break;
		case 1:
			callbackContext.toggleLevels();
			callbackContext.move('right');
			oldSelected = selected;
			selected = 3;
			callbackContext.unselect(oldSelected);
			callbackContext.select(selected);
			break;
		case 2:
			callbackContext.toggleOptions();
			callbackContext.move('right');
			oldSelected = selected;
			selected = 3;
			callbackContext.unselect(oldSelected);
			callbackContext.select(selected);
			break;
		case 3:
			if (menuOptions.length === 5) {
				toggleSound();
			} else if (menuOptions.length === 7) {
				callbackContext.launchGame(1);
			}
			break;
		case 4:
			if (menuOptions.length === 5) {
				toggleMusic();
			} else if (menuOptions.length === 7) {
				callbackContext.launchGame(2);
			}
			break;
		case 5:
			callbackContext.launchGame(3);
			break;
		case 6:
			callbackContext.launchGame(4);
			break;
		default:
			break;
		}
	}
}

Platformer.MainMenuState.prototype.move = function (direction) {
	switch (direction) {
	case 'up':
		xshift = 0;
		yshift = -50;
		break;
	case 'down':
		xshift = 0;
		yshift = 50;
		break;
	case 'left':
		xshift = -150;
		if (selected === 3 && menuOptions.length === 7) {
			yshift = 75;
		} else if ((selected === 4 && menuOptions.length === 7) || (selected === 3 && menuOptions.length === 5)) {
			yshift = 25;
		} else if ((selected === 5 && menuOptions.length === 7) || (selected === 4 && menuOptions.length === 5)) {
			yshift = -25;
		} else if (selected === 6 && menuOptions.length === 7) {
			yshift = -75;
		}
		break;
	case 'right':
		xshift = 150;
		if (selected === 1) {
			yshift = -75;
		} else if (selected === 2) {
			yshift = -25;
		}
		break;
	default:
		break;
	}
	game.add.tween(icon).to( { x: current_x + xshift, y: current_y + yshift }, 50, "Linear", true);	
}

Platformer.MainMenuState.prototype.select = function (index) {
	game.add.tween(menuOptions[index]).to( { alpha: 0.5 }, 50, "Linear", true);
}

Platformer.MainMenuState.prototype.unselect = function (index) {
	game.add.tween(menuOptions[index]).to( { alpha: 1.0 }, 50, "Linear", true);
}

// Toggles level menu
Platformer.MainMenuState.prototype.toggleLevels = function () {
	if (!this.isShown('levels')) {
		this.show('levels');
	} else {
		this.stopShow();
	}
}

// Toggles options
Platformer.MainMenuState.prototype.toggleOptions = function () {
	if (!this.isShown('options')) {
		this.show('options');
	} else if (this.isShown('options')) {
		this.stopShow();
	}
}

function toggleSound () {
	soundToggle = !soundToggle;
	if (game.state.current === "MainMenuState") {
		if (soundToggle) {
			menuOptions[3].loadTexture('sound');
		} else {
			menuOptions[3].loadTexture('nosound');
		}
	}
}

function toggleMusic () {
	musicToggle = !musicToggle;
	if (game.state.current === "MainMenuState") {
		if (musicToggle) {
			menuOptions[4].loadTexture('music');
		} else {
			menuOptions[4].loadTexture('nomusic');
		}
	}
	if (musicToggle) {
		music.play('', 0, 0.5, true);
	} else {
		music.stop();
	}
}

// Throws the game into boot state for given level
Platformer.MainMenuState.prototype.launchGame = function (level) {
	this.game.state.start("BootState", true, false, 'assets/levels/level' + level + '.json');
	music.stop();
	music = this.game.add.audio('levelmusic');
	if (musicToggle) {
		music.play();
	}
}

// Decides if the type is shown or not
Platformer.MainMenuState.prototype.isShown = function (type) {
	if (type === 'levels') {
		if (menuOptions.length === 7) {
			return true;
		}
		return false;
	} 
	if (type === 'options') {
		if (menuOptions.length === 5) {
			return true;
		}
		return false;
	}
	// Faulty type
	return null;
}

// Shows the type
Platformer.MainMenuState.prototype.show = function (type) {
	if (type === 'levels') {
		menuOptions.push(this.game.add.image(300, 150, 'level1'));
		menuOptions.push(this.game.add.image(300, 200, 'level2'));
		menuOptions.push(this.game.add.image(300, 250, 'level3'));
		menuOptions.push(this.game.add.image(300, 300, 'level4'));
	}
	if (type === 'options') {
		if (soundToggle) {
			menuOptions.push(this.game.add.image(300, 250, 'sound'));
		} else {
			menuOptions.push(this.game.add.image(300, 250, 'nosound'));
		}
		if (musicToggle) {
			menuOptions.push(this.game.add.image(300, 300, 'music'));
		} else {
			menuOptions.push(this.game.add.image(300, 300, 'nomusic'));
		}
	}
	
}

// Unshows extra options
Platformer.MainMenuState.prototype.stopShow = function () {
	for (var i = 3; i < menuOptions.length; i++) {
		menuOptions[i].kill();
	}
	menuOptions.splice(3, menuOptions.length);
}


