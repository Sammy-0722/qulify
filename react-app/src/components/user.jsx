import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQueue, joinQueue, } from '../services/api'

import "./user2.css";
function User1() {
  const [showform, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [TokenNo, setMyToken] = useState("");
  const [issuedat, setIssuedAt] = useState("");
  const [queue, setQueue] = useState([]);
  const [currentServing, setCurrentServing] = useState(null);
  const [waiting, setWaiting] = useState(0);
  const [alerted, setAlerted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const myIndex = queue.findIndex(item => item.tokenNo === TokenNo);
  const peopleAhead = myIndex === -1 ? 0 : myIndex;
  const estimatedtime = TokenNo*3;
const handleJoinqueue = async () => {
  try {
    const data = await joinQueue(name);
    setMyToken(data.tokenNo);
    setIssuedAt(new Date().toLocaleTimeString());
    setShowForm(false);
  } catch (err) {
    if (err.response?.status === 403) {
      alert("Queue is currently closed. Please try again later.");
      setShowForm(false);
    } else {
      alert("Something went wrong. Please try again.");
    }
  }
}
  const fetchQueue = async () => {
    try {
      const data = await getQueue()
      // your backend returns: { queue, currentServing, waiting, servedtoday }
      setQueue(data.queue)
      setCurrentServing(data.currentServing);
      
      setWaiting(data.waiting)
      // setServedToday(data.servedtoday)
      setIsOpen(data.isOpen)

      if (TokenNo && data.currentServing === TokenNo) {
        setAlerted(true);
        alert(`🔔 Your turn! Token ${TokenNo} is now being served. Please go to the counter.`);
      }
    } catch (err) {
      console.error('Failed to fetch queue:', err)
    }
  }
  useEffect(() => {
  fetchQueue();
  const interval = setInterval(() => {
    fetchQueue();
  }, 5000);
  return () => clearInterval(interval);
}, [TokenNo]);
  return (
    <>
      <nav>
        <ul>
          <div className="logo">QULIFY</div>
          <div className="navbtns">
            <li className="Adminloginbtn">Customer</li>
          </div>
        </ul>
      </nav>
      <div className="sectionline"></div>
      <div className="Wholecontainer">

        <div className="Tokendatacont">
          <div className="Tokendisplaycont">
            <div>your token</div>
            <div className="Tokenno">{TokenNo ? TokenNo:"----"}</div>
            <div className="Tokennotime">{issuedat ? issuedat:"----"}</div>

          </div>
          <div className="Tokeninfom">
            <div className="tokencard">
              <div className="number">{peopleAhead ? peopleAhead:"----"}</div>
              <div>ahead of you</div>
            </div>
            <div className="tokencard">
              <div className="number">{estimatedtime ? estimatedtime:"----"}m</div>
              <div>Est wait</div>
            </div>
            <div className="tokencard">
              <div className="number">{currentServing ? currentServing:"----"}</div>
              <div>serving</div>
            </div>
          </div>
        </div>
        <div className="wheretogosec2">
          <div className="wheretogoinfo">
            <div className="basicinfo">when called, go to</div>
            <div className="assignedinfo">Counter assigned on call</div>
          </div>
          <div className="counterno">C-1</div>
        </div>
        <div className="servinginfo">
          <div className="dot"></div>
          <div className="servinginfotext">Now serving {currentServing ? currentServing:"----"} — you're {TokenNo ? TokenNo:"----"}in line</div>

        </div>
        <div className="QUEUEsec">
          <div className="queueheading">LIVE QUEUE</div>
          <div className="Queuecard">
            <div className="cardheading">POSITION TRACKER</div>
            {queue.length === 0 ? (
              <div style={{ padding: '1rem', color: '#888' }}>No one in queue</div>
            ) : (
              queue.map((person) => (
                <div className="queuecard" key={person._id}>
                  <div className="token">{person.tokenNo}</div>
                  <div className="name">{person.name}</div>
                  <div className="status">{person.status}</div>
                  <div className="counter">{person.counter || '—'}</div>
                </div>
              ))
        
            )}
      </div>
    </div >


      <div className="sectionline"></div>
 {isOpen ? (
  <div className="Taketoken" onClick={() => setShowForm(true)}>
    click here to generate token
  </div>
) : (
  <div className="Taketoken" style={{ backgroundColor: '#555', cursor: 'not-allowed' }}>
    Queue is currently closed
  </div>
)}
  {showform && (
  <div className="formoverlay" onClick={() => setShowForm(false)}>
    <div className="formsheet" onClick={(e) => e.stopPropagation()}>
      <div className="formtitle">Enter your name</div>
      <input
        className="nameinput"
        type="text"
        placeholder="Type your name..."
        onChange={(e) => setName(e.target.value)}
      />
      <div className="Taketoken" onClick={handleJoinqueue}>Generate token</div>
      <div className="cancelbtn" onClick={() => setShowForm(false)}>Cancel</div>
    </div>
  </div>
)}
      </div >
      
      
    </>
  )
}
export default User1;

