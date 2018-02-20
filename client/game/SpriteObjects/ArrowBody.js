import Sprite from './Sprite';

export default class ArrowBody extends Sprite {
  constructor(game, spriteName, xCoord, yCoord, xScale, yScale) {
    super(game, spriteName, xCoord, yCoord);

    this.sprite.width = 8;
    this.sprite.rotation = 220;
    this.sprite.anchor.setTo(0.5, 0.0);
    this.sprite.alpha = 0;
  }

}
