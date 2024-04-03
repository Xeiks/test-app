import './auth.css';
import { createDirectus, authentication, rest, login, readItems, readRole} from '@directus/sdk';
import { useNavigate } from 'react-router-dom';
import React, { useState , useEffect} from 'react';

export default function Auth() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const client = createDirectus('http://localhost:8010/proxy').with(authentication('json')).with(rest());

  const login = async () => {

    const result = await client.login(email, password);
    if (!result?.errors) {
      navigate('main',{ replace: false, state: {email: email, password: password , auth: true}});
    }
    // const data = await client.request(readRole('80ad5db2-4e8f-448c-a6f5-32dac1d6e4e4'));
    // console.log(data)
  }

  return (
    <div className='container'>
      <div className='column'>
        <label className='inputText' htmlFor='email'>Email</label>
        <input value={email} onChange={(event) => { setEmail(event.target.value) }} className='input' id='email'></input>
      </div>
      <div className='column'>
        <label className='inputText' htmlFor='password'>Пароль</label>
        <input type='password' value={password} onChange={(event) => { setPassword(event.target.value) }} className='input' id='password'></input>
      </div>
      <a href='#' onClick={() => { setFormState('registration') }}>Регистрация</a>
      <button onClick={() => { login() }} className='loginButton'>Войти</button>
    </div>
  );
}