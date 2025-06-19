import { useState } from "react";
import axios from "axios";

const Login = () => {
	const [emailId, setEmailId] = useState("test.user1@example.com");
	const [password, setPassword] = useState("Test1234!");

	const handleLogin = async () => {
		try {
			const res = await axios.post(
				"http://localhost:3000/login",
				{
					emailId,
					password,
				},
				{
					withCredentials: true,
				}
			);

			console.log(res);
		} catch (err) {
			console.log(err.message);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-base-300 px-4">
			<div className="card w-full max-w-sm bg-base-100 text-base-content shadow-lg rounded-2xl p-10 space-y-8">
				<h2 className="text-2xl font-semibold text-center tracking-tight">
					Log In
				</h2>
				<form
					className="space-y-6"
					aria-label="Login form"
					onSubmit={handleLogin}
				>
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
					<button
						type="submit"
						className="btn btn-primary w-full text-sm tracking-wide"
					>
						Login
					</button>
				</form>
				<p className="text-center text-sm text-base-content/70">
					Don’t have an account?
					<a href="#" className="link link-primary font-medium ml-2">
						Sign up
					</a>
				</p>
			</div>
		</div>
	);
};

export default Login;
