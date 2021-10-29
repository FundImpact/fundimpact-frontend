import React, { useState } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import FilterList from "../../../components/FilterList";
import UnitsTable from "../../../components/Table/Units";
import AddButton from "../../../components/Dasboard/AddButton";
import Unit from "../../../components/Unit";
import { FORM_ACTIONS } from "../../../models/constants";
import { unitInputFields } from "./inputField.json";

const Units = () => {
	const [tableFilterList, setTableFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		name: "",
	});

	return (
		<Box p={2}>
			<Grid container>
				<Grid item xs={11}>
					<Typography variant="h4">
						<Box mt={2} fontWeight="fontWeightBold">
							<FormattedMessage
								id="units"
								defaultMessage="Units"
								description="This text will be heading of units page"
							/>
						</Box>
					</Typography>
				</Grid>
				<Grid item xs={1}>
					<Box mt={2}>
						<FilterList
							setFilterList={setTableFilterList}
							inputFields={unitInputFields}
							initialValues={{
								name: "",
							}}
						/>
					</Box>
				</Grid>
			</Grid>
			<UnitsTable />
			<AddButton
				createButtons={[]}
				buttonAction={{
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<Unit
							open={open}
							handleClose={handleClose}
							formAction={FORM_ACTIONS.CREATE}
						/>
					),
				}}
			/>
		</Box>
	);
};

export default Units;
