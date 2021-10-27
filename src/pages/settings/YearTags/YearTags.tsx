import React, { useState } from "react";
import AddButton from "../../../components/Dasboard/AddButton";
import YearTagTable from "../../../components/Table/YearTag";
import { FORM_ACTIONS } from "../../../models/constants";
import { FormattedMessage } from "react-intl";
import { Box, Grid, Typography, Avatar, Chip } from "@material-ui/core";
import FilterList from "../../../components/FilterList";
import { yeartagInputFields } from "./inputFields.json";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import YearTag from "../../../components/YearTag";
import { YEARTAG_ACTIONS } from "../../../utils/access/modules/yearTag/actions";

const chipArray = ({
	arr,
	name,
	removeChips,
}: {
	arr: string[];
	name: string;
	removeChips: (index: number) => void;
}) => {
	return arr.map((element, index) => (
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
				onDelete={() => removeChips(index)}
			/>
		</Box>
	));
};

let countryHash: { [key: string]: string } = {};

const mapIdToName = (
	arr: { id: string; name: string }[],
	initialObject: { [key: string]: string }
) => {
	return arr.reduce(
		(accumulator: { [key: string]: string }, current: { id: string; name: string }) => {
			accumulator[current.id] = current.name;
			return accumulator;
		},
		initialObject
	);
};

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
		return chipArray({
			arr: [tableFilterListObjectKeyValuePair[1]],
			name: tableFilterListObjectKeyValuePair[0].slice(0, 4),
			removeChips: (index: number) => {
				removeFilterListElements(tableFilterListObjectKeyValuePair[0]);
			},
		});
	}
	if (
		tableFilterListObjectKeyValuePair[1] &&
		Array.isArray(tableFilterListObjectKeyValuePair[1])
	) {
		if (tableFilterListObjectKeyValuePair[0] === "country") {
			return chipArray({
				arr: tableFilterListObjectKeyValuePair[1].map((ele) => countryHash[ele]),
				name: "co",
				removeChips: (index: number) => {
					removeFilterListElements(tableFilterListObjectKeyValuePair[0], index);
				},
			});
		}
	}
	return null;
};

const YearTags = () => {
	const [tableFilterList, setTableFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		name: "",
		legal_name: "",
		short_name: "",
		country: [],
	});

	const yearTagsFindAccess = userHasAccess(MODULE_CODES.YEAR_TAG, YEARTAG_ACTIONS.FIND_YEAR_TAG);
	// const donorCreateAccess = userHasAccess(MODULE_CODES.DONOR, DONOR_ACTIONS.CREATE_DONOR);

	// const [getCountryList, { data: countries }] = useLazyQuery(GET_COUNTRY_LIST);

	// const removeFilterListElements = (key: string, index?: number) =>
	// 	setTableFilterList((filterListObject) =>
	// 		removeFilterListObjectElements({ filterListObject, key, index })
	// 	);

	// yeartagInputFields[3].optionsArray = countries?.countries || [];

	// if (!Object.keys(countryHash).length && countries?.countries) {
	// 	countryHash = mapIdToName(countries?.countries, countryHash);
	// }

	// useEffect(() => {
	// 	getCountryList();
	// }, [getCountryList]);

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
									label: "",
									type: "",
									start_date: "",
									end_date: "",
									countires: [],
								}}
							/>
						)}
					</Box>
				</Grid>
				{/* <Grid item xs={12}>
					<Box my={2} display="flex">
						{Object.entries(tableFilterList).map((tableFilterListObjectKeyValuePair) =>
							createChipArray({
								tableFilterListObjectKeyValuePair,
								removeFilterListElements,
							})
						)}
					</Box>
				</Grid> */}
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
