import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
	const dispatch = useDispatch();
	const [error, setError] = useState("");

	const [formData, setFormData] = useState({
		firstName: user?.firstName,
		lastName: user?.lastName,
		gender: user?.gender,
		age: user?.age,
		about: user?.about,
		skills: user?.skills,
		photoUrl: user?.photoUrl,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		// Send data to backend or update global state
		console.log("Submitted Profile:", formData);
		try {
			const res = await axios.patch(`${BASE_URL}/profile/edit`, formData, {
				withCredentials: true,
			});
			console.log(res);
			dispatch(addUser(res?.data?.data));
		} catch (err) {
			//
			console.log(err);
			setError(err?.response?.data);
		}
	};

	return (
		<div className="flex justify-center my-10 gap-10">
			<div className="max-w-2xl p-8 bg-base-200 rounded-box shadow-lg">
				<h1 className="text-3xl font-semibold text-center text-primary mb-8">
					Edit Your Profile
				</h1>
				<form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
					<div className="form-control grid grid-rows-2">
						<label className="label font-medium">First Name</label>
						<input
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
							type="text"
							placeholder="e.g. John"
							className="input input-bordered"
							required
						/>
					</div>

					<div className="form-control grid grid-rows-2">
						<label className="label font-medium">Last Name</label>
						<input
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
							type="text"
							placeholder="e.g. Doe"
							className="input input-bordered"
							required
						/>
					</div>

					<div className="form-control md:col-span-2">
						<label className="label font-medium">Gender</label>
						<select
							name="gender"
							value={formData.gender}
							onChange={handleChange}
							className="select select-bordered w-full"
							required
						>
							<option value="" disabled>
								Select your gender
							</option>
							<option>male</option>
							<option>female</option>
							<option>other</option>
						</select>
					</div>

					<div className="form-control grid grid-rows-2">
						<label className="label font-medium">Age</label>
						<input
							name="age"
							value={formData.age}
							onChange={handleChange}
							type="number"
							min="0"
							placeholder="Your age"
							className="input input-bordered"
						/>
					</div>

					<div className="form-control grid grid-rows-[auto_1fr] md:col-span-2">
						<label className="label font-medium">About</label>
						<textarea
							name="about"
							value={formData.about}
							onChange={handleChange}
							placeholder="A brief introduction about yourself"
							className="textarea textarea-bordered h-28"
						/>
					</div>
					<div className="form-control grid grid-rows-2 md:col-span-2">
						<label className="label font-medium">Profile Photo URL</label>
						<input
							name="photoUrl"
							value={formData.photoUrl}
							onChange={handleChange}
							type="url"
							placeholder="https://example.com/your-photo.jpg"
							className="input input-bordered"
						/>
					</div>

					<div className="form-control grid grid-rows-2 md:col-span-2">
						<label className="label font-medium">Skills</label>
						<input
							name="skills"
							value={formData.skills}
							onChange={handleChange}
							type="text"
							placeholder="e.g. JavaScript, UX Design, Communication"
							className="input input-bordered"
						/>
					</div>

					{error && <p className="text-warning text-center">{error}</p>}
					<div className="md:col-span-2 flex justify-center mt-4">
						<button
							type="submit"
							className="btn btn-primary w-full md:w-auto px-8"
						>
							Save Profile
						</button>
					</div>
				</form>
			</div>

			<UserCard user={formData} />
		</div>
	);
};

export default EditProfile;
