import React, { useEffect } from "react";
import CommonTable from "../CommonTable";
import { IDeliverableCategoryData, IDeliverable } from "../../../models/deliverable/deliverable";
import Deliverable from "../../Deliverable/Deliverable";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import DeliverableUnitTable from "../DeliverableUnitTable";
import { deliverableCategoryTableHeading as tableHeadings } from "../constants";
import UnitsAndCategoriesProjectCount from "../../UnitsAndCategoriesProjectCount";
import { Grid, Box, Chip, Avatar } from "@material-ui/core";
import FilterList from "../../FilterList";
import { deliverableCategoryInputFields } from "../../../pages/settings/DeliverableMaster/inputFields.json";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";

const rows = [
	{ valueAccessKey: "name" },
	{ valueAccessKey: "code" },
	{ valueAccessKey: "description" },
	{
		valueAccessKey: "",
		renderComponent: (deliverableCategory: IDeliverableCategoryData) => (
			<UnitsAndCategoriesProjectCount deliverableCategoryId={deliverableCategory.id} />
		),
	},
	{ valueAccessKey: "" },
];

const chipArr = ({
	list,
	name,
	removeChip,
}: {
	list: string[];
	name: string;
	removeChip: (index: number) => void;
}) => {
	return list.map((element, index) => (
		<Box key={index} m={1}>
			<Chip
				label={element}
				avatar={
					<Avatar
						style={{
							width: "30px",
							height: "30px",
						}}
					>
						<span>{name}</span>
					</Avatar>
				}
				onDelete={() => removeChip(index)}
			/>
		</Box>
	));
};

const createChipArray = ({
	removeFilterListElements,
	filterListObjectKeyValuePair,
}: {
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	filterListObjectKeyValuePair: any;
}) => {
	if (filterListObjectKeyValuePair[1] && typeof filterListObjectKeyValuePair[1] == "string") {
		return chipArr({
			removeChip: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
			list: [filterListObjectKeyValuePair[1]],
			name: filterListObjectKeyValuePair[0].slice(0, 4),
		});
	}
	return null;
};
let deliverableCategoryTableEditMenu: string[] = [];

function DeliverableCategoryView({
	toggleDialogs,
	openDialogs,
	selectedDeliverableCategory,
	initialValues,
	deliverableCategoryList,
	collapsableTable,
	changePage,
	loading,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	filterList,
	setFilterList,
	removeFilterListElements,
	deliverableCategoryEditAccess,
	deliverableUnitFindAccess,
}: {
	count: number;
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	selectedDeliverableCategory: React.MutableRefObject<IDeliverableCategoryData | null>;
	initialValues: IDeliverable;
	collapsableTable: boolean;
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
	changePage: (prev?: boolean) => void;
	deliverableCategoryList: IDeliverableCategoryData[];
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	filterList: {
		[key: string]: string;
	};

	removeFilterListElements: (key: string, index?: number | undefined) => void;
	deliverableCategoryEditAccess: boolean;
	deliverableUnitFindAccess: boolean;
}) {
	useEffect(() => {
		if (deliverableCategoryEditAccess) {
			deliverableCategoryTableEditMenu = ["Edit Deliverable Category"];
		}
	}, [deliverableCategoryEditAccess]);

	return (
		<>
			{!collapsableTable && (
				<Grid container>
					<Grid item xs={11}>
						<Box my={2} display="flex" flexWrap="wrap">
							{Object.entries(filterList).map((filterListObjectKeyValuePair) =>
								createChipArray({
									removeFilterListElements,
									filterListObjectKeyValuePair,
								})
							)}
						</Box>
					</Grid>
					<Grid item xs={1}>
						<Box mt={2}>
							<FilterList
								initialValues={{
									code: "",
									name: "",
									description: "",
								}}
								inputFields={deliverableCategoryInputFields}
								setFilterList={setFilterList}
							/>
						</Box>
					</Grid>
				</Grid>
			)}
			<CommonTable
				tableHeadings={collapsableTable && deliverableUnitFindAccess ? tableHeadings : tableHeadings.slice(1)}
				valuesList={deliverableCategoryList}
				rows={rows}
				selectedRow={selectedDeliverableCategory}
				toggleDialogs={toggleDialogs}
				editMenuName={deliverableCategoryTableEditMenu}
				collapsableTable={collapsableTable && deliverableUnitFindAccess}
				changePage={changePage}
				loading={loading}
				count={count}
				order={order}
				setOrder={setOrder}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
			>
				<Deliverable
					type={DELIVERABLE_ACTIONS.UPDATE}
					handleClose={() => toggleDialogs(0, false)}
					open={openDialogs[0]}
					data={initialValues}
				/>
				{(rowData: { id: string }) => (
					<>
						<DeliverableUnitTable rowId={rowData.id} collapsableTable={false} />
					</>
				)}
			</CommonTable>
		</>
	);
}

export default DeliverableCategoryView;
