import Player from './Player';

export default class LocalPlayer extends Player {
  constructor(game, spriteName, xCoord, yCoord, playerNumber) {
    super(game, spriteName, xCoord, yCoord, playerNumber);
    this.animation = '';
    this.controls = {
      left: {
        keys: ['LEFT'],
      },
      right: {
        keys: ['RIGHT'],
      },
      up: {
        keys: ['UP'],
      },
      down: {
        keys: ['DOWN'],
      },
    };

  }

  isDown(keyCode){
    return this.game.input.keyboard.isDown(Phaser.Keyboard[keyCode]);
  }

  updateAnimationState() {
    if (this.controls.left.keys && this.isDown(this.controls.left.keys[0])) {
      this.animation = 'left';
    } else if (this.controls.right.keys && this.isDown(this.controls.right.keys[0])) {
      this.animation = 'right';
    } else if (this.controls.up.keys && this.isDown(this.controls.up.keys[0])) {
      this.animation = 'up';
    } else if (this.controls.down.keys && this.isDown(this.controls.down.keys[0])) {
      this.animation = 'down';
    } else {
      this.animation = '';
    }
  }

  move(direction) {
    switch (direction) {
      case 'left':
        this.sprite.body.velocity.x = -500;
        // this.setDirection('left');
        // this.sprite.animations.play('move');
        break;

      case 'right':
        this.sprite.body.velocity.x = 500;
        // this.setDirection('right');
        // this.sprite.animations.play('move');
        break;

      case 'up':
        this.sprite.body.velocity.y = -500;
        // this.setDirection('up');
        // this.sprite.animations.play('move');
        break;

      case 'down':
        this.sprite.body.velocity.y = 500;
        // this.setDirection('down');
        // this.sprite.animations.play('move');
        break;

      default:
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        break;
    }
  }

}
