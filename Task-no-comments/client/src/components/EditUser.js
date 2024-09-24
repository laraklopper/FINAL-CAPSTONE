// Import necessary modules and packages
import React from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'; 

//Edit User function component
export default function EditUser(
  {//PROPS PASSED FROM PARENT COMPONENT 
        editUserData, 
        handleInputChange, 
        editUser
    }
){

  //=========EVENT LISTENERS================
  // Function to handle form submission
  const handleUpdate = (e) => {
    e.preventDefault()//Prevent default form submission 
    console.log('Edit user account');
    editUser()//Call the editUser function
  }
  
    //===================JSX RENDERING===============
    
  return (
        <div>
          <Row>
            <Col md={12}>
              <h3 className='h3'>EDIT ACCOUNT</h3>
            </Col>
          </Row>
          {/* Form to edit user account */}
          <form onSubmit={handleUpdate} id='editUserForm'>
            <Row className='editUserRow'>
              <Col xs={6} className='editUserCol'>
              {/* New username input */}
              <label className='editUserLabel'>
                <p className='labelText'>USERNAME:</p>
                <input
                  type='text'
                  name='editUsername'
                  value={editUserData.editUsername}
                  onChange={handleInputChange}
                  autoComplete='off'
                  placeholder='New Username'
                />
              </label>
              </Col>
              {/* New user email input */}
              <Col xs={6}> <label className='editUserLabel'>
                <p className='labelText'>EMAIL:</p>
                <input
                  type='email'
                  name='editUserEmail'
                  value={editUserData.editUserEmail}
                  onChange={handleInputChange}
                  autoComplete='off'
                  placeholder='New Email'
                />
              </label>
              </Col>
            </Row>
              <Row>
                  <Col xs={12} md={8}></Col>
                  <Col xs={6} md={4}>
                      <Button 
                      variant="warning" 
                      type='submit'
                      id='editAccountBtn'
                      >
                        EDIT ACCOUNT
                        </Button>
                  </Col>
              </Row>
          </form>
        </div>
  )
}