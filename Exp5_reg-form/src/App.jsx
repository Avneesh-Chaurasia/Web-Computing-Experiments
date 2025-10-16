import React from 'react';
import './App.css';

const App = () => {
  return (
    <div className="naufal-bg">
      <div className="registration-box">
        <h1>Registration Form</h1>
        <form>
          <div className="input-row">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
          </div>
          <div className='input-row'>
            <input type="text" placeholder='Roll No' />
            <input type="email" placeholder="Email" />
          </div>
          <input type="password" placeholder="Password" />
          <textarea placeholder="Address"></textarea>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default App;
