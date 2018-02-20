import Sprite from './Sprite';

export default class ArrowHead extends Sprite {
  constructor(game, spriteName, xCoord, yCoord) {
    super(game, spriteName, xCoord, yCoord);

    this.sprite.anchor.setTo(0.1, 0.5);
    this.sprite.alpha = 0;
  }

}
