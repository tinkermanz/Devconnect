import { BrowserRouter, Route, Routes } from "react-router";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import { Provider } from "react-redux";
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
					</Route>
				</Routes>
			</BrowserRouter>
		</Provider>
	);
}

export default App;
