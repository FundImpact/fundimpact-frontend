import React from "react";

function UnitsAndCategoryProjectCount({ data }: { data?: number }) {
	return <div>{data || "-"}</div>;
}

export default UnitsAndCategoryProjectCount;
