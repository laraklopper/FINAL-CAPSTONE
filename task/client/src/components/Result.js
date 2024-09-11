import React, { useState } from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

// Result function component
export default function Result({//Export default Result component
  // PROPS PASSED FROM PARENT COMPONENT
  currentScore,
  addScore,
  quizName,
  selectedQuiz,
  totalQuestions,
  currentUser
}) {
   //===========STATE VARIABLES=================
  const [showScore, setShowScore] = useState(true);// State to control the visibility of the result display
   const [submitted, setSubmitted] = useState(false)//Boolean to indicate if the score has been submitted
  const [submissionError, setSubmissionError] = useState(null)//State to indicate if an error occured while submitting the score

   //--------------EVENT LISTENERS---------------
  // Function to submit score
  const handleSubmitScore = async (e) => {
    // e.preventDefault();
    setSubmitted(true); // Indicate submission in progress
    setSubmissionError(null); // Clear previous errors
    try {
      await addScore(); // Call the addScore function 
      console.log('Score successfully submitted');
      setSubmitted(false);// Reset submission state on failure
    } catch (error) {
      setSubmissionError('Failed to save score');
      console.log('Failed to save score', error.message);//Log an error message for debugging purposes
      setSubmitted(false); // Reset submission state on failure
    }
  };

  // // Function to submit score
  // const handleSubmitScore = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await addScore();  
  //   } catch (error) {
  //     console.log('Failed to save score', error.message);
  //   }
  // };

  // Function to hide the result display
  const handleExit = () => {
    setShowScore(false);// Hide the result display after successful submission
  };

  // Function to display the current date in a readable format
  const currentDate = (date) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return new Date(date).toLocaleDateString('en-GB', options);
  };

  //=============JSX RENDERING=================

  return (
    showScore && (
      <div id='results'>
        <form onSubmit={handleSubmitScore}>
          <Row>
            <Col xs={6} md={4}>
            {/* Display the quizName */}
              <input
                value={selectedQuiz?.quizName || quizName || 'Unnamed Quiz'}
              readOnly
              type='text'
                className='resultFormInput'
              />
            </Col>
            <Col xs={6} md={4}>
              {/* Display the username of the user */}
              <input
                id='quizUser'
                className='resultFormInput'
                type='text'
                value={`Username: ${currentUser?.username || ''}`}
                readOnly
              />
            </Col>
            <Col xs={6} md={4} id='resultsCol'>
              {/* Display the result with the score and total questions */}
              <input
                id='resultOutput'
                className='resultFormInput'
                type='text'
                value={`RESULT: ${currentScore} OF ${totalQuestions}`}
                readOnly
              />
            </Col>
            <Col xs={6} md={4} className='resultsCol'>      
             
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={4}>
            {/* Display the current date */}
             <input
                type='text'
                value={currentDate(new Date())}
                name='date'
                readOnly
                className='resultFormInput'
              />
            </Col>
            <Col xs={6} md={4}></Col>
          </Row>
          <Row>
            <Col xs={6} md={4}></Col>
            <Col xs={6} md={4}>
              {/* Button to submit the score */}
              <Button
                variant='primary'
                type='submit'
              >
              {submitted ? 'Submitting...' : 'SAVE SCORE'}
            </Button>
            </Col>
            <Col xs={6} md={4}></Col>
          </Row>
        </form>
               {/* Display error message if an error occurs when the score is submitted */}
        {submissionError && <p>{submissionError}</p>}
        <Row>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4}>
        {/* Button to exit when the quiz is complete or the user saved the score*/}
          <Button
              variant='warning'
              onClick={handleExit}
              type='button'
            >
              Exit
            </Button>
          </Col>
          <Col xs={6} md={4}></Col>
        </Row>
      </div>
    ))}
  

