import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getQueue, joinQueue } from '../services/api';
import "./user2.css";

function User1() {
  const { adminId } = useParams();
  const [showform, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [TokenNo, setMyToken] = useState("");
  const [issuedat, setIssuedAt] = useState("");
  const [queue, setQueue] = useState([]);
  const [currentServing, setCurrentServing] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [estimatedWait, setEstimatedWait] = useState(0);
  const [showServingPopup, setShowServingPopup] = useState(false);
  const hasNotifiedRef = useRef(false);

  const myIndex = queue.findIndex(item => item.tokenNo === TokenNo);
  const peopleAhead = myIndex === -1 ? 0 : myIndex;
  const estimatedtime = peopleAhead * 3;

  const handleJoinqueue = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    try {
      const data = await joinQueue(name, note, adminId);
      setMyToken(data.tokenNo);
      setIssuedAt(new Date().toLocaleTimeString());
      const waitingCount = queue.filter(t => t.status === "Waiting").length;
      setEstimatedWait(waitingCount * 3);
      setShowForm(false);
      setShowPopup(true);
      hasNotifiedRef.current = false; // Reset notification flag for new token
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
      const data = await getQueue(adminId)
      setQueue(data.queue || [])
      const serving = data.queue?.find(t => t.status === "Serving")
      setCurrentServing(serving ? serving.tokenNo : null)
      setIsOpen(data.isOpen !== undefined ? data.isOpen : true)

      if (TokenNo && serving && serving.tokenNo === TokenNo && !hasNotifiedRef.current) {
        setShowServingPopup(true);
        hasNotifiedRef.current = true;
      }
    } catch (err) {
      console.error('Failed to fetch queue:', err)
    }
  }

  useEffect(() => {
    if (adminId) {
      fetchQueue()
      const interval = setInterval(fetchQueue, 5000)
      return () => clearInterval(interval)
    }
  }, [adminId])

  return (
    <>
      <nav>
        <ul>
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.png" alt="Qulify" style={{ height: '28px', width: 'auto' }} />
            <span>Quli<span style={{ color: 'var(--amber)' }}>fy</span></span>
          </div>
        </ul>
      </nav>
      <div className="sectionline"></div>
      <div className="Wholecontainer">

        <div className="Tokendatacont">
          <div className="Tokendisplaycont">
            <div>your token</div>
            <div className="Tokenno">{TokenNo ? TokenNo : "----"}</div>
            <div className="Tokennotime">{issuedat ? issuedat : "----"}</div>
          </div>
          <div className="Tokeninfom">
            <div className="tokencard">
              <div className="number">{TokenNo ? peopleAhead : "----"}</div>
              <div>ahead of you</div>
            </div>
            <div className="tokencard">
              <div className="number">{TokenNo ? estimatedtime : "----"}m</div>
              <div>Est wait</div>
            </div>
            <div className="tokencard">
              <div className="number">{currentServing ? currentServing : "----"}</div>
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
          <div className="servinginfotext">Now serving {currentServing ? currentServing : "----"} — you're {TokenNo ? TokenNo : "----"} in line</div>
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
        </div>

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
              <div className="formtitle">Enter your details</div>
              <input
                className="nameinput"
                type="text"
                placeholder="Your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="nameinput"
                type="text"
                placeholder="Any request? (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ marginTop: '10px' }}
              />
              <div className="Taketoken" onClick={handleJoinqueue}>Generate token</div>
              <div className="cancelbtn" onClick={() => setShowForm(false)}>Cancel</div>
            </div>
          </div>
        )}

        {showPopup && (
          <div className="formoverlay" onClick={() => setShowPopup(false)}>
            <div className="formsheet" onClick={(e) => e.stopPropagation()}>
              <div style={{ fontSize: '3rem' }}>🎟️</div>
              <div className="formtitle">Token Generated!</div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3e2c1f' }}>{TokenNo}</div>
              <div style={{ color: '#0b0b0b', marginBottom: '8px' }}>Issued at {issuedat}</div>
              <div style={{ color: '#0b0b0b', marginBottom: '16px' }}>
                Estimated wait: <strong>{estimatedWait} mins</strong>
              </div>
              <div className="Taketoken" onClick={() => setShowPopup(false)}>Got it!</div>
            </div>
          </div>
        )}

        {showServingPopup && (
          <div className="formoverlay" onClick={() => setShowServingPopup(false)}>
            <div className="formsheet" onClick={(e) => e.stopPropagation()}>
              <div style={{ fontSize: '3rem' }}>🔔</div>
              <div className="formtitle">It's Your Turn!</div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3e2c1f', margin: '1rem 0' }}>
                {TokenNo}
              </div>
              <div style={{ color: '#0b0b0b', marginBottom: '1.5rem' }}>
                Please proceed to the counter
              </div>
              <div className="Taketoken" onClick={() => setShowServingPopup(false)}>
                On my way
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

export default User1;