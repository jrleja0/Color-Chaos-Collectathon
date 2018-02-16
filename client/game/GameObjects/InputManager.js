export default class InputManager {
  constructor(game) {
    this.game = game;
    this.player = null;
  }

  init(player) {
    this.player = player;
  }

  // update function calls updateAnimationState to determine which movement needs to be animated,
  // then calls move to do the animation
  update(gameState) {
    this.player.updateAnimationState();
    const animation = gameState.remotePlayers[this.player.playerNumber] ?
      gameState.remotePlayers[this.player.playerNumber].animation :
      this.player.animation;
    this.player.move(animation);
  }

}
