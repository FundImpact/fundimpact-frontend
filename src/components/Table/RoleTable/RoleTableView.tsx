import {
	Box,
	Button,
	Checkbox,
	CircularProgress,
	createStyles,
	makeStyles,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Theme,
	Typography,
} from "@material-ui/core";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import { IControllerAction } from "../../../models/AddRole";
import { MODULE_CODES } from "../../../utils/access";
import TableSkeleton from "../../Skeletons/TableSkeleton";

interface ITableCellCheckBoxProps {
	formik: FormikProps<{
		[key: string]: {
			name: string;
			permissions: {} | IControllerAction;
		};
	}>;
	controllerName: MODULE_CODES;
	actionName: string;
	roleId: string;
}

let numeberOfTimesRolesChanged: { [key: string]: number } = {};

enum controllerActionHashObjKeyValuePair {
	controllerName = 0,
	actionObject = 1,
}

enum actionObjectKeyValuePair {
	actionName = 0,
	actionValue = 1,
}

const styledTable = makeStyles((theme: Theme) =>
	createStyles({
		th: {
			color: theme.palette.primary.main,
			fontSize: "13px",
			backgroundColor: theme.palette.background.paper,
		},
	})
);

const useStyles = makeStyles((theme: Theme) => ({
	button: {
		color: theme.palette.background.paper,
		marginRight: theme.spacing(2),
	},
	tableCellCheckBox: {
		padding: theme.spacing(0.5),
		zIndex: 0,
	},
	tableContainer: {
		maxHeight: "90vh",
	},
	tableRow: {
		background: theme.palette.action.hover,
	},
}));

const keyNames = ["name"];

