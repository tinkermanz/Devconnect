const UserCard = ({ user }) => {
	const { firstName, lastName, photoUrl, age, gender, about } = user;

	return (
		<div className="card bg-base-300 w-96 shadow-sm">
			<figure>
				<img src={photoUrl} alt="Shoes" />
			</figure>
			<div className="card-body">
				<h2 className="card-title">{firstName + " " + lastName}</h2>
				<p>{about}</p>
				{age && gender(<p>{age + ", " + gender}</p>)}
				<div className="card-actions justify-between">
					<button className="btn btn-primary">Ignore</button>
					<button className="btn btn-secondary">Interested</button>
				</div>
			</div>
		</div>
	);
};

export default UserCard;
