import Sprite from './Sprite';

export default class Platform extends Sprite {
  constructor(game, spriteName, xCoord, yCoord, xScale, yScale) {
    super(game, spriteName, xCoord, yCoord);

    this.setAnchor(0.5, 0.5);
    this.setSize(xScale, yScale);
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.immovable = true;
  }

}
