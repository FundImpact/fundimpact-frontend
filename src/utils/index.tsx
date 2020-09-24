import formatDistanceToNow from "date-fns/formatDistanceToNow";

export const months: { [key: number]: string } = {
	1: "JAN",
	2: "FEB",
	3: "MAR",
	4: "APR",
	5: "MAY",
	6: "JUN",
	7: "JUL",
	8: "AUG",
	9: "SEPT",
	10: "OCT",
	11: "NOV",
	12: "DEC",
};

export const getToken = (): string | null => {
	let user = localStorage.getItem("user");
	if (user) {
		const { jwt } = JSON.parse(user);
		if (jwt) return jwt;
	}
	return null;
};

export const getTodaysDate = (dateArg?: Date, getMonth: boolean = false): string => {
	let date = dateArg ? new Date(dateArg) : new Date();
	if (getMonth) {
		return (
			date.getDate() +
			" " +
			(getMonth ? months[date.getUTCMonth() + 1] : date.getUTCMonth() + 1) +
			" " +
			date.getFullYear()
		)
			.split("-")
			.map((ele: string) => (ele.length > 1 ? ele : "0" + ele))
			.join("-");
	}
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

export function getLastUpdatedInWords(date: Date) {
	// /*2017-12-03T10:15:30.000Z example date*/
	if (!date) return;

	return formatDistanceToNow(new Date(date), {
		includeSeconds: true,
	});
}

export function abbreviateNumber(number: number | string) {
	var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];
	number = Number(number);
	// what tier? (determines SI symbol)
	var tier = (Math.log10(number) / 3) | 0;

	// if zero, we don't need a suffix
	if (tier == 0) return number;

	// get suffix and determine scale
	var suffix = SI_SYMBOL[tier];
	var scale = Math.pow(10, tier * 3);

	// scale the number
	var scaled = number / scale;

	// format number and add suffix
	return scaled.toFixed(1) + suffix;
}

export const getMyColor = () => {
	return "#" + Math.floor(Math.random() * 16777215).toString(16);
};
