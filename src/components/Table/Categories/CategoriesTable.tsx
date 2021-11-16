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
	TableFooter,
	TablePagination,
} from "@material-ui/core";
import { GET_CATEGORIES } from "../../../graphql/Category/query";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import SimpleMenu from "../../Menu";
import { FormattedMessage } from "react-intl";
import TableSkeleton from "../../Skeletons/TableSkeleton";
import Category from "../../Category";
import { FORM_ACTIONS } from "../../../models/constants";
import { ICategory } from "../../../models/categories";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { GET_CATEGORY_COUNT } from "../../../graphql/Category/mutation";
import pagination from "../../../hooks/pagination";
import { categoriesTableHeading } from "../constants";

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
		type: cat?.type || "",
		is_project: cat?.is_project || false,
		project_id: cat?.project_id || {
			id: "",
			name: "",
		},
	};
};

const CategoriesTable = ({
	tableFilterList,
}: {
	tableFilterList?: { [key: string]: string | string[] };
}) => {
	const dashboardData = useDashBoardData();
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

	useEffect(() => {
		let newFilterListObject: { [key: string]: string | string[] } = {};
		for (let key in tableFilterList) {
			if (tableFilterList[key] && tableFilterList[key].length) {
				newFilterListObject[key] = tableFilterList[key];
			}
		}
		setQueryFilter({
			// organization: dashboardData?.organization?.id,
			...newFilterListObject,
		});
	}, [tableFilterList, dashboardData]);

	let {
		changePage: categoryChangePage,
		count: categoryCount,
		queryData: categoryList,
		queryLoading: categoryLoading,
		countQueryLoading: categoryCountLoading,
		queryRefetch: refetchDeliverableCatList,
		countRefetch: refetchDeliverableCatCount,
	} = pagination({
		countQuery: GET_CATEGORY_COUNT,
		countFilter: {},
		query: GET_CATEGORIES,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
	});

	// useEffect(() => {
	// 	if (deliverableCatCount?.aggregate?.count) {
	// 		setPageCount(deliverableCatCount.aggregate.count);
	// 	}
	// }, [deliverableCatCount]);

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

	const handlePageChange = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		if (newPage > page) {
			categoryChangePage();
			setPage(newPage);
		} else {
			categoryChangePage(true);
			setPage(newPage);
		}
	};

	// Check for the loading
	if (categoryLoading || categoryCountLoading) {
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
						{categoryList?.categories?.length
							? categoriesTableHeading.map(
									(
										heading: { label: string; keyMapping?: string },
										index: number
									) => (
										<TableCell
											className={tableStyles.th}
											key={index}
											align="left"
										>
											{heading.label}
										</TableCell>
									)
							  )
							: null}
						<TableCell>
							<IconButton>
								<MoreVertIcon />
							</IconButton>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody className={tableStyles.tbody}>
					{categoryList?.categories?.map((cat: ICategory, index: number) => (
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
				{categoryList?.categories?.length && categoryCount && (
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[]}
								count={categoryCount?.aggregate?.count}
								rowsPerPage={
									categoryCount?.aggregate?.count > 10
										? 10
										: categoryCount?.aggregate?.count
								}
								page={page}
								onChangePage={handlePageChange}
								onChangeRowsPerPage={() => {}}
								style={{ paddingRight: "40px" }}
							/>
						</TableRow>
					</TableFooter>
				)}
			</Table>
		</TableContainer>
	);
};

export default CategoriesTable;
