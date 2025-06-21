import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";
import { useEffect } from "react";

const Requests = () => {
	const requests = useSelector((store) => store.requests);
	const dispatch = useDispatch();

	const fetchRequests = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/user/requests/received`, {
				withCredentials: true,
			});
			dispatch(addRequests(res?.data?.data));
		} catch (err) {
			//
		}
	};

	useEffect(() => {
		fetchRequests();
	}, []);

	if (!requests) return;
	if (requests.length === 0) return <div>No Requests Found</div>;

	return (
		<div className="text-center my-18">
			<h1 className="font-bold text-white text-3xl">Connection Requests</h1>

			{requests.map((request) => {
				const { _id, firstName, lastName, age, gender, about, photoUrl } =
					request.fromUserId;
				return (
					<div
						key={_id}
						className="flex justify-between items-center m-4 p-4 bg-base-200 rounded-lg max-w-1/2 mx-auto"
					>
						<div>
							<img
								src={photoUrl}
								className="w-20 h-20 rounded-full"
								alt="photo"
							/>
						</div>
						<div className="text-left mx-4">
							<h2 className="font-bold text-xl">
								{firstName + " " + lastName}
							</h2>
							<p>{about}</p>
							{age && gender && <p>{age + " " + gender}</p>}
							<div>
								<button className="btn btn-secondary mx-2">Accept</button>
								<button className="btn btn-primary mx-2">Reject</button>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Requests;
