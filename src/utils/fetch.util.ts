/**
 *
 * @description Do not use this for nested objects or array. It is only for simple objects.
 */
export const convertObjectToQueryParams = (object: { [key: string]: number | string }) => {
	return Object.keys(object)
		.map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(object[k]))
		.join("&");
};
