import { LocalPlayer, RemotePlayer, Platform } from './SpriteObjects';
import GameManager from './GameObjects/GameManager';
import store from '../store';
import { updateLocalState, setWinner } from '../redux/game';
import { emitPlayerStateChanges } from '../sockets/client';
import $ from 'jquery';

export function runGame(localPlayerNum, remotePlayerNums) {

  // ------ Init Game -------
  const gameManager = new GameManager(
    $(window).width(),
    $(window).height(),
    Phaser.CANVAS,
    'colorChaosCollectathonGame',
    {preload, create, update, render}
  );

  // ------ PreLoad -------
  function preload() {
    const images = {
      background: 'assets/abstractions/green_tile.jpg',
      nycIcon1: 'assets/abstractions/cityscape_nyc_bw_crop1.jpg',
      nycIcon2: 'assets/abstractions/cityscape_nyc_bw_crop2.jpg',
      platform: 'assets/abstractions/blue_tile.jpg',
    };
    this.atlasJSONs = {
      // character: {
      //   png: 'assets/robot.png',
      //   json: 'assets/robot.json'
      // },
    };
    gameManager.preload(images, this.atlasJSONs);
  }

  // ------ Create -------
  function create() {
    // ------ Initialize -------
    const storeState = store.getState();
    gameManager.create('background');

    // ------ Add Players -------
    const playerList = [
      { xCoord: 200, yCoord: 200 },
      { xCoord: 600, yCoord: 200 },
      { xCoord: 200, yCoord: 600 },
      { xCoord: 600, yCoord: 600 },
    ];

    if (localPlayerNum) {
      const { xCoord, yCoord } = playerList[localPlayerNum - 1];

      gameManager.addPlayer('localPlayer', LocalPlayer, 'nycIcon1', xCoord, yCoord, localPlayerNum);
      gameManager.localPlayer.setColor('yellow');
    }

    remotePlayerNums
      .forEach(playerNum => {
        const { xCoord, yCoord } = playerList[playerNum - 1];

        gameManager.addPlayer(`remote${playerNum}`, RemotePlayer, 'nycIcon1', xCoord, yCoord, playerNum);
        gameManager[`remote${playerNum}`].setColor('blue');
      });

    // ------ Add Platforms -------
    // parameters are (platformName, ObjType, spriteName, xCoord, yCoord, xScale, yScale)
    // gameManager.addSprite('platformMain', Platform, 'platform', 650, 700, 1.5, 1.2);

    // ------ Add HitBoxes -------

  }

  // ------ Update -------
  function update() {
    // manage collisions: local player and boundaries:
    const players = [];
    localPlayerNum && players.push('localPlayer');
    remotePlayerNums.forEach(playerNum => players.push(`remote${playerNum}`));
    const localPlayerList = [];
    localPlayerNum && localPlayerList.push('localPlayer');

    //gameManager.addCollisions(localPlayerList, 'platformMain');

    gameManager.update(store.getState().game);

    //ENDING THE GAME
    // if (store.getState().game.activePlayers <= 1) {
    //   let winner = '';
    //   players.forEach(player => {
    //     if(gameManager[player].lives) winner = `Player ${gameManager[player].playerNumber}`;
    //   });
    //   console.log(`${winner} Wins!`);
    //   store.dispatch(setWinner(winner));
    //   gameManager.endGame();
    // }

    // handle position changes
    const localPlayerState = localPlayerNum  ? {
      xCoord: gameManager.localPlayer.sprite.position.x,
      yCoord: gameManager.localPlayer.sprite.position.y,
      number: gameManager.localPlayer.playerNumber,
      // animation: gameManager.localPlayer.animation,
      // lives: gameManager.localPlayer.lives,
    } :
    {};

    // Remote Player Collisions
    remotePlayerNums.forEach(playerNumber => {
      // gameManager.game.physics.arcade.overlap(hitBox, gameManager[`remote${playerNumber}`].sprite, overlapCallbackHit);
    });

    // const origRemoteState = store.getState().game.remotePlayers;
    const remotePlayersState = {};
    remotePlayerNums.forEach(playerNumber => {
      if (gameManager[`remote${playerNumber}`].sprite.isHit) {
        remotePlayersState[playerNumber] = {
          isHit: gameManager[`remote${playerNumber}`].sprite.isHit,
          // damage: origRemoteState[playerNumber].damage - 1
        };
        gameManager[`remote${playerNumber}`].sprite.isHit = false;
      }
    });
    //disables hitboxes if theyre active, so theyll immediately be disabled after a swing
    // const hitBoxes = gameManager.localPlayer.sprite.children;
    // if (hitBoxes[0].alive || hitBoxes[1].alive)
    //   gameManager.localPlayer.sprite.children.forEach(hitbox => hitbox.kill());

    store.dispatch(updateLocalState(localPlayerState, remotePlayersState));
    //emit to server
    emitPlayerStateChanges(store.getState().game.playerStateChanges);
    const { localPlayer, remotePlayers } = store.getState().game;
    if (localPlayer.isHit) {
      console.log('local player hit');
    }
    remotePlayerNums.forEach(playerNum => {
      const { xCoord, yCoord } = remotePlayers[playerNum];
      gameManager[`remote${playerNum}`].sprite.position.set(xCoord, yCoord);
    });
  }

  // ------ Render -------
  function render() {
    // gameManager.game.debug.bodyInfo(gameManager.localPlayer.sprite, 100, 100);
    // gameManager.game.debug.body(gameManager.localPlayer.sprite)
    // gameManager.game.debug.body(hitBox);
  }

}
