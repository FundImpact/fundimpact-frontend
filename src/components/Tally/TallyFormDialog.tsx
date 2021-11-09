import { useLazyQuery } from "@apollo/client";
import { Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { GET_PROJECTS } from "../../graphql";
import { GET_BUDGET_SUB_TARGETS, GET_BUDGET_TARGET_PROJECT } from "../../graphql/Budget";
import { GET_PROJ_DONORS } from "../../graphql/project";
import FIDialog from "../Dialog/Dialog";
import TallyFormContainer from "./TallyFormContainer";
import TallyFormRadioButtons from "./TallyFormRadioButtons";
import {
	donorForm,
	projectForm,
	targetForm,
	budgetCategoryForm,
	tallyFormRadioButtons,
	targetAndSubTargetRadios,
} from "./inputField.json";
import { IProjectDonor } from "../../models/project/project";

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

const TallyFormDialog = ({
	type,
	isOpenTallyForm,
	closeTallyForm,
}: {
	type: string;
	isOpenTallyForm: boolean;
	closeTallyForm: () => void;
}) => {
	const classes = useStyle();
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [currentProject, setCurrentProject] = useState<null | string | number>(null);
	const [currentBudgetTarget, setCurrentBudgetTarget] = useState<null | string | number>(null);
	const [globalSelect, setGlobalSelect] = useState<string>("donor");
	const [donorSelect, setDonorSelect] = useState<string>("targetsAndSubTargets");
	const [projectSelect, setProjectSelect] = useState<string>("targetsAndSubTargets");

	const [getProjects, projectsResponse] = useLazyQuery(GET_PROJECTS);
	const [getDonors, donorsResponse] = useLazyQuery(GET_PROJ_DONORS);
	const [getBudgetTarget, budgetTargetResponse] = useLazyQuery(GET_BUDGET_TARGET_PROJECT);
	const [getBudgetSubTarget, budgetSubTargetResponse] = useLazyQuery(GET_BUDGET_SUB_TARGETS);

	useEffect(() => {
		if (globalSelect === "donor") {
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
			getProjects();
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
	const handleProjectSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProjectSelect(e.target.value);
	};

	const validate = (values: any) => {
		let errors: Partial<any> = {};
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

	projectForm[0].getInputValue = (projectId: string) => {
		setCurrentProject(projectId);
	};

	donorForm[2].getInputValue = (targetId: string) => {
		setCurrentBudgetTarget(targetId);
	};

	projectForm[1].getInputValue = (targetId: string) => {
		setCurrentBudgetTarget(targetId);
	};

	return (
		<Box p={2}>
			<FIDialog open={isOpenTallyForm} handleClose={closeTallyForm} header="Cost Center Name">
				<TallyFormRadioButtons
					value={globalSelect}
					onChange={handleGlobalSelection}
					radios={tallyFormRadioButtons}
				/>

				<Box className={classes.formWrapper} mt={5}>
					{globalSelect === "donor" && (
						<TallyFormContainer
							initialValues={getInitialValues("donor")}
							inputFields={donorForm}
							validate={validate}
							onSubmit={onsubmit}
							onCancel={onCancel}
							onUpdate={onUpdate}
						>
							<Box className={classes.childrenWrapper}>
								<TallyFormRadioButtons
									radios={targetAndSubTargetRadios}
									value={donorSelect}
									onChange={handleDonorSelection}
								/>
							</Box>
						</TallyFormContainer>
					)}

					{globalSelect === "project" && (
						<TallyFormContainer
							initialValues={getInitialValues("project")}
							inputFields={projectForm}
							validate={validate}
							onSubmit={onsubmit}
							onCancel={onCancel}
							onUpdate={onUpdate}
						>
							<Box className={classes.childrenWrapper}>
								<TallyFormRadioButtons
									radios={targetAndSubTargetRadios}
									value={projectSelect}
									onChange={handleProjectSelection}
								/>
							</Box>
						</TallyFormContainer>
					)}

					{globalSelect === "target" && (
						<TallyFormContainer
							initialValues={getInitialValues("target")}
							inputFields={targetForm}
							validate={validate}
							onSubmit={onsubmit}
							onCancel={onCancel}
							onUpdate={onUpdate}
						/>
					)}

					{globalSelect === "budget_category" && (
						<TallyFormContainer
							initialValues={getInitialValues("budget_category")}
							inputFields={budgetCategoryForm}
							validate={validate}
							onSubmit={onsubmit}
							onCancel={onCancel}
							onUpdate={onUpdate}
						/>
					)}
				</Box>
			</FIDialog>
		</Box>
	);
};

export default TallyFormDialog;
