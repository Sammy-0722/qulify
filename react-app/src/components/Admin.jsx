import {React,  useState,useEffect  } from "react";
import {useNavigate} from 'react-router-dom';
import { adminLogout,getQueue,joinQueue,callNext,holdCurrent,skipCurrent,resetQueue,updateQueueStatus } from '../services/api'
import "./Admin.css";
function Admin() {
  const [isOpen, setIsOpen] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentServing, setCurrentServing] = useState(null);
  const [waiting, setWaiting] = useState(0);
  const [servedToday, setServedToday] = useState(0);
  const [searchToken, setSearchToken] = useState("")
  const [filteredQueue, setFilteredQueue] = useState([])
  const navigate = useNavigate();
 const estimatedWait = waiting > 0 ? `${waiting * 3} min` : '--';

  // fetchQueue — calls backend and updates all state
  const fetchQueue = async () => {
    try {
      const data = await getQueue()
      // your backend returns: { queue, currentServing, waiting, servedtoday }
      setQueue(data.queue)
      setCurrentServing(data.currentServing)
      setWaiting(data.waiting || 0)
      setServedToday(data.servedtoday || 0)
      setIsOpen(data.isOpen !== undefined ? data.isOpen : true) // get queue status from backend
      setFilteredQueue(data.queue || [])
    } catch (err) {
      console.error('Failed to fetch queue:', err)
    }
  }

  // runs once when page loads
  useEffect(() => {
    fetchQueue()
  }, [])

  // runs every 5 seconds automatically (live updates)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchQueue()
    }, 5000)
    return () => clearInterval(interval) // cleanup on unmount
  }, [])

   useEffect(() => {
    if (searchToken.trim() === "") {
      setFilteredQueue(queue)
    } else {
      const filtered = queue.filter(person => 
        person.tokenNo.toString().includes(searchToken) ||
        person.name.toLowerCase().includes(searchToken.toLowerCase())
      )
      setFilteredQueue(filtered)
    }
  }, [searchToken, queue])

  const handleLogout = () => {
    adminLogout()
    navigate("/")
  }

  const handleNext = async () => {
    try {
      await callNext()
      fetchQueue() // refresh immediately after action
    } catch (err) {
      console.error(err)
    }
  }

  const handleHold = async () => {
    try {
      await holdCurrent()
      fetchQueue()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSkip = async () => {
    try {
      await skipCurrent()
      fetchQueue()
    } catch (err) {
      console.error(err)
    }
  }

  const handleReset = async () => {
    try {
      await resetQueue()
      fetchQueue()
    } catch (err) {
      console.error(err)
    }
  }
  const handleToggleQueue = async () => {
    try {
      const newStatus = !isOpen
      await updateQueueStatus(newStatus) // call backend API
      setIsOpen(newStatus)
      fetchQueue() // refresh to get updated state
    } catch (err) {
      console.error('Failed to toggle queue status:', err)
    }
  }
  return (
    <>
      <div className="root">
        <nav>
          <ul>
            <div className="logo">QULIFY</div>
            <div className="navbtns">
              <li className="Adminloginbtn">Admin</li>
              <li className="Adminloginbtn" onClick={handleLogout}>logout</li>
            </div>
          </ul>
        </nav>
        <div className="sectionline"></div>
        <div className="AdminSection">
          <div className="Adminheading">Queue Overview</div>
          <div className="Adminviewcardcontainer">
            <div className="Admincard">
              <div className="Cardheading1">{currentServing ?? '-'}</div>
              <div className="des">serving</div>
            </div>
            <div className="Admincard">
              <div className="Cardheading">{waiting}</div>
              <div className="des">waiting</div>
            </div>
            <div className="Admincard">
              <div className="Cardheading">{servedToday}</div>
              <div className="des">served today</div>
            </div>
            <div className="Admincard">
              <div className="Cardheading">{estimatedWait}</div>
              <div className="des">estimate wait</div>
            </div>
          </div>
        </div>
        <div className="secondconatiner">
        <div className="Queuestatussec">
          <div className="queueinfocontainer">
            <div className="queuestatusheading">Queue status</div>
            <div className="queuestatusdescription">
               {isOpen ? "Open — accepting tokens" : "Closed — not accepting tokens"}
            </div>
          </div>
              <button
          className={`toggle-track ${isOpen ? "on" : ""}`}
          onClick={handleToggleQueue}
          role="switch"
          aria-checked={isOpen}
          aria-label="Queue status toggle"
        >
          <span className="toggle-thumb" />
        </button>
        </div>
        <input type="text" placeholder="Search token number" className="Searchbar" value={searchToken} onChange={(e) => setSearchToken(e.target.value)}/>
        </div>
        <div className="queuelistcontainer">
          <div className="queueheading">Queue list</div>
          <div className="queuecard">
            <div className="token">Token</div>
            <div className="name">
              Name</div>
            <div className="status">
              Status</div>
            <div className="counter">
              Counter
              </div>
          </div>
            {filteredQueue.length === 0 ? (
             <div style={{ padding: '1rem', color: '#888' }}>
              {searchToken ? 'No matching tokens found' : 'No one in queue'}
            </div>
          ) : (
            filteredQueue.map((person) => (
              <div className="queuecard" key={person._id}>
                <div className="token">{person.tokenNo}</div>
                <div className="name">{person.name}</div>
                <div className="status">{person.status}</div>
                <div className="counter">{person.counter || '—'}</div>
              </div>
            ))
          )}
        </div>
        <div className="Controlscontainer">
          <div className="ControlsecHeading"> Controls</div>
          <div className="Controlsection">
            <div className="Controlbtns" onClick={handleNext}>next</div>
            <div className="Controlbtns" onClick={handleHold}>hold</div>
            <div className="Controlbtns" onClick={handleSkip}>skip</div>
            <div className="Controlbtns" onClick={handleReset}>reset</div>
          </div>
        </div>
      </div>


    </>
  )
}
export default Admin;
