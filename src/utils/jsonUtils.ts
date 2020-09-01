export const resolveJSON = (obj: { [key: string]: any }, keys: string) => {
	return keys.split(".").reduce((o, key) => o && o[key], obj);
};
