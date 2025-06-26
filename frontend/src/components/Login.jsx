import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/constant";

const Login = () => {
	const [isLoginForm, setIsLoginForm] = useState(true);

	const [emailId, setEmailId] = useState("test.user1@example.com");
	const [password, setPassword] = useState("Test1234!");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	const [error, setError] = useState("");

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const res = await axios.post(
				`${BASE_URL}/login`,
				{
					emailId,
					password,
				},
				{
					withCredentials: true,
				}
			);
			dispatch(addUser(res.data.data));
			navigate("/");
		} catch (err) {
			setError(err?.response?.data || "Something went wrong");
		}
	};

	const handleSignup = async () => {
		try {
			const res = await axios.post(
				`${BASE_URL}/signup`,
				{
					firstName,
					lastName,
					emailId,
					password,
				},
				{
					withCredentials: true,
				}
			);

			dispatch(addUser(res.data.data));
			navigate("/profile");
		} catch (err) {
			setError(err?.response?.data || "Something went wrong");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-base-300 px-4">
			<div className="card w-full max-w-sm bg-base-100 text-base-content shadow-lg rounded-2xl p-10 space-y-8">
				<h2 className="text-2xl font-semibold text-center tracking-tight">
					{isLoginForm ? "Login" : "Signup"}
				</h2>
				<form
					className="space-y-6"
					aria-label="Login form"
					onSubmit={isLoginForm ? handleLogin : handleSignup}
				>
					{!isLoginForm && (
						<>
							<div className="form-control">
								<label htmlFor="firstName" className="label">
									<span className="label-text text-sm font-medium">
										FirstName
									</span>
								</label>
								<input
									id="firstName"
									type="text"
									autoComplete="username"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									placeholder="example"
									className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
									required
								/>
							</div>
							<div className="form-control">
								<label htmlFor="lastName" className="label">
									<span className="label-text text-sm font-medium">
										LastName
									</span>
								</label>
								<input
									id="lastName"
									type="text"
									autoComplete="username"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									placeholder="example"
									className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
									required
								/>
							</div>
						</>
					)}
					<div className="form-control">
						<label htmlFor="emailId" className="label">
							<span className="label-text text-sm font-medium">Email</span>
						</label>
						<input
							id="emailId"
							type="email"
							autoComplete="username"
							value={emailId}
							onChange={(e) => setEmailId(e.target.value)}
							placeholder="you@example.com"
							className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
							required
						/>
					</div>
					<div className="form-control">
						<label htmlFor="password" className="label">
							<span className="label-text text-sm font-medium">Password</span>
						</label>
						<input
							id="password"
							type="password"
							placeholder="••••••••"
							value={password}
							autoComplete="current-password"
							onChange={(e) => setPassword(e.target.value)}
							className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
							required
						/>
						<label className="label justify-end">
							<a href="#" className="label-text-alt link link-hover text-xs">
								Forgot password?
							</a>
						</label>
					</div>
					{error && <p className="text-red-500 text-center">{error}</p>}
					<button
						type="submit"
						className="btn btn-primary w-full text-sm tracking-wide"
					>
						{isLoginForm ? "Login" : "Signup"}
					</button>
				</form>
				{isLoginForm ? (
					<p
						className="text-center text-sm text-base-content/70"
						onClick={() => setIsLoginForm((val) => !val)}
					>
						Don’t have an account?
						<a href="#" className="link link-primary font-medium ml-2">
							Signup
						</a>
					</p>
				) : (
					<p
						className="text-center text-sm text-base-content/70"
						onClick={() => setIsLoginForm((val) => !val)}
					>
						Existing user?
						<a href="#" className="link link-primary font-medium ml-2">
							Login here
						</a>
					</p>
				)}
			</div>
		</div>
	);
};

export default Login;
