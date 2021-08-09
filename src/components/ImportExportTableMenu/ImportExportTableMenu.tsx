import {
	Box,
	Button,
	CircularProgress,
	IconButton,
	Input,
	InputLabel,
	MenuItem,
} from "@material-ui/core";
import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/userContext";
import SimpleMenu from "../Menu/Menu";
import axios from "axios";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileForm from "../Forms/AttachFiles";
import { AttachFile } from "../../models/AttachFile";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { FormattedMessage } from "react-intl";
import { exportTable } from "../../utils/importExportTable.utils";
import ReactToPrint from "react-to-print";

const ImportExportTableMenu = ({
	tableName,
	tableExportUrl,
	tableImportUrl,
	onImportTableSuccess,
	children,
	additionalMenuItems = [],
	importButtonOnly,
	hideExport,
	hideImport,
	printRef,
}: {
	tableName: string;
	tableExportUrl: string;
	tableImportUrl?: string;
	onImportTableSuccess?: () => void;
	children?: React.ReactNode;
	additionalMenuItems?: {
		children: JSX.Element;
	}[];
	importButtonOnly?: boolean;
	hideImport?: boolean;
	hideExport?: boolean;
	printRef?: any;
}) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [openAttachFiles, setOpenAttachFiles] = React.useState<boolean>(false);
	const [filesArray, setFilesArray] = React.useState<AttachFile[]>([]);
	const handleClose = () => setAnchorEl(null);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const { jwt } = useAuth();
	const notificationDispatch = useNotificationDispatch();
	const handleImportTableClick = async () => {
		try {
			if (!filesArray?.[0]?.file) {
				return;
			}
			const importTableFormData = new FormData();
			importTableFormData.append("importTable", filesArray?.[0]?.file);
			const importTableResponse = await axios({
				method: "POST",
				url: tableImportUrl,
				data: importTableFormData,
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${jwt}`,
				},
			});
			onImportTableSuccess && onImportTableSuccess();
			notificationDispatch(setSuccessNotification(importTableResponse.data.message));
		} catch (error) {
			notificationDispatch(setErrorNotification(error?.response?.data?.message));
			console.log(`error`, error);
		} finally {
			setFilesArray([]);
			setOpenAttachFiles(false);
		}
	};

	const menuList = [...additionalMenuItems];

	if (!hideExport) {
		menuList.push({
			children: (
				<MenuItem
					onClick={() =>
						exportTable({
							tableName,
							jwt: jwt as string,
							tableExportUrl,
						})
					}
				>
					<FormattedMessage
						defaultMessage="Export Table"
						id="export_table"
						description="export table as csv"
					/>
				</MenuItem>
			),
		});
	}

	if (tableImportUrl && !hideImport) {
		menuList.push({
			children: (
				<MenuItem onClick={() => setOpenAttachFiles(true)}>
					<FormattedMessage
						defaultMessage="Import Table"
						id="import_table"
						description="import table as csv"
					/>
				</MenuItem>
			),
		});
	}

	menuList.push({
		children: (
			<ReactToPrint
				trigger={() => (
					<MenuItem>
						<FormattedMessage
							defaultMessage="Print Table"
							id="print_table"
							description="print table as csv"
						/>
					</MenuItem>
				)}
				content={() => printRef?.current}
			/>
		),
	});

	return (
		<div>
			{importButtonOnly
				? !hideImport && (
						<Button onClick={() => setOpenAttachFiles(true)}>
							<FormattedMessage
								defaultMessage="Import Table"
								id="import_table"
								description="import table as csv"
							/>
						</Button>
				  )
				: (!hideExport || !hideImport) && (
						<>
							<IconButton
								aria-haspopup="true"
								onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
									handleClick(event);
								}}
							>
								<MoreVertIcon />
							</IconButton>
							<SimpleMenu
								handleClose={handleClose}
								id={`${tableName}ImportExportButton`}
								anchorEl={anchorEl}
								menuList={menuList}
							/>
						</>
				  )}
			{openAttachFiles && (
				<AttachFileForm
					open={openAttachFiles}
					handleClose={() => {
						setOpenAttachFiles(false);
						setFilesArray([]);
					}}
					filesArray={filesArray}
					setFilesArray={setFilesArray}
					parentOnSave={handleImportTableClick}
					allowMultipleFileUpload={false}
					showAddRemarkButton={false}
				>
					{children}
				</AttachFileForm>
			)}
		</div>
	);
};
export default ImportExportTableMenu;
