import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
	const dispatch = useDispatch();
	const connections = useSelector((store) => store.connections);

	const fetchConnections = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/user/connections`, {
				withCredentials: true,
			});
			dispatch(addConnections(res?.data?.data));
		} catch (err) {
			//
		}
	};

	useEffect(() => {
		fetchConnections();
	}, []);

	if (!connections) return;
	if (connections.length === 0) return <div>No Connections Found</div>;

	return (
		<div className="text-center my-18">
			<h1 className="font-bold text-white text-3xl">Connections</h1>

			{connections.map((connection) => {
				const { _id, firstName, lastName, age, gender, about, photoUrl } =
					connection;
				return (
					<div
						key={_id}
						className="flex m-4 p-4 bg-base-200 rounded-lg max-w-1/2 mx-auto"
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
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Connections;
