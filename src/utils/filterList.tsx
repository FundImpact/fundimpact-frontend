//the value of a key of filterListObject can be string or string array
//if the value of filterListObject key is array then use filter to remove the element
//otherwise set the value to empty string. If the value is array then the index would be given as
//argument
export const removeFilterListObjectElements = ({
	filterListObject,
	key,
	index,
}: {
	filterListObject: {
		[key: string]: string | string[];
	};
	key: string;
	index?: number;
}) => {
	if (Array.isArray(filterListObject[key])) {
		filterListObject[key] = (filterListObject[key] as string[]).filter((ele, i) => index !== i);
	} else {
		filterListObject[key] = "";
	}
	return { ...filterListObject };
};
