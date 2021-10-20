import React from "react";
import { Box, Fab, Grid, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
// import AddButton from "../../../../components/Dasboard/AddButton";
import { MODULE_CODES, userHasAccess } from "../../../../utils/access";
import { ORGANIZATION_ACTIONS } from "../../../../utils/access/modules/organization/actions";
import DocumentsTable from "../../../../components/Table/DocumentsTable";
import { AttachFile } from "../../../../models/AttachFile";
import AttachFileForm from "../../../../components/Forms/AttachFiles";
// import useMultipleFileUpload from "../../../../hooks/multipleFileUpload";
import { useDashBoardData } from "../../../../contexts/dashboardContext";
// import { CommonUploadingFilesMessage } from "../../../../utils/commonFormattedMessage";
import { GET_ORGANISATIONS_DOCUMENTS } from "../../../../graphql";
import { useQuery } from "@apollo/client";
// import { useNotificationDispatch } from "../../../../contexts/notificationContext";
// import { setSuccessNotification } from "../../../../reducers/notificationReducer";
import AddIcon from "@material-ui/icons/Add";
// import { uploadPercentageCalculator } from "../../../../utils";
// import { CircularPercentage } from "../../../../components/commons";

export const OrganizationDocumentContainer = () => {
	const organizationEditAccess = userHasAccess(
		MODULE_CODES.ORGANIZATION,
		ORGANIZATION_ACTIONS.UPDATE_ORGANIZATION
	);
	const organizationFindAccess = userHasAccess(
		MODULE_CODES.ORGANIZATION,
		ORGANIZATION_ACTIONS.FIND_ORGANIZATION
	);
	const { data, loading, refetch } = useQuery(GET_ORGANISATIONS_DOCUMENTS);
	const [filesArray, setFilesArray] = React.useState<AttachFile[]>([]);
	const [openAttachFiles, setOpenAttachFiles] = React.useState<boolean>(false);

	const dashBoardData = useDashBoardData();

	return (
		<Box>
			<Grid md={12}>
				<Box m={1}>
					<Typography variant="h6">
						<FormattedMessage
							id={`organizationDocuments`}
							defaultMessage={`Organization Documents`}
							description={`This text will be shown on Setting page for organization documents heading on role tab`}
						/>
					</Typography>
				</Box>
				<Box>
					{organizationFindAccess && <DocumentsTable data={data} loading={loading} />}
				</Box>
				{organizationEditAccess && (
					<>
						<Fab
							style={{ position: "fixed", right: "10px", bottom: "10px" }}
							data-testid="add-button"
							color="primary"
							aria-label="add"
							onClick={() => setOpenAttachFiles(true)}
							disableRipple
						>
							<AddIcon />
						</Fab>
						{openAttachFiles && (
							<AttachFileForm
								{...{
									open: openAttachFiles,
									handleClose: () => setOpenAttachFiles(false),
									filesArray,
									setFilesArray,
									// parentOnSave: attachFileOnSave,
									uploadApiConfig: {
										ref: "organization",
										refId: dashBoardData?.organization?.id?.toString() || "",
										field: "attachments",
										path: `org-${dashBoardData?.organization?.id}/organizations`,
									},
									parentOnSuccessCall: () => {
										refetch();
										setFilesArray([]);
									},
								}}
							/>
						)}
					</>
				)}
				{/* {documentsUploadLoading > 0 ? (
					<CircularPercentage
						progress={documentsUploadLoading}
						message={uploadingFileMessage}
					/>
				) : null} */}
			</Grid>
		</Box>
	);
};
