import React, { useState } from "react";
import BudgetMasterView from "./BudgetMasterView";

function BudgetMasterContainer() {
	//change it to object
	const [tableFilterList, setTableFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		description: "",
	});

	const removeFilteListElements = (elementToDelete: keyof { [key: string]: string }) => {
		setTableFilterList((filterListObject) => {
			filterListObject[elementToDelete] = "";
			return { ...filterListObject };
		});
	};

	return (
		<div>
			<BudgetMasterView
				tableFilterList={tableFilterList}
				setTableFilterList={setTableFilterList}
				removeFilteListElements={removeFilteListElements}
			/>
		</div>
	);
}

export default BudgetMasterContainer;