function TableHeader({ tableHeadings }: { tableHeadings: { roleName: string }[] }) {
	const tableStyles = styledTable();
	const classes = useStyles();

	return (
		<TableHead>
			<TableRow color="primary">
				<TableCell className={tableStyles.th} align="left">
					<FormattedMessage
						id="roleTableViewPermissionsHeading"
						defaultMessage="Permissions"
						description="This text will tell user about list of permissions"
					/>
				</TableCell>
				{tableHeadings.map((tableHeading, index) => (
					<TableCell className={tableStyles.th} key={index} align="left">
						{tableHeading.roleName}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

const compareProps = (prevProps: ITableCellCheckBoxProps, currentProps: ITableCellCheckBoxProps) =>
	(prevProps.formik.values[prevProps.roleId].permissions as IControllerAction)[
		prevProps.controllerName
	][prevProps.actionName].enabled ==
	(currentProps.formik.values[currentProps.roleId].permissions as IControllerAction)[
		currentProps.controllerName
	][currentProps.actionName].enabled;

const TableCellCheckBox = React.memo(
	({ formik, controllerName, actionName, roleId }: ITableCellCheckBoxProps) => {
		const classes = useStyles();
		return (
			<TableCell align="left" className={classes.tableCellCheckBox}>
				<Checkbox
					color="primary"
					checked={
						(formik.values[roleId].permissions as IControllerAction)[controllerName][
							actionName
						].enabled
					}
					name={`${roleId}.permissions.${controllerName}.${actionName}.enabled`}
					onChange={(e) => {
						if (!(roleId in numeberOfTimesRolesChanged)) {
							numeberOfTimesRolesChanged[roleId] = 0;
						}
						e.target.checked
							? numeberOfTimesRolesChanged[roleId]++
							: numeberOfTimesRolesChanged[roleId]--;
						formik.handleChange(e);
					}}
					data-testid={`${controllerName}-${actionName}-${roleId}-input`}
					onBlur={formik.handleBlur}
					disableRipple
				/>
			</TableCell>
		);
	},
	compareProps
);

const ControllerNameRow = React.memo(
	({ controllerName, colSpan }: { controllerName: string; colSpan: number }) => {
		const classes = useStyles();

		return (
			<TableRow style={{ position: "relative" }}>
				<TableCell
					align="left"
					style={{
						position: "sticky",
						top: "0px",
						left: "0px",
					}}
				>
					{controllerName}
				</TableCell>
			</TableRow>
		);
	}
);

const initializeNoOfTimesRolesUpdated = (
	userRoles: { id: string; name: string; type: string }[]
) => {
	let newNoOfTimesRolesChangedObject: { [key: string]: number } = {};
	userRoles.forEach((role) => (newNoOfTimesRolesChangedObject[role.id] = 0));
	numeberOfTimesRolesChanged = newNoOfTimesRolesChangedObject;
};

function RoleTableView({
	userRoles,
	userRoleEditAccess,
	loading,
	order,
	setOrder,
	page,
	setPage,
	changePage,
	count,
	controllerActionHashArr,
	onUpdate,
	initialValues,
	updatingRole,
}: {
	userRoles: { id: string; name: string; type: string }[];
	userRoleEditAccess: boolean;
	loading: boolean;
	order: "asc" | "desc";
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	changePage: (prev?: boolean) => void;
	count: number;
	controllerActionHashArr: {
		roleId: string;
		roleName: string;
		controllerActionHash: IControllerAction;
	}[];
	onUpdate: (
		valuesSubmitted: {
			[key: string]: {
				name: string;
				permissions: {} | IControllerAction;
			};
		},
		numeberOfTimesRolesChanged: {
			[key: string]: number;
		}
	) => Promise<void>;
	initialValues: {
		[key: string]: {
			name: string;
			permissions: {} | IControllerAction;
		};
	};
	updatingRole: boolean;
}) {
	const dashboardData = useDashBoardData();
	const classes = useStyles();
	const tableStyles = styledTable();

	const formikInstanceRef = useRef<FormikProps<{
		[key: string]: {
			name: string;
			permissions: {} | IControllerAction;
		};
	}> | null>(null);

	useEffect(() => {
		if (userRoles.length && Object.keys(numeberOfTimesRolesChanged).length == 0) {
			initializeNoOfTimesRolesUpdated(userRoles);
		}
	}, [userRoles]);

	if (loading) {
		return <TableSkeleton />;
	}

	if (!userRoles.length) {
		return (
			<Typography align="center" variant="h5">
				No Roles
			</Typography>
		);
	}
	// console.log("initialValues :>> ", initialValues);
	//creating controllerActionHashArr takes a lot of time and it show only
	//display loading when roles are there
	if (controllerActionHashArr.length == 0) {
		return <TableSkeleton />;
	}
	return (
		<>
			<TableContainer component={Paper} className={classes.tableContainer}>
				<Table stickyHeader aria-label="simple table" component="form">
					<TableHeader tableHeadings={controllerActionHashArr} />
					<TableBody component="form">
						<Formik
							initialValues={initialValues}
							onSubmit={(valuesSubmitted) => {
								onUpdate(valuesSubmitted, { ...numeberOfTimesRolesChanged }).then(
									() => {
										initializeNoOfTimesRolesUpdated(userRoles);
									}
								);
							}}
							enableReinitialize
						>
							{(formik) => {
								formikInstanceRef.current = formik;
								// console.log("formik :>> ", formik);
								return (
									<Form style={{ display: "contents" }}>
										{Object.entries(
											controllerActionHashArr[0].controllerActionHash
										).map((controllerActionHash) => (
											<>
												<ControllerNameRow
													controllerName={
														controllerActionHash[
															controllerActionHashObjKeyValuePair
																.controllerName
														]
													}
													colSpan={controllerActionHashArr.length + 1}
												/>
												{Object.entries(
													controllerActionHash[
														controllerActionHashObjKeyValuePair
															.actionObject
													]
												).map((actionObjectOfController, index) => (
													<TableRow
														key={index}
														style={{ position: "relative" }}
														className={classes.tableRow}
													>
														<TableCell
															align="left"
															style={{
																position: "sticky",
																top: "0px",
																left: "0px",
															}}
														>
															{
																actionObjectOfController[
																	actionObjectKeyValuePair
																		.actionName
																]
															}
														</TableCell>
														{controllerActionHashArr.map(
															(
																controllerActionHashElement,
																index
															) => (
																<>
																	{formik.values[
																		controllerActionHashArr[
																			index
																		].roleId
																	] && (
																		<TableCellCheckBox
																			controllerName={
																				controllerActionHash[
																					controllerActionHashObjKeyValuePair
																						.controllerName
																				] as MODULE_CODES
																			}
																			actionName={
																				actionObjectOfController[
																					actionObjectKeyValuePair
																						.actionName
																				]
																			}
																			formik={formik}
																			roleId={
																				controllerActionHashArr[
																					index
																				].roleId
																			}
																		/>
																	)}
																</>
															)
														)}
													</TableRow>
												))}
											</>
										))}
									</Form>
								);
							}}
						</Formik>
					</TableBody>
				</Table>
			</TableContainer>
			<Box display="flex" mt={2}>
				<Button
					className={classes.button}
					disableRipple
					variant="contained"
					color="secondary"
					data-testid="createUpdateButton"
					onClick={() => {
						formikInstanceRef.current && formikInstanceRef.current.submitForm();
					}}
				>
					<FormattedMessage
						id="addRoleButton"
						defaultMessage="Update"
						description="This text will tell user to create role"
					/>
				</Button>
			</Box>
			{updatingRole ? (
				<Box
					position="fixed"
					left="50%"
					top="50%"
					style={{ transform: "translate(-50%, -50%)" }}
				>
					<CircularProgress />
				</Box>
			) : null}
		</>
	);
}

export default RoleTableView;
