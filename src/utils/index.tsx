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

export const compareObjectKeys = (obj1: any, obj2: any): boolean =>
	Object.keys(obj1).length === Object.keys(obj2).length &&
	Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && obj2[key] === obj1[key]);

export const isEmptyObject = (obj: object) => Object.keys(obj).length == 0;

export const removeEmptyKeys = <T extends { [key: string]: any }>({
	objectToCheck,
	restrictedKeys = {
		false: 1,
		0: 1,
		null: 1,
		undefined: 1,
		"": 1,
		NaN: 1,
	},
	keysToRemainUnchecked = {},
}: {
	objectToCheck: T;
	restrictedKeys?: { [key: string]: any };
	keysToRemainUnchecked?: { [keys: string]: number };
}) =>
	Object.keys(objectToCheck).reduce((accumulator: Partial<T>, current: keyof Partial<T>) => {
		if (
			keysToRemainUnchecked[current as string] ||
			(objectToCheck.hasOwnProperty(current) && !restrictedKeys[objectToCheck[current]])
		) {
			accumulator[current] = objectToCheck[current];
		}
		return accumulator;
	}, {});
