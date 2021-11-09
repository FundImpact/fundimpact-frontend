import React, { useEffect, useState, useRef } from "react";
import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	IconButton,
	MenuItem,
} from "@material-ui/core";
import { useLazyQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../../../graphql/Category/query";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import { categories } from "./dummyData.json";
// import pagination from "../../../hooks/pagination";
// import {
// 	GET_DELIVERABLE_ORG_CATEGORY_COUNT,
// 	GET_DELIVERABLE_ORG_CATEGORY,
// } from "../../../graphql/Deliverable/orgCategory";
import SimpleMenu from "../../Menu";
import { FormattedMessage } from "react-intl";
import TableSkeleton from "../../Skeletons/TableSkeleton";
import Category from "../../Category";
import { FORM_ACTIONS } from "../../../models/constants";
import { ICategory } from "../../../models/categories";

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

const styledTable = makeStyles((theme: Theme) =>
	createStyles({
		th: { color: theme.palette.primary.main, fontSize: "13px" },
		tbody: {
			"& tr:nth-child(odd) td": { background: theme.palette.action.hover },
			"& td.MuiTableCell-root": {
				paddingTop: "1px",
				paddingBottom: "1px",
				fontSize: "13px",
			},
		},
	})
);

const getInitialValues = (cat: ICategory | null): ICategory => {
	return {
		id: cat?.id || "",
		name: cat?.name || "",
		code: cat?.code || "",
		description: cat?.description || "",
	};
};

const CategoriesTable = () => {
	const classes = useStyles();
	const tableStyles = styledTable();
	const selectedCategory = useRef<any | null>(null);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [page, setPage] = useState<number>(0);
	const [queryFilter, setQueryFilter] = useState({});
	const [pageCount, setPageCount] = useState(0);
	const [openCategoryEditDialog, setOpenCategoryEditDialog] = useState<boolean>(false);
	const [openCategoryDeleteDialog, setOpenCategoryDeleteDialog] = useState<boolean>(false);

	const [getCategories, categoriesResponse] = useLazyQuery(GET_CATEGORIES);

	useEffect(() => {
		getCategories({ variables: { id: "2" } });
	}, []);

	console.log("fetchedProject", categoriesResponse);

	// useEffect(() => {
	// 	if (dashboardData?.project) {
	// 		getProject({ variables: { id: dashboardData?.project.id } });
	// 	}
	// }, [dashboardData, getProject]);

	// let {
	// 	changePage: deliverableChangePage,
	// 	count: deliverableCatCount,
	// 	queryData: deliverableCatList,
	// 	queryLoading: deliverableQueryLoading,
	// 	countQueryLoading: deliverableCountQueryLoading,
	// 	queryRefetch: refetchDeliverableCatList,
	// 	countRefetch: refetchDeliverableCatCount,
	// } = pagination({
	// 	countQuery: GET_DELIVERABLE_ORG_CATEGORY_COUNT,
	// 	countFilter: {},
	// 	query: GET_DELIVERABLE_ORG_CATEGORY,
	// 	queryFilter,
	// 	sort: `${orderBy}:${order.toUpperCase()}`,
	// });

	// useEffect(() => {
	// 	if (deliverableCatCount?.aggregate?.count) {
	// 		setPageCount(deliverableCatCount.aggregate.count);
	// 	}
	// }, [deliverableCatCount]);

	// console.log("Data: ", deliverableCatList);
	// console.log("Count: ", deliverableCatCount);

	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const menuList = [
		{
			children: (
				<MenuItem
					onClick={() => {
						setOpenCategoryEditDialog(true);
						handleMenuClose();
					}}
				>
					<FormattedMessage
						id="editCategory"
						defaultMessage="Edit"
						description="This text will be shown on menu item to edit Category"
					/>
				</MenuItem>
			),
		},
		{
			children: (
				<MenuItem
					onClick={() => {
						setOpenCategoryDeleteDialog(true);
						handleMenuClose();
					}}
				>
					<FormattedMessage
						id="deleteCategory"
						defaultMessage="Delete"
						description="This text will be shown on menu item to delete Category"
					/>
				</MenuItem>
			),
		},
	];

	// Check for the loading
	if (false) {
		return <TableSkeleton />;
	}

	return (
		<TableContainer component={Paper}>
			<Category
				formAction={FORM_ACTIONS.UPDATE}
				handleClose={() => setOpenCategoryEditDialog(false)}
				initialValues={getInitialValues(selectedCategory.current)}
				open={openCategoryEditDialog}
			/>
			<Category
				formAction={FORM_ACTIONS.UPDATE}
				handleClose={() => setOpenCategoryDeleteDialog(false)}
				initialValues={getInitialValues(selectedCategory.current)}
				open={openCategoryDeleteDialog}
				deleteCategory={true}
			/>

			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow color="primary">
						<TableCell>#</TableCell>
						<TableCell>Name</TableCell>
						<TableCell>Code</TableCell>
						<TableCell>Description</TableCell>
						<TableCell>Deliverable Type</TableCell>
						<TableCell>
							<IconButton>
								<MoreVertIcon />
							</IconButton>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody className={tableStyles.tbody}>
					{categories.map((cat: ICategory, index: number) => (
						<TableRow key={cat.id}>
							<TableCell component="td" scope="row">
								{page * 10 + index + 1}
							</TableCell>
							<TableCell>{cat.name}</TableCell>
							<TableCell>{cat.code}</TableCell>
							<TableCell>{cat.description}</TableCell>
							<TableCell>{cat.deliverable_type_id?.name}</TableCell>
							<TableCell>
								<IconButton
									aria-haspopup="true"
									onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
										selectedCategory.current = cat;
										handleMenuClick(event);
									}}
									style={{
										visibility: true ? "visible" : "hidden",
									}}
								>
									<MoreVertIcon />
								</IconButton>
								{/* Edit Access */}
								{true && (
									<SimpleMenu
										handleClose={handleMenuClose}
										id={`organizationMenu-${cat.id}`}
										anchorEl={
											selectedCategory?.current?.id === cat.id
												? anchorEl
												: null
										}
										menuList={menuList}
									/>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default CategoriesTable;
