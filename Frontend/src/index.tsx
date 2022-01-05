import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import configureStore from "./store/store";
import { getUser, setCurrentUser, setIsLoggedIn } from './actions';
import interceptor from "./api/refresh-token"

export const store = configureStore();
interceptor.registerRequestInterceptor(store)

const token = localStorage.getItem("accessToken");
if (token) {
  store.dispatch(setIsLoggedIn());
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  store.dispatch(setCurrentUser(profile));
  store.dispatch(getUser());
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
