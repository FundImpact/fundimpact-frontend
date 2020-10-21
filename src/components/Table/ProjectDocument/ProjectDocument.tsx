import { useQuery } from "@apollo/client";
import { IconButton, TableCell } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useEffect, useState } from "react";

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

export default function ProjectDocumentsTable() {
	const [TracklinePage, setTracklinePage] = React.useState(0);
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	// const [filterList, setFilterList] = useState<{
	// 	[key: string]: string | string[];
	// }>({
	// 	reporting_date: "",
	// 	note: "",
	// 	value: "",
	// 	annual_year: [],
	// 	financial_year: [],
	// });
	// const [queryFilter, setQueryFilter] = useState({});

	const dashBoardData = useDashBoardData();

	const limit = 10;
	const [rows, setRows] = useState<React.ReactNode[]>([]);

	const { data, loading } = useQuery(GET_PROJECT_DOCUMENTS, {
		variables: {
			filter: { id: dashBoardData?.project?.id },
		},
	});

	useEffect(() => {
		let arr: any = [];
		data?.orgProject?.map(
			(project: { id: string; name: string; attachments: Attachments[] }) => {
				project.attachments?.map((projectDocument: Attachments, index: number) => {
					let row = [
						<TableCell component="td" scope="row" key={index}>
							{TracklinePage * limit + index + 1}
						</TableCell>,
						<TableCell key={index}>{projectDocument.name}</TableCell>,
						<TableCell key={`${index}-1`}>{`${projectDocument.size}Kb`}</TableCell>,
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
	}, [data, TracklinePage]);

	const intl = useIntl();

	return (
		<>
			{/* {countQueryLoading ? <FullScreenLoader /> : null} */}
			{loading ? <FullScreenLoader /> : null}
			<FITable
				tableHeading={documentsHeadings}
				rows={rows}
				// pagination={deliverableTracklineTablePagination}
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
