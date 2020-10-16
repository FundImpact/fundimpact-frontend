import {
	Chip,
	TableCell,
	IconButton,
	Box,
	Avatar,
	Grid,
	TablePagination,
	Menu,
	MenuItem,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { invitedUserTableHeadings } from "../constants";
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
import { useIntl, FormattedMessage } from "react-intl";
import { IUserRoleUpdate } from "../../../models/UserRole/UserRole";
import UserRole from "../../Forms/UserRole";
import { FORM_ACTIONS } from "../../../models/constants";

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
		<Box key={index} m={1}>
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

function EditUserIcon({
	userData,
}: {
	userData: {
		id: string;
		email: string;
		role: { id: string; type: string; is_project_level: boolean };
		user_projects: {
			id: string;
			project: { id: string; name: string; workspace: { id: string; name: string } };
		}[];
	};
}) {
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const [targetData, setTargetData] = useState<IUserRoleUpdate | null>();
	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setMenuAnchor(event.currentTarget);
	};
	const handleMenuClose = () => {
		setMenuAnchor(null);
	};
	const dashboardData = useDashBoardData();
	return (
		<>
			<TableCell>
				<IconButton
					onClick={handleMenuClick}
					disabled={
						userData.role.type == `owner-org-${dashboardData?.organization?.id}` ||
						!userData.role.is_project_level
					}
				>
					<MoreVertIcon />
				</IconButton>
			</TableCell>
			<Menu
				id="deliverable-target-simple-menu"
				anchorEl={menuAnchor}
				keepMounted
				open={Boolean(menuAnchor)}
				onClose={handleMenuClose}
			>
				<MenuItem
					onClick={() => {
						setTargetData({
							id: userData.id,
							email: userData.email,
							role: userData.role.id,
							project: userData.user_projects.map((user_project) => ({
								...user_project.project,
								user_project_id: user_project.id,
							})),
						});
						handleMenuClose();
					}}
				>
					<FormattedMessage
						id="editUserMenu"
						defaultMessage="Edit User"
						description="This text will be show to edit the user"
					/>
				</MenuItem>
			</Menu>
			{targetData && (
				<UserRole
					open={targetData !== null}
					handleClose={() => setTargetData(null)}
					type={FORM_ACTIONS.UPDATE}
					data={targetData}
				/>
			)}
		</>
	);
}

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
					{user?.confirmed ? <CheckIcon color="action" /> : <CloseIcon color="error" />}
				</TableCell>,
			];
			col.push(<EditUserIcon key={Math.random()} userData={user} />);
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
	const intl = useIntl();
	let noRowHeadingInvitedUser = intl.formatMessage({
		id: `noUserFoundHeading`,
		defaultMessage: "No users found",
		description: `This text will be shown if no users found for table`,
	});

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
						{rows?.length > 0 && (
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
						)}
					</Grid>
					<FITable
						tableHeading={invitedUserTableHeadings}
						rows={rows}
						pagination={invitedUserTablePagination}
						order={order}
						orderBy={orderBy}
						setOrder={setOrder}
						setOrderBy={setOrderBy}
						noRowHeading={noRowHeadingInvitedUser}
					/>
				</>
			)}
		</>
	);
}
