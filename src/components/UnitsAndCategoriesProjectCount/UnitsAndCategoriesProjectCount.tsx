import React from "react";

function UnitsAndCategoryProjectCount({ data }: { data?: number }) {
	console.log("countdata", data);
	return <div>{data || "-"}</div>;
}

export default UnitsAndCategoryProjectCount;
