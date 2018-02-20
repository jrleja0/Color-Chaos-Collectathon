import Player from './Player';
import { ArrowHead, ArrowBody, ArrowTail } from './index';

export default class LocalPlayer extends Player {
  constructor(game, spriteName, xCoord, yCoord, playerNumber) {
    super(game, spriteName, xCoord, yCoord, playerNumber);
    this.animation = '';

    this.arrowBody = new ArrowBody(game, 'arrowBody', 200, 200);
    this.arrowHead = new ArrowHead(game, 'arrowHead', 200, 200);
    this.arrowTail = new ArrowTail(game, 'arrowTail', 200, 200);
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
    this.arrowBody.sprite.reset(this.sprite.centerX, this.sprite.centerY);
    this.arrowHead.sprite.reset(this.sprite.centerX, this.sprite.centerY);
    this.arrowTail.sprite.reset(this.sprite.centerX, this.sprite.centerY);
  }

  launch() {
    this.aiming = false;
    this.sprite.body.moves = true;
    this.arrowBody.sprite.alpha = 0;
    this.arrowHead.sprite.alpha = 0;
    this.arrowTail.sprite.alpha = 0;
    const Xvector = (this.arrowHead.sprite.x - this.arrowTail.sprite.x) * 3;
    const Yvector = (this.arrowHead.sprite.y - this.arrowTail.sprite.y) * 3;
    this.sprite.body.velocity.setTo(Xvector, Yvector);
  }

  updatePlayerMovement() {
    // on click, the player stops in place
    if (this.game.input.activePointer.isDown) {
      this.stop();
    }
    // ------ Update Movement (Click and Drag Projectiles) -------
    this.arrowHead.sprite.rotation = this.game.physics.arcade.angleBetween(this.arrowHead.sprite, this.arrowTail.sprite);

    if (this.aiming === true) {
      //  arrowTail sprite will follow the mouse cursor
      this.arrowTail.sprite.x = this.game.input.activePointer.worldX;
      this.arrowTail.sprite.y = this.game.input.activePointer.worldY;

      this.arrowBody.sprite.alpha = 0.5;
      this.arrowHead.sprite.alpha = 1;
      this.arrowTail.sprite.alpha = 1;
      this.arrowBody.sprite.rotation = this.arrowHead.sprite.rotation - 3.14 / 2;
      // arrowBody stretches between arrowHead and arrowTail
      this.arrowBody.sprite.height = this.game.physics.arcade.distanceBetween(this.arrowHead.sprite, this.arrowTail.sprite);
      this.launchVelocity = this.arrowBody.sprite.height;
    }
  }

  isDown(keyCode){
    return this.game.input.keyboard.isDown(Phaser.Keyboard[keyCode]);
  }

}
