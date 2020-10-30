import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import AddButton from "../../../components/Dasboard/AddButton";
import IndividualDialog from "../../../components/IndividualDialog";
import IndividualTable from "../../../components/Table/IndividualTable";
import { FORM_ACTIONS } from "../../../models/constants";

function IndividualContainer() {
	return (
		<Box p={2}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography variant="h4">
						<Box mt={2} fontWeight="fontWeightBold">
							<FormattedMessage
								defaultMessage={`Individual`}
								id={`IndividualSettingPageHeading`}
								description={`This heading will be shown on the individual setting page`}
							/>
						</Box>
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<IndividualTable />
				</Grid>
			</Grid>
			<AddButton
				createButtons={[]}
				buttonAction={{
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<IndividualDialog
							formAction={FORM_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
						/>
					),
				}}
			/>
		</Box>
	);
}

export default IndividualContainer;
