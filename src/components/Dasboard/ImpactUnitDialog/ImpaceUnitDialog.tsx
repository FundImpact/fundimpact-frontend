import React from "react";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { useQuery } from "@apollo/client";
import { IImpactUnitFormInput, IImpactUnitFormProps } from "../../../models/impact/impactForm";
import ImpactUnitForm from "../../Forms/ImpactUnitForm";
import { GET_IMPACT_CATEGORY_BY_ORG } from "../../../graphql/queries/Impact/query";
import { useDashBoardData } from "../../../contexts/dashboardContext";

const initialValues: IImpactUnitFormInput = {
	name: "",
	description: "",
	code: "",
	target_unit: "",
	prefix_label: "",
	suffix_label: "",
};

const validate = (values: IImpactUnitFormInput) => {
	let errors: Partial<IImpactUnitFormInput> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	if (!values.description) {
		errors.description = "Description is required";
	}
	if (!values.code) {
		errors.code = "Impact Code is required";
	}
	if (!values.target_unit) {
		errors.target_unit = "Target unit is required";
	}
	if (!values.prefix_label) {
		errors.prefix_label = "Prefix label is required";
	}
	if (!values.suffix_label) {
		errors.suffix_label = "Suffix label is required";
	}
	return errors;
};

function ImpactCategoryDialog({ open, handleClose }: { open: boolean; handleClose: () => void }) {
	const dashboardData = useDashBoardData();
	const { loading, error, data } = useQuery(GET_IMPACT_CATEGORY_BY_ORG, {
		variables: {
			filter: {
				organization: dashboardData?.organization?.id,
			},
		},
	});
	
	React.useEffect(() => {	
		if (data) {
			console.log("data :>> ", data);
		}
	}, [data]);

	return (
		<Dialog
			fullWidth
			maxWidth="md"
			open={open}
			onClose={handleClose}
			data-testid="impact-unit-dialog"
			aria-labelledby="form-dialog-title"
		>
			<Box px={3} py={4}>
				<Grid container spacing={2}>
					<Grid item xs={4}>
						<Typography
							data-testid="impact-unit-dialog-header"
							variant="h6"
							gutterBottom
						>
							New Impact Indicators
						</Typography>
						<Typography variant="subtitle2" color="textSecondary" gutterBottom>
							Physical addresses of your organizatin like headquater, branch etc.
						</Typography>
						<Box p={3} mt={3} style={{ backgroundColor: "#F5F6FA" }}>
							<Typography color="primary" gutterBottom>
								WORKSPACE 1
							</Typography>
							<Box mt={1}>
								<Typography variant="subtitle2">Project Name One</Typography>
							</Box>
						</Box>
					</Grid>
					<Grid item xs={8}>
						<ImpactUnitForm
							initialValues={initialValues}
							validate={validate}
							onSubmit={(values: IImpactUnitFormInput) => console.log(values)}
							onCancel={() => handleClose()}
						/>
					</Grid>
				</Grid>
			</Box>
		</Dialog>
	);
}

export default ImpactCategoryDialog;
