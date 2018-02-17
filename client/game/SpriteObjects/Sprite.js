export default class Sprite {
  constructor(game, spriteName, xCoord, yCoord) {
    this.sprite = game.add.sprite(xCoord, yCoord, spriteName);
    this.game = game;
    this.xCoord = xCoord;
    this.yCoord = yCoord;
  }

  setSize(x, y) {
    this.sprite.scale.setTo(x, y);
  }

  setAnchor(x, y) {
    this.sprite.anchor.setTo(x, y);
  }

  setPhysics(hasPhysics) {
    this.game.physics.arcade.enable(this.sprite, hasPhysics);
  }

  setColor(color) {
    const colors = {
      red: 14683454,
      blue: 877024,
      yellow: 14731021,
      green: 769044,
    };
    this.sprite.tint = colors[color];
  }

  setAnimation(name, framesArray, frameRate, loopTrue) {
    this.sprite.animations.add(name, framesArray, frameRate, loopTrue);
  }

  setDefault() {
    this.sprite.body.fixedRotation = true;
    this.sprite.body.damping = 0.5;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.checkWorldBounds = true;
    // this.sprite.outOfBoundsKill = true;
    this.sprite.body.bounce.set(0.9);
    this.sprite.body.drag.set(20, 20);
  }

}
