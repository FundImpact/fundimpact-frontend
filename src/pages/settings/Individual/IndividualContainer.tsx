import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import AddButton from "../../../components/Dasboard/AddButton";
import IndividualDialog from "../../../components/IndividualDialog";

function IndividualContainer() {
	return (
		<Box p={2}>
			<Grid container>
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
			</Grid>
			<AddButton
				createButtons={[]}
				buttonAction={{
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<IndividualDialog open={open} handleClose={handleClose} />
					),
				}}
			/>
		</Box>
	);
}

export default IndividualContainer;
