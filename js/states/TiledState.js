var Phaser = Phaser || {};
var Platformer = Platformer || {};

// var menu;
// var choiceLabel;

Platformer.TiledState = function () {
	'use strict';
	Phaser.State.call(this);
};

Platformer.TiledState.prototype = Object.create(Phaser.State.prototype);
Platformer.TiledState.prototype.constructor = Platformer.TiledState;

Platformer.TiledState.prototype.init = function (level_data) {
	'use strict';
	this.level_data = level_data;

	// Load some sounds
	this.jumpSound = this.game.add.audio('bounce', 0.1);
	this.killSound = this.game.add.audio('kill', 0.2);
	this.deathSound = this.game.add.audio('death');
	this.goalSound = this.game.add.audio('applause');

	// Scale window for desktop
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;

	//init physics
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
	this.game.physics.arcade.gravity.y = 1000;

	//init map and set tileset
	this.map = this.game.add.tilemap(level_data.map.key);
	for (var i = 0; this.map.tilesets[i]; i++) {
		this.map.addTilesetImage(this.map.tilesets[i].name, level_data.map.tilesets[i]);
	}

    /*
        Code for the pause menu
    */
    // P or Esc pauses game, creates menu and pause text.
    document.onkeydown = function (e) {
	e = e || window.event;
	if ((e.keyCode === 27 || e.keyCode === 80) && !game.paused) {
		game.paused = true;
		// Then add the menu
		game.menu = game.add.sprite(game.camera.x + game.width/2, game.camera.y + game.height/2, 'menu');
		game.menu.anchor.setTo(0.5, 0.5);

		// And a label to illustrate which menu item was chosen. (This is not necessary)
		game.choiceLabel = game.add.text(game.camera.x + game.width/2, game.camera.y + game.height/2 + 120, 'Game is paused', { font: '30px Arial', fill: '#fff' });
		game.choiceLabel.anchor.setTo(0.5, 0.5);
		} else if ((e.keyCode === 27 || e.keyCode === 80) && game.paused) { //unpauses
			game.menu.destroy();
			game.choiceLabel.text = 'Game unpaused';
			game.add.tween(game.choiceLabel).to( { alpha: 0 }, 1000, "Linear", true);
			game.paused = false;
		}
	};

    // Add a input listener that can help us return from being paused
    this.game.input.onDown.add(unpause, self);

    // And finally the method that handels the pause menu
    function unpause(event){
        // Only act if paused
        if (game.paused) {
            // Calculate the corners of the menu
            var x1 = game.width/2 - 270/2, x2 = game.width/2 + 270/2,
                y1 = game.height/2 - 180/2, y2 = game.height/2 + 180/2;

            // Get menu local coordinates for the click
            var x = event.x - x1,
                y = event.y - y1;

            // Calculate the choice 
            var choice = Math.floor(x / 90) + 3*Math.floor(y / 90) + 1;

            if (event.keycode === 27 || event.keycode === 80) {
            	choice = 6;
            }

            switch (choice) {
            case 1:
            	// goto main menu SUPER BUGGY
            	// game.paused = false;
            	// game.state.start("MainMenuState", true, false);
            	// this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            	// this.scale.pageAlignHorizontally = true;
            	// this.scale.pageAlignVertically = true;
            	break;
            case 2:
            	// goto prev lvl
            	if (game.state.callbackContext.level_data.level.current === 1) {
            		game.choiceLabel.text = 'No previous level';
            	} else if (game.state.callbackContext.level_data.level.current >= 2) {
            		game.paused = false;
            		game.state.start("BootState", true, false, 'assets/levels/level' + (game.state.callbackContext.level_data.level.current - 1) + '.json');
            	}
            	break;
            case 3:
            	// restarts the current level
                game.paused = false;
            	game.state.callbackContext.restart_level();
         	    game.choiceLabel.text = 'Level restarted';
            	break;
            case 4:
            	// toggles sounds
            	toggleSound();
            	if (soundToggle) {
            		game.choiceLabel.text = 'Sound unmuted'; 
            	} else {
            		game.choiceLabel.text = 'Sound muted';
            	}
            	break;
            case 5:
            	// toggles music
            	toggleMusic();
            	if (musicToggle) {
            		game.choiceLabel.text = 'Music unmuted'; 
            	} else {
            		game.choiceLabel.text = 'Music muted';
            	}
            	break;
            case 6:
            	// leaves menu
            	game.menu.destroy();
            	game.choiceLabel.text = 'Game unpaused';
            	game.add.tween(game.choiceLabel).to( { alpha: 0 }, 1000, "Linear", true);
            	game.paused = false;
            	break;
            default:
            	// leaves menu
            	game.menu.destroy();
            	game.choiceLabel.text = 'Game unpaused';
            	game.paused = false;
            	game.add.tween(game.choiceLabel).to( { alpha: 0 }, 1000, "Linear", true);
            	break;
            }                
            // game.add.tween(game.choiceLabel).to( { alpha: 0 }, 1000, "Linear", true);
        }
	}
};

Platformer.TiledState.prototype.create = function () {
	'use strict';
	var group_name,
	object_layer,
	collision_tiles = [];

	//init map layers
	this.layers = {};
	this.map.layers.forEach(function (layer) {
		this.layers[layer.name] = this.map.createLayer(layer.name);
		if (layer.properties.collision) { //collision layer
			layer.data.forEach(function (data_row) { //find tiles used in the layer
				data_row.forEach(function (tile) {
					//check if valid tile index and not already in list
					if (tile.index >= 0 && collision_tiles.indexOf(tile.index) === -1) {
						collision_tiles.push(tile.index);
					}
				}, this);
			}, this);
			this.map.setCollision(collision_tiles, true, layer.name);
		}
	}, this);
	
	//resize world to size of current layer
	this.layers[this.map.layer.name].resizeWorld();

	//create groups
	this.groups = {};
	this.level_data.groups.forEach(function (group_name) {
		this.groups[group_name] = this.game.add.group();
	}, this);

	this.prefabs = {};

	for (object_layer in this.map.objects) {
		if (this.map.objects.hasOwnProperty(object_layer)) {
			//create layer objects
			this.map.objects[object_layer].forEach(this.create_object, this);
		}
	}
};

Platformer.TiledState.prototype.create_object = function (object) {
	'use strict';
	var position,
	prefab;
	//tiled coordinates starting in bottom left
	position = {'x': object.x + (this.map.tileHeight / 2), 'y': object.y - (this.map.tileHeight / 2)};
	//create obj according to type
	switch (object.type) {
	case "player":
		prefab = new Platformer.Player(this, position, object.properties);
		break;
	case "spike_enemy":
		prefab = new Platformer.SpikeEnemy(this, position, object.properties);
		break;
	case "ground_enemy":
		prefab = new Platformer.MovingEnemy(this, position, object.properties);
		break;
	case "flying_enemy":
		prefab = new Platformer.FlyingEnemy(this, position, object.properties);
		break;
	case "goal":
		prefab = new Platformer.Goal(this, position, object.properties)
		break;
	case "ladder":
		prefab = new Platformer.Ladder(this, position, object.properties);
		break;
	case "shroom":
		prefab = new Platformer.Shroom(this, position, object.properties);
		break;
	}
	this.prefabs[object.name] = prefab;
};

// Restarts the level
Platformer.TiledState.prototype.restart_level = function () {
	this.game.state.restart(true, false, this.level_data);
};