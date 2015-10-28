var Phaser = Phaser || {};
var Platformer = Platformer || {};

// 4:3
var game = new Phaser.Game(512, 384, Phaser.CANVAS);

game.state.add("MainMenuState", new Platformer.MainMenuState());
game.state.add("BootState", new Platformer.BootState());
game.state.add("LoadingState", new Platformer.LoadingState());
game.state.add("GameState", new Platformer.TiledState());

game.state.start("MainMenuState", true, false);