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

export const OrganizationDocumentContainer = () => {
	const organizationEditAccess = userHasAccess(
		MODULE_CODES.ORGANIZATION,
		ORGANIZATION_ACTIONS.UPDATE_ORGANIZATION
	);

	const [filesArray, setFilesArray] = React.useState<AttachFile[]>([]);

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
			</Grid>
		</Box>
	);
};
