import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ImpactCategoryForm from "../../Forms/ImpactCategoryForm";
import { IImpactCategory } from "../../../models/impact/impact";
import { useMutation } from "@apollo/client";
import { CREATE_IMPACT_CATEGORY_ORG_INPUT } from "../../../graphql/queries/Impact/mutation";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { GET_IMPACT_CATEGORY_BY_ORG } from "../../../graphql/queries/Impact/query";

const initialValues: IImpactCategory = {
	name: "",
	description: "",
	code: "",
	shortname: "",
};

const validate = (values: IImpactCategory) => {
	let errors: Partial<IImpactCategory> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	if (!values.description) {
		errors.description = "Description is required";
	}
	if (!values.code) {
		errors.code = "Impact Code is required";
	}
	if (!values.shortname) {
		errors.shortname = "Shortname is required";
	}
	return errors;
};

function ImpactCategoryDialog({ open, handleClose }: { open: boolean; handleClose: () => void }) {
	const [createImpactCategoryOrgInput, { data, loading, error }] = useMutation(
		CREATE_IMPACT_CATEGORY_ORG_INPUT
	);
	const dashboardData = useDashBoardData();

	const onSubmit = async (values: IImpactCategory) => {
		try {
			await createImpactCategoryOrgInput({
				variables: {
					input: {
						...values,
						organization: dashboardData?.organization?.id,
					},
				},
				// update: (store, { data: { createImpactCategoryOrgInput } }) => {
				// 	store.writeQuery({
				// 		query: GET_IMPACT_CATEGORY_BY_ORG,
				// 		data: {
				// 			impactCategoryOrgList: [
				// 				...data.impactCategoryOrgList,
				// 				createImpactCategoryOrgInput,
				// 			],
				// 		},
				// 	});
				// },
			});
			handleClose();
		} catch (err) {
			console.log("err :>> ", err);
			handleClose();
		}
	};

	useEffect(() => {
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
			data-testid="impact-category-dialog"
			aria-labelledby="form-dialog-title"
		>
			<Box px={3} py={4}>
				<Grid container spacing={2}>
					<Grid item xs={4}>
						<Typography
							data-testid="impact-category-dialog-header"
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
						<ImpactCategoryForm
							initialValues={initialValues}
							validate={validate}
							onSubmit={onSubmit}
							onCancel={() => handleClose()}
						/>
					</Grid>
				</Grid>
			</Box>
		</Dialog>
	);
}

export default ImpactCategoryDialog;
