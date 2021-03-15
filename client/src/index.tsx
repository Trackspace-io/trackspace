import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ClassroomContext, MessageContext, StudentContext, TeacherContext, UserContext } from 'contexts';
import Provider from 'store';

ReactDOM.render(
  <React.StrictMode>
    <Provider>
      <TeacherContext.Provider>
        <StudentContext.Provider>
          <ClassroomContext.Provider>
            <MessageContext.Provider>
              <UserContext.Provider>
                <App />
              </UserContext.Provider>
            </MessageContext.Provider>
          </ClassroomContext.Provider>
        </StudentContext.Provider>
      </TeacherContext.Provider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
