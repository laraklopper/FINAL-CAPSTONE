// Import necessary modules and packages
import React from 'react'// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap

//Form Headers function component
export default function FormHeaders(//Export FormHeaders function component
    {//Props
        formHeading
    }
) {

    //==========JSX RENDERING===========
  return (
    <Row className='formHeaderRow'>
        <Col className='formHeaderCol'>
            <h2 className='h2'>{formHeading}</h2>
        </Col>
    </Row>
  )
}
