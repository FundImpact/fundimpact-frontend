import React, { useEffect, useState } from "react";
import { Box, Button, FormControlLabel, RadioGroup, Radio } from "@material-ui/core";
import FIDialog from "../../../components/Dialog/Dialog";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { donorForm, projectForm, targetForm, budgetCategoryForm } from "./inputField.json";
import Tallyforms from "../../../components/Forms/Tally";

const useStyle = makeStyles((theme: Theme) =>
	createStyles({
		formWrapper: {
			minHeight: theme.spacing(40),
		},
		childrenWrapper: {
			width: "50%",
			marginTop: theme.spacing(5),
			marginBottom: theme.spacing(2),
		},
	})
);

const getInitialValues = (keyword: string) => {
	if (keyword === "donor")
		return {
			donor: "",
			project: "",
			target: "",
			subTarget: "",
			projectBudgetCategory: "",
		};

	if (keyword === "project")
		return {
			projects: "",
			target: "",
			subTarget: "",
			projectBudgetCategory: "",
		};

	if (keyword === "target")
		return {
			target: "",
		};

	if (keyword === "budget_category")
		return {
			budget_category: "",
		};
};

const TallyContainer = () => {
	const classes = useStyle();
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [globalSelect, setGlobalSelect] = useState<string>("donor");
	const [donorSelect, setDonorSelect] = useState<string>("targetsAndSubTargets");

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const handleGlobalSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
		setGlobalSelect(e.target.value);
	};

	const handleDonorSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDonorSelect(e.target.value);
	};

	const validate = (values: any) => {
		let errors: Partial<any> = {};
		// if (props.type === DELIVERABLE_ACTIONS.CREATE) {

		// if (!values.donor) {
		// 	errors.donor = "Donor is required";
		// }
		// if (!values.project) {
		// 	errors.project = "Projcet is required";
		// }
		// // }

		// if (props.type === DELIVERABLE_ACTIONS.UPDATE) {
		// 	if (!values.name && !values.name.length) {
		// 		errors.name = "Name is required";
		// 	}
		// 	if (!values.project) {
		// 		errors.project = "Project is required";
		// 	}
		// 	if (values.is_qualitative) {
		// 		if (!values.value_qualitative_option) {
		// 			errors.value_qualitative_option = "Options are required";
		// 		}
		// 	} else {
		// 		if (!values.value_calculation) {
		// 			errors.value_calculation = "This Field is required";
		// 		}
		// 	}
		// }
		return errors;
	};

	const onCreate = (value: any) => {
		console.log("Oncreate: ", value);
	};
	const onUpdate = (value: any) => {
		console.log("Onupdate: ", value);
	};

	const onCancel = () => {
		handleCloseDialog();
	};

	if (donorSelect === "targetsAndSubTargets") {
		donorForm[2].hidden = false;
		donorForm[3].hidden = false;
		donorForm[4].hidden = true;
		projectForm[1].hidden = false;
		projectForm[2].hidden = false;
		projectForm[3].hidden = true;
	}

	if (donorSelect === "projectBudgetCategory") {
		donorForm[2].hidden = true;
		donorForm[3].hidden = true;
		donorForm[4].hidden = false;
		projectForm[1].hidden = true;
		projectForm[2].hidden = true;
		projectForm[3].hidden = false;
	}

	return (
		<Box p={2}>
			<h1>Welcome to Tally</h1>
			<Button onClick={() => setOpenDialog(true)} variant="contained">
				Open Dialogue
			</Button>

			<FIDialog open={openDialog} handleClose={handleCloseDialog} header="Cost Center Name">
				<RadioGroup
					aria-label="tally"
					name="row-radio-buttons-group"
					onChange={handleGlobalSelection}
					value={globalSelect}
				>
					<Box display="flex" justifyContent="space-between">
						<FormControlLabel value="donor" control={<Radio />} label="Donor" />
						<FormControlLabel value="project" control={<Radio />} label="Project" />
						<FormControlLabel value="target" control={<Radio />} label="Target" />
						<FormControlLabel
							value="budget_category"
							control={<Radio />}
							label="Budget Category"
						/>
					</Box>
				</RadioGroup>

				<Box className={classes.formWrapper} mt={5}>
					{globalSelect === "donor" && (
						<Tallyforms
							{...{
								initialValues: getInitialValues("donor"),
								inputFields: donorForm,
								validate,
								onSubmit: onCreate,
								onCancel,
								formAction: undefined,
								onUpdate,
							}}
						>
							<Box className={classes.childrenWrapper}>
								<RadioGroup
									aria-label="tally"
									name="row-radio-buttons-group"
									onChange={handleDonorSelection}
									value={donorSelect}
								>
									<Box display="flex" justifyContent="space-between">
										<FormControlLabel
											value="targetsAndSubTargets"
											control={<Radio />}
											label="Targets and Sub-Targets"
										/>
										<FormControlLabel
											value="projectBudgetCategory"
											control={<Radio />}
											label="Project Budget Category"
										/>
									</Box>
								</RadioGroup>
							</Box>
						</Tallyforms>
					)}

					{globalSelect === "project" && (
						<Tallyforms
							{...{
								initialValues: getInitialValues("project"),
								inputFields: projectForm,
								validate,
								onSubmit: onCreate,
								onCancel,
								formAction: undefined,
								onUpdate,
							}}
						>
							<Box className={classes.childrenWrapper}>
								<RadioGroup
									aria-label="tally"
									name="row-radio-buttons-group"
									onChange={handleDonorSelection}
									value={donorSelect}
								>
									<Box display="flex" justifyContent="space-between">
										<FormControlLabel
											value="targetsAndSubTargets"
											control={<Radio />}
											label="Targets and Sub-Targets"
										/>
										<FormControlLabel
											value="projectBudgetCategory"
											control={<Radio />}
											label="Project Budget Category"
										/>
									</Box>
								</RadioGroup>
							</Box>
						</Tallyforms>
					)}

					{globalSelect === "target" && (
						<Tallyforms
							{...{
								initialValues: getInitialValues("target"),
								inputFields: targetForm,
								validate,
								onSubmit: onCreate,
								onCancel,
								formAction: undefined,
								onUpdate,
							}}
						/>
					)}

					{globalSelect === "budget_category" && (
						<Tallyforms
							{...{
								initialValues: getInitialValues("budget_category"),
								inputFields: budgetCategoryForm,
								validate,
								onSubmit: onCreate,
								onCancel,
								formAction: undefined,
								onUpdate,
							}}
						/>
					)}
				</Box>
			</FIDialog>
		</Box>
	);
};

export default TallyContainer;
