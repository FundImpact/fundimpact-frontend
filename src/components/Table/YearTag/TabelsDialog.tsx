import React, { memo, useEffect, useState, useCallback } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Box,
	IconButton,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useLazyQuery } from "@apollo/client";
import { ITablesDialogProps, IYearTag, IYearTagCountry } from "../../../models/yearTags";
import { GET_YEARTAG_COUNTRIES_BY_YEARTAG_ID } from "../../../graphql/yearTags/query";

const TabelsDialog = ({ open, handleClose, yearTag }: any) => {
	// const TabelsDialog = ({ open, handleClose, yearTag }: ITablesDialogProps) => {
	const [getCountries, { data }] = useLazyQuery(GET_YEARTAG_COUNTRIES_BY_YEARTAG_ID);

	useEffect(() => {
		getCountries({
			variables: {
				filter: {
					year_tag: {
						id: yearTag?.id,
					},
				},
			},
		});
	}, []);

	// useEffect(() => {
	// 	if (data) {
	// 		console.log("DAta: ", data);
	// 	}
	// }, [data]);

	return (
		<Dialog
			open={open}
			fullWidth
			keepMounted
			onClose={handleClose}
			aria-describedby="alert-dialog-slide-description"
		>
			<Box display="flex" justifyContent="space-between">
				<DialogTitle>{"Related countries"}</DialogTitle>
				<IconButton onClick={handleClose}>
					<CloseIcon />
				</IconButton>
			</Box>
			<DialogContent>
				{yearTag ? (
					// {data && data.yearTagsCountries.length > 0 ? (
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Id</TableCell>
								<TableCell>Country Name</TableCell>
								<TableCell>Country Code</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{/* {data?.yearTagsCountries?.map((country: IYearTagCountry) => ( */}
							{yearTag?.map((country: any) => (
								// console.log("innn", country)
								<TableRow key={country?.id}>
									{/* <TableCell>{country?.id}</TableCell> */}
									<TableCell>{country?.name}</TableCell>
									<TableCell>{country?.code ? country?.code : "-"}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<h2>No Countries found</h2>
				)}
			</DialogContent>
		</Dialog>
	);
};

const YearTagCountries = ({ yearTag }: { yearTag: any }) => {
	const [open, setOpen] = useState<boolean>(false);

	const openDialog = () => {
		setOpen(true);
	};

	const closeDialog = () => {
		setOpen(false);
	};

	return (
		<>
			<TabelsDialog open={open} handleClose={closeDialog} yearTag={yearTag} />
			<IconButton onClick={openDialog}>
				<VisibilityIcon />
			</IconButton>
		</>
	);
};

export default YearTagCountries;
