import React, { Fragment, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = e => setFormData({
    ...formData, [e.target.name]: e.target.value
  });
  const onSubmit = async e => {
    e.preventDefault();
    // if (password !== password2) {
    //   console.log('Passwords don\'t match');
    // } else {
    //   const newUser = {
    //     name,
    //     email,
    //     password
    //   };
    //
    //   try {
    //     const config = {
    //       headers: {
    //         'Content-type': 'application/json'
    //       }
    //     };
    //     const body = JSON.stringify(newUser);
    //     const res = await axios.post('/api/users', body, config);
    //
    //     console.log(res.data);
    //   } catch (err) {
    //     console.log(err.response.data);
    //   }
    // }
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" />
        Sign into Account
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            name="email"
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login"/>
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </Fragment>
  );
};

export default Login;