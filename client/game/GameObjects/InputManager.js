export default class InputManager {
  constructor(game) {
    this.game = game;
    this.player = null;
  }

  init(player) {
    this.player = player;
  }

  // update function calls updatePlayerMovement method on Local Player
  update(gameState) {
    this.player.updatePlayerMovement();
  }

}
