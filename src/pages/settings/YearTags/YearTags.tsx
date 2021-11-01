import React, { useState } from "react";
import AddButton from "../../../components/Dasboard/AddButton";
import YearTagTable from "../../../components/Table/YearTag";
import { FORM_ACTIONS } from "../../../models/constants";
import { FormattedMessage } from "react-intl";
import { Box, Grid, Typography } from "@material-ui/core";
import FilterList from "../../../components/FilterList";
import { yeartagInputFields } from "./inputFields.json";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import YearTag from "../../../components/YearTag";
import { YEARTAG_ACTIONS } from "../../../utils/access/modules/yearTag/actions";
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

const YearTags = () => {
	const [tableFilterList, setTableFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		name: "",
		type: "",
	});

	// console.log(" tableFilterList; ", tableFilterList);

	const yearTagsFindAccess = userHasAccess(MODULE_CODES.YEAR_TAG, YEARTAG_ACTIONS.FIND_YEAR_TAG);

	const removeFilterListElements = (key: string, index?: number) =>
		setTableFilterList((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);

	return (
		<Box p={2}>
			<Grid container>
				<Grid item xs={11}>
					<Typography variant="h4">
						<Box mt={2} fontWeight="fontWeightBold">
							<FormattedMessage
								id="yeartag"
								defaultMessage="Year Tag"
								description="This text is the heading of year tag table"
							/>
						</Box>
					</Typography>
				</Grid>
				<Grid item xs={1}>
					<Box mt={2}>
						{yearTagsFindAccess && (
							<FilterList
								setFilterList={setTableFilterList}
								inputFields={yeartagInputFields}
								initialValues={{
									name: "",
									type: "",
								}}
							/>
						)}
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

			{yearTagsFindAccess && <YearTagTable tableFilterList={tableFilterList} />}

			{yearTagsFindAccess && (
				<AddButton
					createButtons={[]}
					buttonAction={{
						dialog: ({
							open,
							handleClose,
						}: {
							open: boolean;
							handleClose: () => void;
						}) => (
							<YearTag
								open={open}
								handleClose={handleClose}
								formAction={FORM_ACTIONS.CREATE}
							/>
						),
					}}
				/>
			)}
		</Box>
	);
};

export default YearTags;
