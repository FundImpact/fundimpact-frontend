import React from "react";
import { Grid, Box, CircularProgress } from "@material-ui/core";
import CommonForm from "../../CommonForm";
import { IAddRole } from "../../../models/AddRole";
import { addRoleForm } from "./inputField.json";
import { FORM_ACTIONS } from "../../../models/constants";
import { FormikState } from "formik";

function AddRoleView({
	getInitialValues,
	validate,
	onCreate,
	roleCreationLoading,
}: {
	getInitialValues: () => IAddRole;
	validate: (values: IAddRole) => Partial<IAddRole>;
	onCreate: (
		valuesSubmitted: IAddRole,
		{
			resetForm,
		}: {
			resetForm?: (nextState?: Partial<FormikState<any>> | undefined) => void;
		}
	) => Promise<void>;
	roleCreationLoading: boolean;
}) {
	const initialValues = getInitialValues();

	return (
		<Grid container>
			<Grid item xs={12}>
				<CommonForm
					onCreate={onCreate}
					onUpdate={() => {}}
					formAction={FORM_ACTIONS.CREATE}
					initialValues={initialValues}
					inputFields={addRoleForm}
					validate={validate}
					cancelButtonName="Reset"
					createButtonName="Add"
				/>
			</Grid>
			{roleCreationLoading && (
				<Box
					position="fixed"
					left="50%"
					top="50%"
					style={{ transform: "translate(-50%, -50%)" }}
				>
					<CircularProgress />
				</Box>
			)}
		</Grid>
	);
}

export default AddRoleView;
