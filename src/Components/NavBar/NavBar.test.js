import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './NavBar';
import AppFrame from '../AppFrame';


it('renders NavBar in isolation without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppFrame><NavBar /></AppFrame>, div);
});