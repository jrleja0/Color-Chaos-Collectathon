import React from 'react';
import { connect } from 'react-redux';
import { PhaserGame } from './index';
import { receiveMessage } from '../redux/lobby';
import { processInitPlayers, setPlayer, startGame, setWinner } from '../redux/game';
import { emitChatMessage, emitStartGame, onUsernamesInLobby, onInitGame, onAddChatMessage, onInitPlayers, onPlayerAssignment } from '../sockets/client';

// Component //
class Lobby extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      inputVal: '',
      usersInLobby: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.startGame = this.startGame.bind(this);
    this.processMessage = this.processMessage.bind(this);
  }

  componentDidMount() {
    onAddChatMessage(this.processMessage);
    onInitPlayers(this.props.handleInitPlayers);
    onPlayerAssignment(this.props.handlePlayerAssignment);
    onInitGame(this.props.handleStartGame);
    onUsernamesInLobby((usersInLobby) => this.setState({
      usersInLobby: usersInLobby
    }));
    emitChatMessage('has joined the lobby!', this.props.username);
  }

  startGame() {
    this.props.initializeWinner();
    emitStartGame();
  }

  processMessage(msg, username) {
    this.props.handleMessage({ msg, username });
  }

  handleChange(e) {
    this.setState({
      inputVal: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      inputVal: ''
    });
    emitChatMessage(this.state.inputVal, this.props.username);
  }

  render() {
    const { isGamePlaying } = this.props;

    return (
      <div>
        { isGamePlaying ?
          <PhaserGame /> :
          <div>
            <div>
            {
              this.props.messages.map((message, idx) => (
                <p key={`para-${idx}`}>
                  { message.msg.indexOf('has joined the lobby!') > -1 ?
                  <span>{message.username + ' ' + message.msg }</span>
                  :  <span>{message.username + ': ' + message.msg }</span>
                  }
                </p>
              ))
            }
            </div>
            <form onSubmit={this.handleSubmit}>
              <input value={this.state.inputVal} onChange={this.handleChange} />
              <button>Send</button>
            </form>
            <button
              onClick= {this.startGame}
            >
              Start Game
            </button>
            <h4> Players in lobby :</h4>
            <ul>
              {
                this.state.usersInLobby.length ?
                this.state.usersInLobby.map((username, idx) => {
                  return <li key={`user-${idx}`}><h3>{username}</h3></li>
                }) : null
              }
            </ul>
          </div>
        }
      </div>
    );
  }
}

const mapState = ({ user, game, lobby }) => ({
  // userInfo: user.userInfo,
  // username: user.username,
  isGamePlaying: game.isGamePlaying,
  messages: lobby.messages,
  winner: game.winner,
});

const mapDispatch = dispatch => ({
  handleMessage: message => dispatch(receiveMessage(message)),
  handleInitPlayers: players => dispatch(processInitPlayers(players)),
  handlePlayerAssignment: playerNumber => dispatch(setPlayer(playerNumber)),
  handleStartGame: () => dispatch(startGame()),
  initializeWinner: () => dispatch(setWinner('')),
});

export default connect(mapState, mapDispatch)(Lobby);
