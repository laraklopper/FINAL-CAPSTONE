// Import necessary modules and packages
import React, { useCallback, useEffect, useState} from 'react';
import '../CSS/Page2.css'; 
// Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
// Components
import Header from '../components/Header';
import QuizDisplay from '../components/QuizDisplay';
import Footer from '../components/Footer';

// Page 2 function component
export default function Page2(
  {// PROPS PASSED FROM PARENT COMPONENT
    quizList,
    setQuizList,
    logout,
    fetchQuizzes,
    setError,
    quiz,
    setQuiz,  
    setQuizName,
    setQuestions,
    questions,
    currentUser,
    quizName,
    setCurrentUser,
    setUserScores
    }
) {
  // =========STATE VARIABLES====================
  //QuizVariables
  // Store the selected quiz ID
  const [selectedQuizId, setSelectedQuizId] = useState(''); 
  //Timer variables
  const [timer, setTimer] = useState(10);
  const [quizTimer, setQuizTimer] = useState(false);


  //============USE EFFECT HOOK==================
  /* useEffect to fetch quizzes when the component 
  mounts or when fetchQuizzes changes*/
  useEffect(() => {
    fetchQuizzes();// Call the function to fetch quizzes
  }, [fetchQuizzes]);

//==========================================

  //Function to randomise answers
  const shuffleArray = (array) => {
    // Use the JavaScript sort method to shuffle the array
    // The comparison function returns a random value between -0.5 and 0.5
    // This results in a random order for each array element
    return array.sort(() => Math.random() - 0.5);
  };

  //=========REQUEST================
  //-----------GET-----------------------
  // Function to fetch a single quiz
  const fetchQuiz = useCallback(async (quizId) => {//Define async function to fetch a single Quiz
    try {
     
      if (!quizId) return;// Exit early if no quiz is selected
      const token = localStorage.getItem('token');
      if (!token) return;// Return if no token is found

      // Send a GET request to fetch quiz data from the server
      const response = await fetch(`http://localhost:3001/quiz/findQuiz/${quizId}`, {
        method: 'GET',//HTTP request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      //Response handling
      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }
     
      const fetchedQuiz = await response.json(); // Parse the JSON response
      
      // Conditional rendering to check if fetchedQuiz is valid
      if (!fetchedQuiz || !fetchedQuiz.questions) {
        throw new Error('Invalid quiz data');// Throw error if the data type is invalid
      }

      // Shuffle the questions to randomize their order
      const shuffledQuestions = fetchedQuiz.questions.map(question => {
        const optionsWithCorrectAnswer = [...question.options, question.correctAnswer];
        const shuffledOptions = shuffleArray(optionsWithCorrectAnswer);
        return { ...question, options: shuffledOptions }; 
      });


      // Update quiz list and set quiz details
      setQuizList(prevQuizList =>
        prevQuizList.map((q) => (q._id === quizId ? fetchedQuiz : q))
      );
      setQuestions(shuffledQuestions);
      setQuizName(fetchedQuiz.quizName);
      setQuiz(fetchedQuiz);
    } 
    catch (error) {
      setError(`Error fetching quiz: ${error.message}`);
      console.error(`Error fetching quiz: ${error.message}`);
    }
  }, [setQuizList, setError, setQuestions, setQuizName, setQuiz])


//=======EVENT LISTENERS============

// Function to handle quiz selection
  const handleSelectQuiz = (event) => {
    // Update selected quiz ID
    setSelectedQuizId(event.target.value);    
  };


  // ==========JSX RENDERING==========
  return (
    <>
    {/* Header component*/}
      <Header heading="GAME" />
      {/* Section1 */}
      <section className='section1'>
        <div>
        <Row className='selectHeaderRow'>
          <Col className='selectHeaderCol'>
              {/* Heading for quiz selection */}
            <h2 className='h2'>SELECT QUIZ</h2>
          </Col>
        </Row>
          <Row> 
            <Col md={4}></Col>
            <Col xs={6} md={4} id='selectQuizCol'>
              <label id='selectQuizLabel'>
                <p className='labelText'>SELECT: </p>
                </label>
                {/* Form to select a quiz */}               
              <Form.Select  
              id='quizSelect' 
                value={selectedQuizId} 
              onChange={(e) => {handleSelectQuiz(e)}}
              >
                {/* Default option prompting the user to select a quiz */}
                <option value=''>Select a quiz</option>
                {/* Map over the quizList array to create 
                an option for each quiz */}
                {quizList && quizList.length > 0 && quizList.map((quiz) => (
                  <option key={quiz._id} value={quiz._id}>
                    {/* Display quiz name */}
                    {quiz.name}
                  </option>
                ))}
              </Form.Select>
            </Col>           
            <Col xs={6} md={4}></Col>
          </Row>
        </div>
        <div>          
           {/* Quiz Display component */}
          <QuizDisplay
            selectedQuizId={selectedQuizId}
            quiz={quiz}
            fetchQuiz={fetchQuiz}
            quizName={quizName}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            setUserScores={setUserScores}
            questions={questions}
            quizTimer={quizTimer}
            setError={setError}
            setQuiz={setQuiz}           
            timer={timer}
            setTimer={setTimer}
            setQuizTimer={setQuizTimer}
            setSelectedQuizId={setSelectedQuizId}
          />
        </div>
      </section>
      {/* Footer */}
      <Footer logout={logout} />
    </>
  );
}
