export const getToken = (): string | null => {
	let user = localStorage.getItem("user");
	if (user) {
		const { jwt } = JSON.parse(user);
		if (jwt) return jwt;
	}
	return null;
};

export const getTodaysDate = (dateArg?: Date): string => {
	let date = dateArg ? new Date(dateArg) : new Date();
	return (date.getFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getDate())
		.split("-")
		.map((ele: string) => (ele.length > 1 ? ele : "0" + ele))
		.join("-");
};
