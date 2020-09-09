import React from "react";
import AddButton from "../../../components/Dasboard/AddButton";
import ImpactCategoryTable from "../../../components/Table/ImpactCategory";
import { Box } from "@material-ui/core";
import ImpactUnitDialog from "../../../components/Impact/ImpactUnitDialog/ImpaceUnitDialog";
import ImpactCategoryDialog from "../../../components/Impact/ImpactCategoryDialog";
import { FORM_ACTIONS } from "../../../models/constants";

const ImpactCategoryView = () => {
	return (
		<>
			<Box p={2}>
				<h1>Impact Categories</h1>
				<ImpactCategoryTable />
				<AddButton
					createButtons={[
						{
							text: "Create Impact Unit",
							dialog: ({
								open,
								handleClose,
							}: {
								open: boolean;
								handleClose: () => void;
							}) => <ImpactUnitDialog open={open} handleClose={handleClose} />,
						},
						{
							text: "Create Impact Category",
							dialog: ({
								open,
								handleClose,
							}: {
								open: boolean;
								handleClose: () => void;
							}) => (
								<ImpactCategoryDialog
									formAction={FORM_ACTIONS.CREATE}
									open={open}
									handleClose={handleClose}
								/>
							),
						},
					]}
				/>
			</Box>
		</>
	);
};

export default ImpactCategoryView;
