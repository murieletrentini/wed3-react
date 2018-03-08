// @flow

import React from 'react'
import { Link } from 'react-router-dom'

export type Props = {
  isAuthenticated: boolean,
}

const Home = ({isAuthenticated}: Props) => (
  <div>
    { isAuthenticated
      ? <div>
          <p>Welcome back!</p>
          <Link to={'/dashboard'}>Dashboard</Link>
        </div>
      : <div>
          <Link to={'/login'}>Log In</Link>
          <p>If you don't have an account yet, sign up here:</p>
          <Link to={'/signup'}>Sign Up</Link>
        </div>
    }
  </div>
);

export default Home
