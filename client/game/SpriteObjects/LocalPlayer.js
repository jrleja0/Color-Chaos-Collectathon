import Player from './Player';
import Arrow from './Arrow';
import Analog from './Analog';

export default class LocalPlayer extends Player {
  constructor(game, spriteName, xCoord, yCoord, playerNumber) {
    super(game, spriteName, xCoord, yCoord, playerNumber);
    this.animation = '';

    this.analog = new Analog(game, 'analog', 200, 450);
    this.arrow = new Arrow(game, 'arrow', 200, 450);
    this.aiming = false;
    this.launchVelocity = 0;

    // ------ Enable Input on Local Player -------
    this.sprite.inputEnabled = true;
    this.sprite.input.start(0, true);
    this.sprite.events.onInputDown.add(this.aim.bind(this));
    this.sprite.events.onInputUp.add(this.launch.bind(this));

  }

  aim() {
    this.aiming = true;
    this.sprite.body.moves = false;
    this.sprite.body.velocity.setTo(0, 0);
    this.arrow.sprite.reset(this.sprite.x, this.sprite.y);
    this.analog.sprite.reset(this.sprite.x, this.sprite.y);
  }

  launch() {
    this.aiming = false;
    this.sprite.body.moves = true;
    this.arrow.sprite.alpha = 0;
    this.analog.sprite.alpha = 0;
    const Xvector = (this.arrow.sprite.x - this.sprite.x) * 3;
    const Yvector = (this.arrow.sprite.y - this.sprite.y) * 3;
    this.sprite.body.velocity.setTo(Xvector, Yvector);
  }

  updatePlayerMovement() {
    // ------ Update Movement (Click and Drag Projectiles) -------
    this.arrow.sprite.rotation = this.game.physics.arcade.angleBetween(this.arrow.sprite, this.sprite);

    if (this.aiming === true) {
      //  Track the ball sprite to the mouse
      this.sprite.x = this.game.input.activePointer.worldX;
      this.sprite.y = this.game.input.activePointer.worldY;

      this.arrow.sprite.alpha = 1;
      this.analog.sprite.alpha = 0.5;
      this.analog.sprite.rotation = this.arrow.sprite.rotation - 3.14 / 2;
      this.analog.sprite.height = this.game.physics.arcade.distanceBetween(this.arrow.sprite, this.sprite);
      this.launchVelocity = this.analog.sprite.height;
    }
  }

  isDown(keyCode){
    return this.game.input.keyboard.isDown(Phaser.Keyboard[keyCode]);
  }

}
