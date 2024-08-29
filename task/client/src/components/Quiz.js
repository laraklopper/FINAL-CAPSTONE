// Import necessary modules and packages
import React, { useEffect, useState } from 'react';
// Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';

//Quiz function component
export default function Quiz(
  {// PROPS PASSED FROM PARENT COMPONENT
    selectedQuiz,
    quizIndex,
    setScore,
    handleNextQuestion,
    handleRestart,
    score,
    questions,
    quizTimer,
    timer,
    quizCompleted
  }
) {
    //=============STATE VARIABLES=====================
    const [timeLeft, setTimeLeft] = useState(timer); 
    const [selectedOption, setSelectedOption] = useState(null);  

    //========USE EFFECT HOOK==================
  useEffect(() => {
    if (quizTimer && timeLeft > 0) {
      const id = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(id);
            handleNextQuestion();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id); // Cleanup on unmount
    }
  }, [quizTimer, timeLeft, handleNextQuestion]);
      // Effect hook to manage countdown timer  
   /* useEffect(() => {
      if (!quizTimer) return;

      setTimeLeft(timer);
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          handleNextQuestion();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizTimer, timer, handleNextQuestion]);*/
  // Display loading text if quiz or questions are not available

  if (!selectedQuiz || !questions || questions.length === 0) {
    return <div>Loading...</div>
  }

 /*
  // Function to format the timer into mm:ss format
  const formatTimer = (time) => {
    if (time === null) return '00:00'; // Default value if time is null
    const minutes = Math.floor(time / 60); // Calculate minutes
    const seconds = time % 60; // Calculate seconds 
    // Format time
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  */

  // Function to format the timer into mm:ss format
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds/ 60)
    const secs = seconds % 60;
    return `${minutes}: ${secs < 10 ? '0' : ' '}${secs}`
  }

  //============EVENT LISTENERS=================
  // Function to handle answer selection and update the score if correct
  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);// Update the score if the answer is correct
    }
    handleNextQuestion();// Move to the next question
  };

// Function to handle option click and update the selected option
  const handleOptionClick = (option) => {
    // if (selectedOption) return; // Prevent re-selection
    setSelectedOption(option);// Update the selected option
    // Check if the selected option is correct
    handleAnswerClick(option === questions[quizIndex].correctAnswer);
  };

    /*
    //Function to display score when the quiz is completed
 const showScore() => {
   if(quizCompleted){
   setShowScore(!true)
   //show score and hide quiz output 
   //save score when exit button is clicked/activated
   }}
   //=> add to startQuiz logic (useState to display score) 
   //and exit if the quiz is complete
 */

  //================JSX RENDERING======================

  return (
    // Selected quiz
    <div id='quizDisplay'>
      <Row>
        <Col id='quizHeading'>
          {/* Display quiz name */}
            <h3 className='quizName'>{selectedQuiz.quizName}</h3> 
        </Col>
      </Row>
      <div>
        <Row className='quizRow'>
          <Col xs={12} md={8} id='questionCol'>
          {/* Display question number */}
            <div id='questionNumber'>
              <label>
                <p className='number'>QUESTION {quizIndex + 1} of {selectedQuiz.questions.length} </p>
              </label>
            </div>     
          </Col>
          <Col xs={6} md={4} id='timerCol'>
            {/* Display timer if enabled */}
            {quizTimer && <div id='timer'>TIMER: {formatTimer(timeLeft)}</div>}
          </Col>
        </Row>
        {/* Question */}
        <div className='question'>
          <Row>
            <Col md={9} className='questionCol'>
            {/* Display current question text */}
            <label className='questionLabel'>
                <h6 className='h6'>{questions[quizIndex].questionText}</h6>
            </label>
            </Col>
            <Col md={3}></Col>
          </Row>
          <Row className='optionsRow'>
            <Col xs={6} md={4} className='optionCol'></Col>   
            <Col xs={6} md={4} className='optionCol'>     
          {/* Map through and randomize options */}
          {questions[quizIndex].options.map((option, index)=> (
                  <Button
                    key={index}
                    variant={selectedOption === option ? 'success' : 'secondary'}
                    className='answerOption'
                    onClick={() => handleOptionClick(option)}
                     disabled={selectedOption}
                  >
                    <p className='buttonText'>{option}</p>  
                    </Button>         
          ))}
            </Col> 
            <Col xs={6} md={4} className='optionsCol'></Col>
          </Row>
        </div>
        <Row>
          <Col xs={6} md={4}>
          <div>
            {/* Display the current score */}
            <p id='resultText'>RESULT: {score} of {selectedQuiz.questions.length}</p>          
          </div>
          </Col>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4}>
          {/* Button to move to next question */}
          <Button 
          variant='primary' 
          type='button' 
          onClick={handleNextQuestion}
            disabled={quizCompleted} // Disable button if the quiz is completed
            >
            NEXT QUESTION
            </Button>
 
          {/* Button to restart quiz */}
          <Button 
          variant='primary' 
          type='reset' 
          onClick={handleRestart}
          id='resetBtn'
          >
            RESTART
            </Button>
          </Col>
              {/*display score if quiz is completed*/}
             {/*button to exit and save score to database*/}
        </Row>
      </div>
    </div>
  );
}
