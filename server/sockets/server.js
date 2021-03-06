const uuid = require('uuid');
const serverReduxStore = require('../store');
const { updatePlayers, addPlayers } = require('../redux/game.js');
const { removeClient, addClient } = require('../redux/lobby.js');

// server rooms is always empty
// server.sockets.adapter.rooms has rooms but also has clientID's with no way to distinguish
// client.rooms has rooms but also it's own id also with no real way to distinguish besides looking to see if roomId === client.id

// example:
// server.sockets.adapter.rooms = {
//    123812903: 123812903,
//    654654742: 654654742,
//    457456345: 457456345,
//    room-12412432: room-12412432,
//    room-43534513: room-43534513
// }

// example:
// client.rooms = {
//    457456345: 457456345,
//    room-12412432: room-12412432,
//}

const socketServer = {};
socketServer.makeSocketServer = server => {
  // create helper function to find all rooms on server adapter that starts with lobby-
  // this is used for every update call so helper is DRY
  const findRoomsOnServer = () => {
    let rooms = server.sockets.adapter.rooms ? Object.keys(server.sockets.adapter.rooms) : [];
    rooms = rooms.filter(room => room.length > 5 && room.slice(0, 5) === 'room-');
    return rooms;
  };

  const findRoomForClient = client => {
    const rooms = client.rooms ? Object.keys(client.rooms) : [];
    const room = rooms.find(room => room.length > 5 && room.slice(0, 5) === 'room-');
    return room;
  };

  server.on('connection', client => {
    // ID used for interval call in startGame, terminiated in endGame
    let gameUpdateIntervalId;

    client.on('roomMounted', () => {
      server.sockets.emit('update', findRoomsOnServer());
    });
    broadcastDebugMsg(client.id + ' has joined the server');

    // disconnect updates room list for clients but does not need to leave
    // as empty rooms do not appear.  Still need to look into if this leaves
    // any leftover data when we create actual game state in rooms
    client.on('disconnect', () => {
      serverReduxStore.dispatch(removeClient({
          id: client.id
        })
      );
      client.leave(findRoomForClient(client));
      server.sockets.emit('update', findRoomsOnServer());
      broadcastDebugMsg(client.id + ' has disconnected from the server');
    });

    // using join for both join and host
    // use default roomId so that if they are not joining an existing room
    // they are creating a new room
    client.on('join', (roomId, clientInfo = {}, username) => {
      const curRoomId = roomId || 'room-' + uuid.v4();
      // add client to ReduxStore
      serverReduxStore.dispatch(addClient({
          id: client.id,
          clientInfo,
          username
        }));
      // join or create room
      client.join(curRoomId);

      //tell everyone all the usernames in lobby just to display them.
      const usernames = [];
      serverReduxStore.getState().lobby.clients.forEach(client => {
        usernames.push(client.username);
      });
      server.sockets.emit('usernamesInLobby', usernames);

      //tell everyone in the room to update
      server.sockets.emit('update', findRoomsOnServer());
    });

      // -assign Player information to players
      // -add updated player to store
      // -emit updated players to clients
      // const playersAmount = serverReduxStore.getState().users.players.length

    client.on('startGame', () => {
      // const characterGraphic = ['spite1', 'sprite2', 'sprite3', 'sprite4'];

      var clientsAsPlayers = {};
      serverReduxStore.getState().lobby.clients.forEach((client, idx) => {
        // first, add players' info to clients :
        client.number = idx + 1;
        // client.characterGraphic = characterGraphic[idx];
        client.xCoord = 0;
        client.yCoord = 0;
        // client.animation = '';
        // client.isHit = false;

        // second, hash it inside an empty obj with {playerNum: playerObj} format :
        clientsAsPlayers[client.number] = client;
      });
      serverReduxStore.dispatch(addPlayers(clientsAsPlayers));

      for (let playerNumberKey in clientsAsPlayers) {
        server.to(clientsAsPlayers[playerNumberKey].id).emit('playerAssignment', +playerNumberKey);
      }

      server.sockets.emit('initPlayers', clientsAsPlayers);
      server.sockets.emit('initGame');

      // send periodic updates to the clients about game state
      // emit(playersStates, activePlayers);
      gameUpdateIntervalId = setInterval(
        () => server.sockets.emit('playerStateUpdates', serverReduxStore.getState().game.players),
        16
      );
    });

    client.on('endGame', () => {
      if (gameUpdateIntervalId) clearInterval(gameUpdateIntervalId);
      server.sockets.emit('stopGame');
    });

    client.on('playerStateChanges', (playersStates) => {
      //playersStates is an object with only the changes about a client and his enemies that he affected.
      serverReduxStore.dispatch(updatePlayers(playersStates));
    });

    // chatMessage uses new findRoomForClient helper method that finds the room
    // for the client that starts with "lobby-",  this removes the rooms that
    // are based on the clientId
    client.on('chatMessage', (msg, username) => {
      // find out which room the client is in
      server.to(findRoomForClient(client)).emit('addChatMessage', msg, username);
    });

    function broadcastDebugMsg(msg) {
      server.sockets.emit('debugMessage', msg);
    }
  });
};

module.exports = socketServer;
