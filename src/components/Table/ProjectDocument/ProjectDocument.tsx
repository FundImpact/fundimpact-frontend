import { useQuery } from "@apollo/client";
import { Box, Grid, IconButton, TableCell, TablePagination } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useEffect, useState } from "react";
import { projectDocumentsFilter } from "./inputFields.json";
import { getTodaysDate, isValidImage } from "../../../utils";
import FullScreenLoader from "../../commons/GlobalLoader";

import FITable from "../FITable";
import { useIntl } from "react-intl";
import { GET_PROJECT_DOCUMENTS } from "../../../graphql";
import { useDashBoardData } from "../../../contexts/dashboardContext";

import VisibilityIcon from "@material-ui/icons/Visibility";
import { Attachments } from "../../../models/AttachFile";
import { documentsHeadings } from "../constants";
import GetAppIcon from "@material-ui/icons/GetApp";
import FilterListContainer from "../../FilterList";
import { removeFilterListObjectElements } from "../../../utils/filterList";
import { createChipArray } from "../../commons";

export default function ProjectDocumentsTable() {
	const [projectDocumentPage, setProjectDocumentPage] = React.useState(0);
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		name: "",
		ext: "",
		created_at: "",
	});

	const removeFilterListElements = (key: string, index?: number) =>
		setFilterList((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);

	const dashBoardData = useDashBoardData();

	const limit = 10;
	const [rows, setRows] = useState<React.ReactNode[]>([]);

	const handleChangePage = (event: unknown, newPage: number) => {
		setProjectDocumentPage(newPage);
	};

	const { data, loading } = useQuery(GET_PROJECT_DOCUMENTS, {
		variables: {
			filter: { id: dashBoardData?.project?.id },
		},
	});
	const valueExistInFilterList = Object.values(filterList).filter((elem) => {
		if (elem) return elem;
	}).length;
	useEffect(() => {
		let arr: any = [];
		data?.orgProject?.map(
			(project: { id: string; name: string; attachments: Attachments[] }) => {
				let projectAttachment = project.attachments;

				if (valueExistInFilterList)
					projectAttachment = projectAttachment.filter((obj: any) => {
						return obj.name == filterList?.name || obj.ext == filterList?.ext;
					});

				projectAttachment?.map((projectDocument: Attachments, index: number) => {
					let row = [
						<TableCell key={index}>
							{" "}
							{projectDocumentPage * limit + index + 1}
						</TableCell>,
						<TableCell key={`${index}-name`}>{projectDocument.name}</TableCell>,
						<TableCell key={`${index}-1`}>{`${projectDocument.size}Kb`}</TableCell>,
						<TableCell key={`${index}-caption`}>
							{projectDocument.caption || "-"}
						</TableCell>,
						<TableCell key={`${index}-2`}>{projectDocument.ext}</TableCell>,
						<TableCell key={`${index}-3`}>
							{getTodaysDate(new Date(projectDocument.created_at))}
						</TableCell>,
						<TableCell key={`${index}-4`}>
							<IconButton
								onClick={() => {
									var win = window.open(projectDocument.url, "_blank");
									win?.focus();
								}}
							>
								{isValidImage(projectDocument.ext) ? (
									<VisibilityIcon />
								) : (
									<GetAppIcon />
								)}
							</IconButton>
						</TableCell>,
						<TableCell key={`${index}-5`}>
							<IconButton disabled>
								<MoreVertIcon />
							</IconButton>
						</TableCell>,
					];
					arr.push(row);
				});
				setRows(arr);
			},
			[]
		);
	}, [data, filterList]);

	const intl = useIntl();

	documentsHeadings[documentsHeadings.length - 1].renderComponent = () => (
		<FilterListContainer
			initialValues={{
				name: "",
				ext: "",
			}}
			setFilterList={setFilterList}
			inputFields={projectDocumentsFilter}
		/>
	);

	let projectDocumentPagination = (
		<TablePagination
			colSpan={9}
			count={rows.length}
			rowsPerPage={limit}
			page={projectDocumentPage}
			onChangePage={handleChangePage}
			style={{ paddingRight: "40px" }}
			rowsPerPageOptions={[]}
			onChangeRowsPerPage={() => {}}
		/>
	);
	return (
		<>
			<Grid container>
				<Grid item xs={12}>
					<Box display="flex" flexWrap="wrap">
						{Object.entries(filterList).map((filterListObjectKeyValuePair) =>
							createChipArray({
								filterListObjectKeyValuePair,
								removeFilterListElements,
							})
						)}
					</Box>
				</Grid>
			</Grid>
			{loading ? <FullScreenLoader /> : null}
			<FITable
				tableHeading={documentsHeadings}
				rows={rows.slice(projectDocumentPage * limit, projectDocumentPage * limit + limit)}
				pagination={projectDocumentPagination}
				order={order}
				orderBy={orderBy}
				setOrder={setOrder}
				setOrderBy={setOrderBy}
				noRowHeading={intl.formatMessage({
					id: `noDocuments`,
					defaultMessage: `No Documents`,
					description: `This text will be shown if no documents found for table`,
				})}
			/>
		</>
	);
}
