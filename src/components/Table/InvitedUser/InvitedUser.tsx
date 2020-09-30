import { Chip, TableCell, IconButton, Box, Avatar, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { invitedUserTable } from "../constants";
import FITable from "../FITable";
import { GET_INVITED_USER_LIST, GET_ROLES_BY_ORG } from "../../../graphql/UserRoles/query";
import { useQuery } from "@apollo/client";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { invitedUserFilter } from "./inputFields.json";
import { removeFilterListObjectElements } from "../../../utils/filterList";
import FilterListContainer from "../../FilterList";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

let roleHash: { [key: string]: string } = {};

const chipArray = ({
	arr,
	name,
	removeChips,
}: {
	removeChips: (index: number) => void;
	name: string;
	arr: string[];
}) => {
	return arr.map((element, index) => (
		<Box key={index} m={1} data-testid="invitedUserChip">
			<Chip
				onDelete={() => removeChips(index)}
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
			/>
		</Box>
	));
};

const createChipArray = ({
	filterListObjectKeyValuePair,
	removeFilterListElements,
}: {
	filterListObjectKeyValuePair: any;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) => {
	if (filterListObjectKeyValuePair[1] && Array.isArray(filterListObjectKeyValuePair[1])) {
		if (filterListObjectKeyValuePair[0] === "role") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map((ele) => roleHash[ele]),
				name: "role",
				removeChips: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
	}
	if (filterListObjectKeyValuePair[1] && typeof filterListObjectKeyValuePair[1] === "string") {
		return chipArray({
			name: filterListObjectKeyValuePair[0].slice(0, 4),
			removeChips: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
			arr: [filterListObjectKeyValuePair[1]],
		});
	}

	return null;
};

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

export default function InvitedUserTable() {
	const [rows, setRows] = useState<React.ReactNode[]>([]);
	const dashBoardData = useDashBoardData();
	const [queryFilter, setQueryFilter] = useState({});
	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		email: "",
		role: [],
	});

	useQuery(GET_ROLES_BY_ORG, {
		variables: { filter: { organization: dashBoardData?.organization?.id } },
		onCompleted(data) {
			if (data?.organizationRoles) {
				invitedUserFilter[1].optionsArray = data.organizationRoles;
				roleHash = mapIdToName(data.organizationRoles, roleHash);
			}
		},
		onError(err) {
			console.log("role", err);
		},
	});

	const { data: invitedUserList } = useQuery(GET_INVITED_USER_LIST, {
		variables: {
			sort: "name",
			limit: 5,
			start: 0,
			filter: queryFilter,
		},
	});

	const removeFilterListElements = (key: string, index?: number) =>
		setFilterList((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);

	useEffect(() => {
		if (filterList) {
			let newFilterListObject: { [key: string]: string | string[] } = {};
			for (let key in filterList) {
				if (filterList[key] && filterList[key].length) {
					newFilterListObject[key] = filterList[key];
				}
			}
			setQueryFilter({
				...newFilterListObject,
			});
		}
	}, [filterList]);
	useEffect(() => {
		let row: any = [];
		invitedUserList?.userList?.forEach((user: any, index: number) => {
			let col = [
				<TableCell>{index + 1}</TableCell>,
				<TableCell>{user?.email}</TableCell>,
				<TableCell>
					<Box mr={1}>
						<Chip label={user?.role?.name} color="primary" size="small" />
					</Box>
				</TableCell>,
				<TableCell>
					{user?.confirmed ? (
						<CheckIcon color="secondary" />
					) : (
						<CloseIcon color="error" />
					)}
				</TableCell>,
				<TableCell>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</TableCell>,
			];
			row.push(col);
		});
		setRows(row);
	}, [invitedUserList]);
	return (
		<>
			<Grid container>
				<Grid item xs={11}>
					<Box my={2} display="flex" flexWrap="wrap">
						{Object.entries(filterList).map((filterListObjectKeyValuePair) =>
							createChipArray({
								filterListObjectKeyValuePair,
								removeFilterListElements,
							})
						)}
					</Box>
				</Grid>
				<Grid item xs={1}>
					<Box mt={2}>
						<FilterListContainer
							initialValues={{
								email: "",
								role: [],
							}}
							setFilterList={setFilterList}
							inputFields={invitedUserFilter}
						/>
					</Box>
				</Grid>
			</Grid>
			<FITable tableHeading={invitedUserTable} rows={rows} />
		</>
	);
}
