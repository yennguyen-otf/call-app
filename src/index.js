import React, { useEffect } from "react";
import ReactDOM from 'react-dom';

import { makeCall } from './lib/RingCentral';
import './style.css';

const App = () => {
    return <div className="box">
        <button onClick={makeCall}>call</button>
        <audio id='rc-audio' controls/>
    </div>
}

ReactDOM.render(<App />, document.getElementById('app'))