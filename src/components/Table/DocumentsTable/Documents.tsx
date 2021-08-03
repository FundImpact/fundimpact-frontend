import { Box, Grid, IconButton, TableCell, TablePagination } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useEffect, useState } from "react";
import { getTodaysDate, isValidImage } from "../../../utils";
import FITable from "../FITable";
import { useIntl } from "react-intl";
import { Attachments } from "../../../models/AttachFile";
import { documentsHeadings } from "../constants";
import GetAppIcon from "@material-ui/icons/GetApp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { removeFilterListObjectElements } from "../../../utils/filterList";
import { FullScreenLoader } from "../../Loader/Loader";
import FilterListContainer from "../../FilterList";
import { projectDocumentsFilter } from "../ProjectDocument/inputFields.json";
import { createChipArray } from "../../commons";

export default function DocumentsTable({
	data,
	loading,
}: {
	data: {
		organizations: {
			id: string;
			name: string;
			short_name: string;
			attachments: Attachments[];
		}[];
	};
	loading: boolean;
}) {
	const [documentPage, setDocumentPage] = React.useState(0);
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

	const handleDocumentChangePage = (event: unknown, newPage: number) => {
		setDocumentPage(newPage);
	};

	const [limit, setLimit] = useState(10);
	const [rows, setRows] = useState<React.ReactNode[]>([]);

	// const { data, loading } = useQuery(GET_ORGANISATIONS_DOCUMENTS);
	useEffect(() => {
		let arr: any = [];
		data?.organizations?.map(
			(organization: {
				id: string;
				name: string;
				short_name: string;
				attachments: Attachments[];
			}) => {
				let organizationAttachments = organization.attachments;
				if (
					Object.values(filterList).filter((elem) => {
						if (elem) return elem;
					}).length
				)
					organizationAttachments = organizationAttachments.filter((obj: any) => {
						return obj.name == filterList?.name || obj.ext == filterList?.ext;
					});

				organizationAttachments?.map((document: Attachments, index: number) => {
					let row = [
						<TableCell component="td" scope="row" key={index}>
							{documentPage * limit + index + 1}
						</TableCell>,
						<TableCell key={`${index}-name`}>{document.name}</TableCell>,
						<TableCell key={`${index}-1`}>{`${document.size}Kb`}</TableCell>,
						<TableCell key={`${index}-caption`}>{document.caption || "-"}</TableCell>,
						<TableCell key={`${index}-2`}>{document.ext}</TableCell>,
						<TableCell key={`${index}-3`}>
							{getTodaysDate(new Date(document.created_at))}
						</TableCell>,
						<TableCell key={`${index}-4`}>
							<IconButton
								onClick={() => {
									var win = window.open(document.url, "_blank");
									win?.focus();
								}}
							>
								{isValidImage(document.ext) ? <VisibilityIcon /> : <GetAppIcon />}
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

	const handleChangeRowsPerPage = (event: any) => {
		if (event.target.value == "All") {
			setLimit(rows.length);
		} else if (event.target.value == 5) {
			setLimit(5);
		} else if (event.target.value == 10) {
			setLimit(10);
		}
		setDocumentPage(0);
	};

	let documentPagination = (
		<TablePagination
			colSpan={9}
			count={rows.length}
			rowsPerPage={limit}
			page={documentPage}
			onChangePage={handleDocumentChangePage}
			style={{ paddingRight: "40px" }}
			rowsPerPageOptions={[5, 10, "All"]}
			onChangeRowsPerPage={handleChangeRowsPerPage}
		/>
	);

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

	return (
		<>
			{loading ? <FullScreenLoader /> : null}
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
			<FITable
				tableHeading={documentsHeadings}
				rows={rows.slice(documentPage * limit, documentPage * limit + limit)}
				pagination={documentPagination}
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
