import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Components/Home";
import OperationDetails from "./Components/OperationDetails";
import StopWatch from "./Components/StopWatch/StopWatch";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/operation-details" element={<OperationDetails />} />
				<Route path="/stopwatch" element={<StopWatch />} />
			</Routes>
		</Router>
	);
}

export default App;
