import validator from "validator";

export const validateSignUpData = (req) => {
	const { firstName, lastName, emailId, password } = req.body;

	if (!firstName || !lastName) throw new Error("Name is not valid");
	else if (!validator.isEmail(emailId)) throw new Error("Email is not valid");
	else if (!validator.isStrongPassword(password))
		throw new Error("Password is not strong");
};

export const validateProfileData = (req) => {
	const allowedEditFields = [
		"firstName",
		"lastName",
		"emailId",
		"photoUrl",
		"gender",
		"about",
		"skills",
	];

	const isEditAllowed = Object.keys(req.body).every((k) =>
		allowedEditFields.includes(k)
	);

	return isEditAllowed;
};
