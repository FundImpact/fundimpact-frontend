import React from "react";

import AddButton from "../../../components/Dasboard/AddButton";
import Donor from "../../../components/Donor";
import DonorTable from "../../../components/Table/Donor";
import { FORM_ACTIONS } from "../../../models/constants";

export const DonorContainer = () => {
	return (
		<>
			<h1>Donors</h1>
			<DonorTable />
			<AddButton
				createButtons={[]}
				buttonAction={{
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<Donor
							open={open}
							handleClose={handleClose}
							formAction={FORM_ACTIONS.CREATE}
						/>
					),
				}}
			/>
		</>
	);
};
