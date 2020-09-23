import React, { useState } from "react";
import DeliverableMasterView from "./DeliverableMasterView";

function DeliverablMasterContainer() {
	const [deliverableCategoryFilterList, setDeliverableCategoryFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		description: "",
	});
	const [deliverableUnitFilterList, setDeliverableUnitFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		description: "",
	});
	const [value, setValue] = React.useState<number>(0);

	const removeFilteListElements = (elementToDelete: keyof { [key: string]: string }) => {
		value === 0 &&
			setDeliverableCategoryFilterList((deliverableCategoryFilterListObject) => {
				deliverableCategoryFilterListObject[elementToDelete] = "";
				return { ...deliverableCategoryFilterListObject };
			});

		value === 1 &&
			setDeliverableUnitFilterList((deliverableUnitFilterListObject) => {
				deliverableUnitFilterListObject[elementToDelete] = "";
				return { ...deliverableUnitFilterListObject };
			});
	};

	return (
		<DeliverableMasterView
			value={value}
			deliverableCategoryFilterList={deliverableCategoryFilterList}
			deliverableUnitFilterList={deliverableUnitFilterList}
			removeFilteListElements={removeFilteListElements}
			setDeliverableCategoryFilterList={setDeliverableCategoryFilterList}
			setDeliverableUnitFilterList={setDeliverableUnitFilterList}
			setValue={setValue}
		/>
	);
}

export default DeliverablMasterContainer;
