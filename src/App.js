import './App.css';
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KeywordDetail from './KeywordDetail';
import KeywordAlertSetting from './KeywordAlertSetting';
import MyCalendar from './Calendar';
import Navbar from './Navbar';

class App extends Component {
  render() {
    return (
        <Router>
          <Navbar/>
          <div className="content"> {/* content 클래스를 추가하여 여백 확보 */}
            <Routes>
              <Route exact path="/add" element={<KeywordAlertSetting />} />
              <Route exact path="/detail" element={<KeywordDetail />} />
              <Route exact path="/calendar" element={<MyCalendar />} />

              {<Route path="/" element={<KeywordAlertSetting />} /> }
            </Routes>
            </div>
        </Router>
    );
  }
}


export default App;