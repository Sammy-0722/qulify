import { useNavigate } from 'react-router-dom';
import "./landingpage.css";
import "../App.css"
function Landingpage() {
    const navigate = useNavigate();
    return (
        <div>
            <nav>
                <ul>
                    <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src="/logo.png" alt="Qulify" style={{ height: '28px', width: 'auto' }} />
                          <span>Quli<span style={{ color: 'var(--amber)' }}>fy</span></span>
                    </div>
                    <div className="navbtns">
                        <li className="Adminloginbtntop" onClick={() => navigate('/Login')}>Admin Login</li>
                        <li className="Gettokenbtntop" onClick={() => alert("Please scan your shop's QR code to join the queue.")}> Get a Token</li>
                    </div>
                </ul>
            </nav>
            <div className="container">
                <div className="Introsection">
                    <span className="logoline">DIGITAL QUEUE MANAGEMENT</span>
                    <div className="Heading1">No More Waiting</div>
                    <div className="Heading2">know your turn</div>
                    <div className="para">quilfy remove the phsycical lines
                        with a smart digital token system</div>
                    <div className="para">Walk in, grab a token, track your position
                        live — no more standing and guessing.</div>
                    <div className="introbtns">
                        <li className="Adminloginbtn" onClick={() => navigate('/Login')}> admin login</li>
                        <li className="Gettokenbtn" onClick={() => alert("Please scan your shop's QR code to join the queue.")}> get a token</li>
                    </div>
                    <div className="Dashboradcontainer">
                        <div className="shorthead">quifyilive queue</div>
                        <div className="dashboard">
                            <div className="card">
                                <p>NOW SERVING</p>
                                <h1>042</h1>
                                <span>Counter 2</span>
                            </div>

                            <div className="card active">
                                <p>YOUR TOKEN</p>
                                <h1>045</h1>
                                <span>3 ahead</span>
                            </div>

                            <div className="card">
                                <p>WAIT TIME</p>
                                <h1>9</h1>
                                <span>minutes est.</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="Linebreak"></div>

            <div className="HowItWorksContainer">

                <div className="shorthead2">HOW IT WORKS</div>
                <div className="mainHeading">Three steps to zero hassle</div>

                <div className="howitworks">

                    <div className="howcard">
                        <div className="howcard-number">01</div>
                        <div className="icon">📄</div>
                        <h3>Grab a token</h3>
                        <p>
                            Walk in and get a digital token assigned instantly —
                            no app download needed.
                        </p>
                    </div>

                    <div className="howcard">
                        <div className="howcard-number">02</div>
                        <div className="icon">⏱️</div>
                        <h3>Track your position</h3>
                        <p>
                            Watch the live queue screen and see exactly how
                            many people are ahead of you.
                        </p>
                    </div>

                    <div className="howcard">
                        <div className="howcard-number">03</div>
                        <div className="icon">✔</div>
                        <h3>Get called in</h3>
                        <p>
                            When your number is up, step right in.
                            No shouting, no confusion.
                        </p>
                    </div>

                </div>

            </div>
            <div className="sectionline"></div>
            <div className="Featuresec">
                <div className="heading">Features</div>
                <div className="sub-heading">Built for real service counters</div>
                <div className="card-sec">
                    <div className="Card1">
                        <div className="dot"></div>
                        <div className="card-content">
                            <div className="cardheading">Live token tracking</div>
                            <div className="carddes">Real-time queue updates so customers always know where they stand.</div>
                        </div>
                    </div>
                    <div className="Card1">
                        <div className="dot"></div>
                        <div className="card-content">
                            <div className="cardheading">Admin dashboard control</div>
                            <div className="carddes">Advance, reset, or manage the queue from a clean admin panel.</div>
                        </div>
                    </div>
                    <div className="Card1">
                        <div className="dot"></div>
                        <div className="card-content">
                            <div className="cardheading">No app install needed</div>
                            <div className="carddes">100% web-based. Works on any device with a browser, instantly.</div>
                        </div>
                    </div>
                    <div className="Card1">
                        <div className="dot"></div>
                        <div className="card-content">
                            <div className="cardheading">Instant token generation</div>
                            <div className="carddes">Tokens are issued in milliseconds, keeping your lobby moving fast.</div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="sectionline"></div>
            <div className="UseCaseContainer">
                <div className="usecase-content-cont">
                    <div className="heading">Usecase</div>
                    <div className="sub-heading">Works wherever queues exist</div>
                    <div className="cases-container">
                        <div className="cases">Clincs & hosiptal</div>
                        <div className="cases">Banks</div>
                        <div className="cases">Government Office</div>
                        <div className="cases">Service Center</div>
                        <div className="cases">Pharmaics</div>
                        <div className="cases">Imigration Countires</div>
                        <div className="cases">Universisty Admin</div>
                        <div className="cases">Cafes</div>
                    </div>
                </div>
                {/* <div className="sectionline"></div> */}
                <div className="Xyz">
                    <div className="Readysec">
                        <div className="Readyhead">Ready to kill the queue?</div>
                        <div className="heading">Join as a customer or manage your counter as an admin.</div>
                        <div className="introbtns">
                            <div className="Gettokenbtn" onClick={() =>alert("Please scan your shop's QR code to join the queue.")}>GET MY TOKEN</div>
                            <div className="Adminloginbtn" onClick={() => navigate('/Login')} >ADMIN LOGIN</div>
                        </div>
                    </div>
                </div>

            </div>
            <footer className="Footer">
                <div>Oulify</div>
                <div>© 2025 Qulify. Digital queue management.</div>
            </footer>
        </div>
    )
}
export default Landingpage;