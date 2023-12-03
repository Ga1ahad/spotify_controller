import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import CreateRoom from './CreateRoom.jsx'
import JoinRoom from './JoinRoom.jsx'

export default function Home() {
    return(
        <Router>
            <Routes>
                <Route path="/create" element={<CreateRoom />} />
                <Route path="/join" element={<JoinRoom />} />
            </Routes>
        </Router>
    )
}
