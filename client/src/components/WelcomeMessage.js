// Import necessary modules and packages
import React from 'react'// Import the React module to use React functionalities
// Bootstrap
import Row from 'react-bootstrap/Row'; // Bootstrap Row component for layout
import Col from 'react-bootstrap/Col'; // Bootstrap Col component for layout

//Welcome message function component
export default function WelcomeMessage(//Export the default WelcomeMessage function component
  {//PROPS PASSED FROM PARENT COMPONENT 
    currentUser,
  }) {

  //==========JSX RENDERING=============

  return (
    <Row className='welcomeRow'>
        <Col xs={6} className='welcomeCol'>
        {/* Welcome Message */}
             <div id='welcomeMsg'>
                  <label id='welcomeLabel'>
                      <h2 id="welcomeHeading">WELCOME:</h2>
                      {/* Display current user's username */}
                      <h2 id="username">{currentUser?.username}</h2>
                  </label>
            </div>
        </Col>
        {/* Instructions */}
          <Col xs={6} id="instructions">
              <h2 id="instructionsHeading">HOW TO PLAY:</h2>
              {/* Explain how the application works */}
              <ul id="instructText">
                  <li className="instruction">
                      Select a quiz from the list
                  </li>
                  <li className="instruction">
                      Select the optional timer option
                  </li>
                  <li className="instruction">
                      Each quiz consists of 5 multiple choice questions
                  </li>
              </ul>         
          </Col>
    </Row>
  )
}
