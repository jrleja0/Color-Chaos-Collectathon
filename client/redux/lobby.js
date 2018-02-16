//------- ACTIONS -------
const ENTER_LOBBY = 'ENTER_LOBBY';
const LOAD_ROOMS = 'LOAD_ROOMS';
const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

// ------ ACTION CREATORS -------
export const enterLobby = () => ({ type: ENTER_LOBBY });
export const loadRooms = rooms => ({ type: LOAD_ROOMS, rooms });
export const receiveMessage = message => ({ type: RECEIVE_MESSAGE, message });

// ------- INIT STATE --------
const initState = {
  messages: [],
  rooms: [],
};

// ------- REDUCERS ------------
export default function (state = initState, action) {
  const newState = Object.assign({}, state );

  switch (action.type) {

    case ENTER_LOBBY:
      return initState;

    case LOAD_ROOMS:
      newState.rooms = action.rooms;
      break;

    case RECEIVE_MESSAGE:
      const newMessages = newState.messages.slice(0);
      newMessages.push(action.message);
      newState.messages = newMessages;
      break;

    default:
      break;
  }
  return newState;
}

// -------- DISPATCHERS -----------
