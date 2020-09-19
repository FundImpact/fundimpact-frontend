import React from "react";
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
		<Box key={index} mx={1}>
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
}: {
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	selectedDeliverableCategory: React.MutableRefObject<IDeliverableCategoryData | null>;
	initialValues: IDeliverable;
	deliverableCategoryList: IDeliverableCategoryData[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	filterList: {
		[key: string]: string;
	};
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) {
	return (
		<>
			{!collapsableTable && (
				<Grid container>
					<Grid item xs={11}>
						<Box my={2} display="flex">
							{Object.entries(filterList).map((element) => {
								if (element[1] && typeof element[1] == "string") {
									return chipArr({
										removeChip: (index: number) => {
											removeFilterListElements(element[0]);
										},
										name: element[0].slice(0, 4),
										list: [element[1]],
									});
								}
							})}
						</Box>
					</Grid>
					<Grid item xs={1}>
						<Box mt={2}>
							<FilterList
								initialValues={{
									name: "",
									code: "",
									description: "",
								}}
								setFilterList={setFilterList}
								inputFields={deliverableCategoryInputFields}
							/>
						</Box>
					</Grid>
				</Grid>
			)}
			<CommonTable
				tableHeadings={collapsableTable ? tableHeadings : tableHeadings.slice(1)}
				valuesList={deliverableCategoryList}
				rows={rows}
				selectedRow={selectedDeliverableCategory}
				toggleDialogs={toggleDialogs}
				editMenuName={["Edit Deliverable Category"]}
				collapsableTable={collapsableTable}
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
