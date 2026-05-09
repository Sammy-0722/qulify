import { React, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import QRCode from "react-qr-code";
import { adminLogout, getQueue, callNext, holdCurrent, skipCurrent, resetQueue, updateQueueStatus, resumeCurrent } from '../services/api'
import "./Admin.css";

function Admin() {
  const [isOpen, setIsOpen] = useState(true);
  const [queue, setQueue] = useState([]);
  const [currentServing, setCurrentServing] = useState(null);
  const [waiting, setWaiting] = useState(0);
  const [servedToday, setServedToday] = useState(0);
  const [searchToken, setSearchToken] = useState("")
  const [filteredQueue, setFilteredQueue] = useState([])
  const [popup, setPopup] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const navigate = useNavigate();

  const adminId = localStorage.getItem('adminId')
  const joinLink = `${window.location.origin}/join/${adminId}`
  const estimatedWait = waiting > 0 ? `${waiting * 3} min` : '--';

  const fetchQueue = async () => {
    try {
      const data = await getQueue()
      setQueue(data.queue || [])
      setCurrentServing(data.currentServing)
      setWaiting(data.waiting || 0)
      setServedToday(data.servedToday || 0)
      setIsOpen(data.isOpen !== undefined ? data.isOpen : true)
      setFilteredQueue(data.queue || [])
    } catch (err) {
      console.error('Failed to fetch queue:', err)
    }
  }

  useEffect(() => {
    if (!adminId) {
      navigate('/')
      return
    }
    fetchQueue()
    const interval = setInterval(fetchQueue, 5000)
    return () => clearInterval(interval)
  }, [adminId])

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

  const confirm = (message, onConfirm) => setPopup({ message, onConfirm })

  const handleNext = () => confirm("Call the next waiting token?", async () => {
    try {
      await callNext();
      fetchQueue();
      setPopup({ message: "✅ Next token called!", onConfirm: null })
    } catch (err) {
      setPopup({ message: "❌ Failed to call next token", onConfirm: null })
    }
  })

  const handleHold = () => confirm("Put the current token on hold?", async () => {
    try {
      await holdCurrent();
      fetchQueue();
      setPopup({ message: "✅ Token put on hold", onConfirm: null })
    } catch (err) {
      setPopup({ message: "❌ Failed to hold token", onConfirm: null })
    }
  })

  const handleSkip = () => confirm("Skip the current token?", async () => {
    try {
      await skipCurrent();
      fetchQueue();
      setPopup({ message: "✅ Token skipped", onConfirm: null })
    } catch (err) {
      setPopup({ message: "❌ Failed to skip token", onConfirm: null })
    }
  })

  const handleReset = () => confirm("Reset the entire queue? This cannot be undone.", async () => {
    try {
      await resetQueue();
      fetchQueue();
      setPopup({ message: "✅ Queue reset successfully", onConfirm: null })
    } catch (err) {
      setPopup({ message: "❌ Failed to reset queue", onConfirm: null })
    }
  })

  const handleToggleQueue = () => confirm(`${isOpen ? "Close" : "Open"} the queue?`, async () => {
    try {
      const newStatus = !isOpen
      await updateQueueStatus(newStatus)
      setIsOpen(newStatus)
      fetchQueue()
      setPopup({ message: `✅ Queue ${newStatus ? "opened" : "closed"}`, onConfirm: null })
    } catch (err) {
      setPopup({ message: "❌ Failed to update queue status", onConfirm: null })
    }
  })

  const copyLink = () => {
    navigator.clipboard.writeText(joinLink)
    setPopup({ message: "✅ Link copied to clipboard!", onConfirm: null })
  }
  const handleDownloadQR = () => {
    const svg = document.getElementById('admin-qr-code')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 300
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = '#F7F4EF'
      ctx.fillRect(0, 0, 300, 300)
      ctx.drawImage(img, 0, 0, 300, 300)
      const link = document.createElement('a')
      link.download = 'qulify-qr.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }
  const handleResume = () => confirm("Resume held token back to Waiting?", async () => {
  try {
    await resumeCurrent();
    fetchQueue();
    setPopup({ message: "✅ Token resumed", onConfirm: null })
  } catch (err) {
    setPopup({ message: "❌ No token on hold", onConfirm: null })
  }
})

  return (
    <>
      
        <nav>
          <ul>
            <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/logo.png" alt="Qulify" style={{ height: '28px', width: 'auto' }} />
              <span>Quli<span style={{ color: 'var(--amber)' }}>fy</span></span>
            </div>
            <div className="navbtns">
              <li className="Adminloginbtn">Admin</li>
              <li className="Adminloginbtn" onClick={handleLogout}>logout</li>
            </div>
          </ul>
        </nav>
        <div className="root">
        <div className="sectionline"></div>

        {/* QR CODE SECTION */}
        <div className="secondconatiner" style={{ flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <div className="queuestatusheading">Your Shop QR Code</div>
              <div className="queuestatusdescription">Customers scan this to join your queue</div>
            </div>
            <div className="Controlbtns" onClick={() => setShowQR(!showQR)}>
              {showQR ? "Hide QR" : "Show QR"}
            </div>
          </div>
          {showQR && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '16px', background: '#e7e0e0', borderRadius: '12px' }}>
              <QRCode id="admin-qr-code" value={joinLink} size={180} fgColor="rgb(11, 10, 10)" bgColor="#e7e0e0" />
              <div style={{ color: '#080808', fontSize: '0.75rem', wordBreak: 'break-all', textAlign: 'center' }}>{joinLink}</div>
              <div className="Controlbtns" onClick={copyLink}>Copy Link</div>
              <div className="Controlbtns" onClick={handleDownloadQR}>
                Download QR
              </div>
            </div>
          )}
        </div>

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
          <input type="text" placeholder="Search token number or name" className="Searchbar" value={searchToken} onChange={(e) => setSearchToken(e.target.value)} />
        </div>

        <div className="queuelistcontainer">
          <div className="queueheading">Queue list</div>
          <div className="queuecard">
            <div className="token">Token</div>
            <div className="name">Name</div>
            <div className="status">Status</div>
            <div className="counter">Counter</div>
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
          <div className="ControlsecHeading">Controls</div>
          <div className="Controlsection">
            <div className="Controlbtns" onClick={handleNext}>next</div>
            <div className="Controlbtns" onClick={handleHold}>hold</div>
            <div className="Controlbtns" onClick={handleResume}>resume</div>
            <div className="Controlbtns" onClick={handleSkip}>skip</div>
            <div className="Controlbtns" onClick={handleReset}>reset</div>
          </div>
        </div>
      </div>

      {popup && (
        <div className="formoverlay" onClick={() => setPopup(null)}>
          <div className="formsheet" onClick={(e) => e.stopPropagation()}>
            <div className="formtitle">{popup.message}</div>
            {popup.onConfirm ? (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <div className="Controlbtns" onClick={() => { popup.onConfirm(); setPopup(null) }}>Confirm</div>
                <div className="cancelbtn" onClick={() => setPopup(null)}>Cancel</div>
              </div>
            ) : (
              <div className="Controlbtns" onClick={() => setPopup(null)}>OK</div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Admin;