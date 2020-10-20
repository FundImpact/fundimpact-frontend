import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import AddButton from "../../../../components/Dasboard/AddButton";
import { MODULE_CODES, userHasAccess } from "../../../../utils/access";
import { ORGANIZATION_ACTIONS } from "../../../../utils/access/modules/organization/actions";
import DocumentsTable from "../../../../components/Table/DocumentsTable";
import { AttachFile } from "../../../../models/AttachFile";
import AttachFileForm from "../../../../components/Forms/AttachFiles";
import useMultipleFileUpload from "../../../../hooks/multipleFileUpload";
import { useDashBoardData } from "../../../../contexts/dashboardContext";
import { uploadPercentageCalculator } from "../../../../utils";
import { CircularPercentage } from "../../../../components/commons";
import { CommonUploadingFilesMessage } from "../../../../utils/commonFormattedMessage";

export const OrganizationDocumentContainer = () => {
	const organizationEditAccess = userHasAccess(
		MODULE_CODES.ORGANIZATION,
		ORGANIZATION_ACTIONS.UPDATE_ORGANIZATION
	);

	const [filesArray, setFilesArray] = React.useState<AttachFile[]>([]);

	const [documentsUploadLoading, setDocumentsUploadLoading] = React.useState(0);
	const [totalFilesToUpload, setTotalFilesToUpload] = React.useState(0);

	React.useEffect(() => {
		let remainFilestoUpload = filesArray.filter((elem) => !elem.id).length;
		let percentage = uploadPercentageCalculator(remainFilestoUpload, totalFilesToUpload);
		setDocumentsUploadLoading(percentage);
	}, [filesArray, totalFilesToUpload, setDocumentsUploadLoading]);

	let { multiplefileUpload } = useMultipleFileUpload();
	const dashBoardData = useDashBoardData();
	const attachFileOnSave = () => {
		let orgId: any = dashBoardData?.organization?.id;
		multiplefileUpload({
			ref: "organizations",
			refId: orgId,
			field: "attachments",
			path: `org-${orgId}/organizations`,
			filesArray: filesArray,
			setFilesArray: setFilesArray,
		});
	};
	let uploadingFileMessage = CommonUploadingFilesMessage();
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
				<Box>{organizationEditAccess && <DocumentsTable />}</Box>
				{organizationEditAccess && (
					<AddButton
						createButtons={[]}
						buttonAction={{
							dialog: ({
								open,
								handleClose,
							}: {
								open: boolean;
								handleClose: () => void;
							}) => {
								return (
									<AttachFileForm
										{...{
											open,
											handleClose,
											filesArray,
											setFilesArray,
											parentOnSave: attachFileOnSave,
										}}
									/>
								);
							},
						}}
					/>
				)}
				{documentsUploadLoading > 0 ? (
					<CircularPercentage
						progress={documentsUploadLoading}
						message={uploadingFileMessage}
					/>
				) : null}
			</Grid>
		</Box>
	);
};
