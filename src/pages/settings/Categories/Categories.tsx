import React, { useState } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import FilterList from "../../../components/FilterList";
import CategoriesTable from "../../../components/Table/Categories";
import AddButton from "../../../components/Dasboard/AddButton";
import Category from "../../../components/Category";
import { FORM_ACTIONS } from "../../../models/constants";
import { categoryInputFields } from "./inputField.json";
import { removeFilterListObjectElements } from "../../../utils/filterList";
import ChipArray from "../../../components/Chips";

const createChipArray = ({
	tableFilterListObjectKeyValuePair,
	removeFilterListElements,
}: {
	tableFilterListObjectKeyValuePair: any;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) => {
	if (
		tableFilterListObjectKeyValuePair[1] &&
		typeof tableFilterListObjectKeyValuePair[1] == "string"
	) {
		return ChipArray({
			arr: [tableFilterListObjectKeyValuePair[1]],
			name: tableFilterListObjectKeyValuePair[0].slice(0, 4),
			removeChips: (index: number) => {
				removeFilterListElements(tableFilterListObjectKeyValuePair[0]);
			},
		});
	}
};

const Categories = () => {
	const [tableFilterList, setTableFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		name: "",
		code: "",
		description: "",
	});

	const removeFilterListElements = (key: string, index?: number) => {
		setTableFilterList((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);
	};

	return (
		<Box p={2}>
			<Grid container>
				<Grid item xs={11}>
					<Typography variant="h4">
						<Box mt={2} fontWeight="fontWeightBold">
							<FormattedMessage
								id="categories"
								defaultMessage="Categories"
								description="This text will be heading of categories page"
							/>
						</Box>
					</Typography>
				</Grid>
				<Grid item xs={1}>
					<Box mt={2}>
						<FilterList
							setFilterList={setTableFilterList}
							inputFields={categoryInputFields}
							initialValues={{
								name: "",
								code: "",
								description: "",
							}}
						/>
					</Box>
				</Grid>
				<Grid item xs={12}>
					<Box my={2} display="flex">
						{Object.entries(tableFilterList).map((tableFilterListObjectKeyValuePair) =>
							createChipArray({
								tableFilterListObjectKeyValuePair,
								removeFilterListElements,
							})
						)}
					</Box>
				</Grid>
			</Grid>
			<CategoriesTable tableFilterList={tableFilterList} />
			<AddButton
				createButtons={[]}
				buttonAction={{
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<Category
							open={open}
							handleClose={handleClose}
							formAction={FORM_ACTIONS.CREATE}
						/>
					),
				}}
			/>
		</Box>
	);
};

export default Categories;
