import { Chip, TableCell, IconButton, Box, Avatar, Grid, TablePagination } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { invitedUserTable } from "../constants";
import FITable from "../FITable";
import {
	GET_INVITED_USER_LIST,
	GET_INVITED_USER_LIST_COUNT,
	GET_ROLES_BY_ORG,
} from "../../../graphql/UserRoles/query";
import { useQuery } from "@apollo/client";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { invitedUserFilter } from "./inputFields.json";
import { removeFilterListObjectElements } from "../../../utils/filterList";
import FilterListContainer from "../../FilterList";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import pagination from "../../../hooks/pagination";
import TableSkeleton from "../../Skeletons/TableSkeleton";
const chipArray = ({
	arr,
	name,
	removeChip,
}: {
	removeChip: (index: number) => void;
	name: string;
	arr: string[];
}) => {
	return arr.map((element, index) => (
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

let roleHash: { [key: string]: string } = {};

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
	filterListObjectKeyValuePair,
	removeFilterListElements,
}: {
	filterListObjectKeyValuePair: any;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) => {
	if (filterListObjectKeyValuePair[1] && typeof filterListObjectKeyValuePair[1] === "string") {
		return chipArray({
			name: filterListObjectKeyValuePair[0].slice(0, 4),
			removeChip: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
			arr: [filterListObjectKeyValuePair[1]],
		});
	}
	if (filterListObjectKeyValuePair[1] && Array.isArray(filterListObjectKeyValuePair[1])) {
		if (filterListObjectKeyValuePair[0] === "role") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map((ele) => roleHash[ele]),
				name: "role",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
	}
	return null;
};

export default function InvitedUserTable() {
	const [rows, setRows] = useState<React.ReactNode[]>([]);
	const dashBoardData = useDashBoardData();
	const [queryFilter, setQueryFilter] = useState({});
	const [invitedUserPage, setInvitedUserPage] = React.useState(0);
	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		email: "",
		role: [],
	});
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");

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

	let {
		count,
		queryData: invitedUserList,
		changePage,
		countQueryLoading,
		queryLoading: loading,
	} = pagination({
		query: GET_INVITED_USER_LIST,
		countQuery: GET_INVITED_USER_LIST_COUNT,
		countFilter: queryFilter,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
	});

	const handleInvitedUserLineChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		if (newPage > invitedUserPage) {
			changePage();
		} else {
			changePage(true);
		}
		setInvitedUserPage(newPage);
	};
	const limit = 10;
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
					<IconButton disabled>
						<MoreVertIcon />
					</IconButton>
				</TableCell>,
			];
			row.push(col);
		});
		setRows(row);
	}, [invitedUserList]);

	let invitedUserTablePagination = (
		<TablePagination
			rowsPerPageOptions={[]}
			colSpan={9}
			count={count}
			rowsPerPage={count > limit ? limit : count}
			page={invitedUserPage}
			onChangePage={handleInvitedUserLineChangePage}
			onChangeRowsPerPage={() => {}}
			style={{ paddingRight: "40px" }}
		/>
	);

	return (
		<>
			{countQueryLoading || loading ? (
				<TableSkeleton />
			) : (
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
					<FITable
						tableHeading={invitedUserTable}
						rows={rows}
						pagination={invitedUserTablePagination}
						order={order}
						orderBy={orderBy}
						setOrder={setOrder}
						setOrderBy={setOrderBy}
					/>
				</>
			)}
		</>
	);
}
