import { BrowserRouter, Route, Routes } from "react-router";
import { Provider } from "react-redux";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import { store } from "./utils/appStore";

function App() {
	return (
		<Provider store={store}>
			<BrowserRouter basename="/">
				<Routes>
					<Route path="/" element={<Body />}>
						<Route index element={<Feed />} />
						<Route path="login" element={<Login />} />
						<Route path="profile" element={<Profile />} />
						<Route path="connections" element={<Connections />} />
						<Route path="requests" element={<Profile />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</Provider>
	);
}

export default App;
