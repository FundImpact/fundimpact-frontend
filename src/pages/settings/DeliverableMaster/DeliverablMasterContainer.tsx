import React, { useState, useEffect } from "react";
import DeliverableMasterView from "./DeliverableMasterView";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";

function DeliverablMasterContainer() {
	const [deliverableCategoryFilterList, setDeliverableCategoryFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		description: "",
	});

	// console.log("deliverableCategoryFilterList", deliverableCategoryFilterList);

	const [deliverableUnitFilterList, setDeliverableUnitFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		description: "",
	});

	// console.log("deliverableUnitFilterList", deliverableUnitFilterList);

	const deliverableCategoryCreateAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.CREATE_DELIVERABLE_CATEGORY
	);

	// console.log("deliverableCategoryCreateAccess", deliverableCategoryCreateAccess);

	const deliverableUnitCreateAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.CREATE_DELIVERABLE_UNIT
	);

	const deliverableCategoryFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.FIND_DELIVERABLE_CATEGORY
	);

	// console.log("deliverableCategoryFindAccess", deliverableCategoryFindAccess);

	const deliverableUnitFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT
	);

	const [value, setValue] = React.useState<number>(0);

	useEffect(() => {
		if (deliverableCategoryFindAccess) {
			setValue(0);
		} else {
			setValue(1);
		}
	}, [setValue, deliverableCategoryFindAccess]);

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
			deliverableCategoryFindAccess={deliverableCategoryFindAccess}
			deliverableUnitFindAccess={deliverableUnitFindAccess}
			deliverableCategoryCreateAccess={deliverableCategoryCreateAccess}
			deliverableUnitCreateAccess={deliverableUnitCreateAccess}
		/>
	);
}

export default DeliverablMasterContainer;
