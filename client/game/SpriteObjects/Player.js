import Sprite from './Sprite';

export default class Player extends Sprite {
  constructor(game, spriteName, xCoord, yCoord, playerNumber) {
    super(game, spriteName, xCoord, yCoord);
    this.playerNumber = playerNumber;
    this.game = game;

    // ---- Animations
    // this.setAnimation(
    //   'move',
    //   [6, 7, 8, 9],
    //   10, true
    // );

    this.setPhysics(true);
    this.setDefault();
    this.sprite.scale.setTo(0.2);

  }

  stop() {
    this.sprite.body.velocity.setTo(0, 0);
  }

  getPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  // default update function
  updatePlayerMovement() {
  }

  // setGravity(num) {
  //   this.sprite.body.gravity.y = num;
  // }

  // setDirection(direction) {
  //   switch (direction) {
  //     case 'left':
  //       //
  //       break;

  //     case 'right':
  //       //
  //       break;

  //     case 'up':
  //       //
  //       break;

  //     case 'down':
  //       //
  //       break;

  //     default:
  //       //
  //       break;
  //   }
  // }

  // getDirection() {
  //   for (let key in this.direction) {
  //     if (this.direction[key]) {
  //       return key;
  //     }
  //   }
  //   return null;
  // }

}
