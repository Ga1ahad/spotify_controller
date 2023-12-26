import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import CreateRoom from './CreateRoom.jsx'
import JoinRoom from './JoinRoom.jsx'
import ViewRoom from './ViewRoom.jsx'

export default function Home() {
    return(
        <Router>
            <Routes>
                <Route path="/create" element={<CreateRoom />} />
                <Route path="/join" element={<JoinRoom />} />
                <Route path="/room/:roomCode" element={<ViewRoom />} />
            </Routes>
        </Router>
    )
}
