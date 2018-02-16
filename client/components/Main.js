import React from 'react';
import { connect } from 'react-redux';

// Component //
const Main = (props) => {

  const { children, isGamePlaying } = props;

  return (
      <div>
      { isGamePlaying ?
        null :
        <div>
          <h3>Color Chaos Collectathon</h3>
          <p>Welcome!</p>
        </div>
      }
        <div>
          {children}
        </div>
      </div>
  );
};

const mapState = ({ game, user }) => ({
  isGamePlaying: game.isGamePlaying,
  // loggedIn: !!user.id
});
const mapDispatch = null;

export default connect(mapState, mapDispatch)(Main);
