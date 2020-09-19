import React, { useState, useEffect } from "react";
import AddButton from "../../../components/Dasboard/AddButton";
import Donor from "../../../components/Donor";
import DonorTable from "../../../components/Table/Donor";
import { FORM_ACTIONS } from "../../../models/constants";
import { FormattedMessage } from "react-intl";
import { Box, Grid, Typography, Avatar, Chip } from "@material-ui/core";
import FilterList from "../../../components/FilterList";
import { donorInputFields } from "./inputFields.json";
import { GET_COUNTRY_LIST } from "../../../graphql";
import { useLazyQuery } from "@apollo/client";

const chipArray = ({
	arr,
	name,
	removeChip,
}: {
	arr: string[];
	name: string;
	removeChip: (index: number) => void;
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
				onDelete={() => removeChip(index)}
			/>
		</Box>
	));
};

let countryHash: { [key: string]: string } = {};

const mapIdToName = (arr: { id: string; name: string }[], obj: { [key: string]: string }) => {
	arr.reduce((accumulator: { [key: string]: string }, current: { id: string; name: string }) => {
		accumulator[current.id] = current.name;
		return accumulator;
	}, obj);
};

export const DonorContainer = () => {
	const [tableFilterList, setTableFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		name: "",
		legal_name: "",
		short_name: "",
		country: [],
	});

	const [getCountryList, { data: countries }] = useLazyQuery(GET_COUNTRY_LIST, {
		onCompleted: ({ countryList }) => {
			donorInputFields[3].optionsArray = countryList;
			mapIdToName(countryList, countryHash);
		},
	});

	const removeFilterListElements = (key: string, index?: number) => {
		setTableFilterList((obj) => {
			if (Array.isArray(obj[key])) {
				obj[key] = (obj[key] as string[]).filter((ele, i) => index != i);
			} else {
				obj[key] = "";
			}
			return { ...obj };
		});
	};
	donorInputFields[3].optionsArray = countries?.countryList || [];
	
	useEffect(() => {
		getCountryList();
	}, []);

	return (
		<>
			<Grid container>
				<Grid item xs={11}>
					<Typography variant="h4">
						<Box mt={2} fontWeight="fontWeightBold">
							<FormattedMessage
								id="donortableHeading"
								defaultMessage="Donors"
								description="This text is the heding of donor table"
							/>
						</Box>
					</Typography>
				</Grid>
				<Grid item xs={1}>
					<Box mt={2}>
						<FilterList
							setFilterList={setTableFilterList}
							inputFields={donorInputFields}
							initialValues={{
								name: "",
								legal_name: "",
								short_name: "",
								country: [],
							}}
						/>
					</Box>
				</Grid>
				<Grid item xs={12}>
					<Box my={2} display="flex">
						{Object.entries(tableFilterList).map((element) => {
							if (element[1] && typeof element[1] == "string") {
								return chipArray({
									arr: [element[1]],
									name: element[0].slice(0, 4),
									removeChip: (index: number) => {
										removeFilterListElements(element[0]);
									},
								});
							}
							if (element[1] && Array.isArray(element[1])) {
								if (element[0] == "country") {
									return chipArray({
										arr: element[1].map((ele) => countryHash[ele]),
										name: "co",
										removeChip: (index: number) => {
											removeFilterListElements(element[0], index);
										},
									});
								}
							}
						})}
					</Box>
				</Grid>
			</Grid>

			<DonorTable tableFilterList={tableFilterList} />
			<AddButton
				createButtons={[]}
				buttonAction={{
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<Donor
							open={open}
							handleClose={handleClose}
							formAction={FORM_ACTIONS.CREATE}
						/>
					),
				}}
			/>
		</>
	);
};
