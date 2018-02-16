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

    // ---- default controls
    this.controls = {
      left: {
        keys: null,
      },
      right: {
        keys: null
      },
      up: {
        keys: null,
      },
      down: {
        keys: null,
      }
    };

    this.direction = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    this.setPhysics(true);
    this.setDefault();
    this.sprite.scale.setTo(0.5);

  }

  stop() {
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
  }

  getPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  updateAnimationState() {
  }

  // default move
  move(direction) {
    switch (direction) {
      case 'left':
        //
        break;

      case 'right':
        //
        break;

      case 'up':
        //
        break;

      case 'down':
        //
        break;

      default:
        //
        break;
    }
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
