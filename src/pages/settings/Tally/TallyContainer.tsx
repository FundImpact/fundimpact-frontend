import React, { useEffect, useState } from "react";
import { Box, Button, FormControlLabel, RadioGroup, Radio } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useLazyQuery } from "@apollo/client";
import FIDialog from "../../../components/Dialog/Dialog";
import { donorForm, projectForm, targetForm, budgetCategoryForm } from "./inputField.json";
import Tallyforms from "../../../components/Forms/Tally";
import { GET_ORG_DONOR } from "../../../graphql/donor";
import { GET_PROJECTS } from "../../../graphql";
import { GET_BUDGET_SUB_TARGETS, GET_BUDGET_TARGET_PROJECT } from "../../../graphql/Budget";
import { GET_DELIVERABLE_TARGET_BY_PROJECT } from "../../../graphql/Deliverable/target";
import { GET_PROJ_DONORS } from "../../../graphql/project";
import { IProjectDonor } from "../../../models/project/project";

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
	const [currentProject, setCurrentProject] = useState<null | string | number>(null);
	const [currentBudgetTarget, setCurrentBudgetTarget] = useState<null | string | number>(null);
	const [globalSelect, setGlobalSelect] = useState<string>("donor");
	const [donorSelect, setDonorSelect] = useState<string>("targetsAndSubTargets");

	const [getProjects, projectsResponse] = useLazyQuery(GET_PROJECTS);
	const [getDonors, donorsResponse] = useLazyQuery(GET_PROJ_DONORS);
	const [getBudgetTarget, budgetTargetResponse] = useLazyQuery(GET_BUDGET_TARGET_PROJECT);
	const [getBudgetSubTarget, budgetSubTargetResponse] = useLazyQuery(GET_BUDGET_SUB_TARGETS);

	console.log("donorsResponse: ", donorsResponse.data);

	useEffect(() => {
		if (globalSelect === "donor") {
			// getProjects();
			// if (currentProject) {
			// 	getDonors({
			// 		variables: {
			// 			filter: {
			// 				project: currentProject,
			// 			},
			// 		},
			// 	});
			// }
			getDonors();

			if (donorSelect === "targetsAndSubTargets") {
				donorForm[4].optionsArray = [];
				getBudgetTarget();
				if (currentBudgetTarget) {
					getBudgetSubTarget({
						variables: {
							filter: {
								budget_targets_project: currentBudgetTarget,
							},
						},
					});
				}
			}

			if (donorSelect === "projectBudgetCategory") {
				donorForm[2].optionsArray = [];
				donorForm[3].optionsArray = [];
				if (currentProject) {
					getBudgetTarget({
						variables: {
							filter: {
								project_with_budget_targets: {
									project: currentProject,
								},
							},
						},
					});
				}
			}
		}

		if (globalSelect === "project") {
		}
	}, [globalSelect, donorSelect, currentProject, currentBudgetTarget]);

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

	if (donorsResponse.data) {
		donorForm[0].optionsArray = donorsResponse.data.projectDonors.map(
			(donor: IProjectDonor) => donor.donor
		);

		donorForm[1].optionsArray = donorsResponse.data.projectDonors.map(
			(donor: IProjectDonor) => donor.project
		);
	}

	// if (projectsResponse.data) {
	// 	donorForm[0].optionsArray = donorsResponse.data.projectDonors.map(
	// 		(donor: IProjectDonor) => donor.donor
	// 	);

	// 	donorForm[1].optionsArray = donorsResponse.data.projectDonors.map(
	// 		(donor: IProjectDonor) => donor.project
	// 	);
	// }

	if (budgetTargetResponse.data) {
		donorForm[2].optionsArray = budgetTargetResponse.data.projectBudgetTargets;
		donorForm[4].optionsArray = budgetTargetResponse.data.projectBudgetTargets;

		projectForm[1].optionsArray = budgetTargetResponse.data.projectBudgetTargets;
		projectForm[3].optionsArray = budgetTargetResponse.data.projectBudgetTargets;

		targetForm[0].optionsArray = budgetTargetResponse.data.projectBudgetTargets;

		budgetCategoryForm[0].optionsArray = budgetTargetResponse.data.projectBudgetTargets;
	}

	if (budgetSubTargetResponse.data) {
		donorForm[3].optionsArray = budgetSubTargetResponse.data.budgetSubTargets;

		projectForm[2].optionsArray = budgetSubTargetResponse.data.budgetSubTargets;
	}

	if (projectsResponse.data) {
		projectForm[0].optionsArray = projectsResponse.data.orgProject;
	}

	// donorForm[0].getInputValue = (projectId: string) => {
	// 	setCurrentProject(projectId);
	// };

	projectForm[0].getInputValue = (projectId: string) => {
		setCurrentProject(projectId);
	};

	donorForm[2].getInputValue = (targetId: string) => {
		setCurrentBudgetTarget(targetId);
	};

	projectForm[1].getInputValue = (targetId: string) => {
		setCurrentBudgetTarget(targetId);
	};

	// useEffect(() => {
	// 	console.log("currentBudgetTarget: ", currentBudgetTarget);
	// }, [currentBudgetTarget]);

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
