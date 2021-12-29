import {
	ApolloClient,
	// DocumentNode,
	useApolloClient,
	useLazyQuery,
	useMutation,
} from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
// import { useSearchParams } from "react-router-dom";
import { FORM_ACTIONS } from "../../components/Forms/constant";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_ORG_DONOR } from "../../graphql/donor";
import { CREATE_PROJECT_DONOR, UPDATE_PROJECT_DONOR } from "../../graphql/donor/mutation";
import { GET_PROJ_DONORS } from "../../graphql/project";
import { IGET_DONOR } from "../../models/donor/query";
import {
	ICreateProjectDonor,
	ICreateProjectDonorVariables,
	IGetProjectDonor,
	IUpdateProjectDonorVariables,
} from "../../models/project/project";
import { setErrorNotification } from "../../reducers/notificationReducer";

//TODO move to a seperate file named useProjectDonorSelectInput

enum donorType {
	project = "PROJECT'S DONOR",
	organization = "ALL DONORS",
}

type donorSelectFieldOptionArray = (
	| {
			name: string;
			id: string;
	  }
	| {
			groupName: string;
	  }
)[];

const checkDonorType = ({
	projectDonors,
	donorId,
}: {
	projectDonors: IGetProjectDonor["projectDonors"];
	donorId: string;
}) => {
	for (let i = 0; i < projectDonors.length; i++) {
		if (projectDonors[i].donor.id === donorId && !projectDonors[i].deleted) {
			return donorType.project;
		}
	}
	return donorType.organization;
};

const getDonors = ({
	orgDonors,
	projectDonors,
	intl,
}: {
	orgDonors: IGET_DONOR["orgDonors"];
	projectDonors: IGetProjectDonor["projectDonors"];
	intl: IntlShape;
}) => {
	projectDonors = projectDonors?.filter((projectDonor) => !projectDonor?.deleted);
	let projectDonorIdHash = projectDonors.reduce((acc: { [key: string]: boolean }, projDonor) => {
		acc[projDonor.donor.id] = true;
		return acc;
	}, {});
	let donorArr = [];
	projectDonors.length &&
		donorArr.push(
			{
				groupName: intl.formatMessage({
					defaultMessage: "PROJECT'S DONOR",
					id: "selectInputProjectDonor",
					description: "This text will be heading of project donor",
				}),
			},
			...projectDonors
				.filter((donor) => donor)
				.map((projDonor) => ({
					name: projDonor?.donor?.name,
					id: projDonor?.donor?.id,
				}))
		);

	let filteredOrgDonor = orgDonors
		.filter((donor) => !projectDonorIdHash[donor.id])
		.map((donor) => ({ id: donor?.id, name: donor?.name }));

	filteredOrgDonor.length &&
		donorArr.push(
			{
				groupName: intl.formatMessage({
					defaultMessage: "ALL DONORS",
					id: "selectInputAllDonor",
					description: "This text will be heading of all donor",
				}),
			},
			...filteredOrgDonor
		);

	return donorArr;
};

const updateProjectDonorCache = ({
	projecttDonorCreated,
	apolloClient,
}: {
	apolloClient: ApolloClient<object>;
	projecttDonorCreated: ICreateProjectDonor;
}) => {
	try {
		let cachedProjectDonors = apolloClient.readQuery<IGetProjectDonor>({
			variables: { filter: { project: projecttDonorCreated.createProjDonor.project.id } },
			query: GET_PROJ_DONORS,
		});
		if (cachedProjectDonors) {
			apolloClient.writeQuery<IGetProjectDonor>({
				query: GET_PROJ_DONORS,
				data: {
					projectDonors: [
						{ ...projecttDonorCreated?.createProjDonor, deleted: false },
						...cachedProjectDonors.projectDonors,
					],
				},
				variables: { filter: { project: projecttDonorCreated.createProjDonor.project.id } },
			});
		}
	} catch (err) {
		console.error(err);
	}
};

const checkIfSelectedDonorIsDeletedProjectDonor = ({
	selectedDonor,
	projectDonors,
}: {
	selectedDonor: string;
	projectDonors: IGetProjectDonor["projectDonors"] | undefined;
}) =>
	projectDonors?.some(
		(projectDonor) => projectDonor?.donor?.id === selectedDonor && projectDonor?.deleted
	);

const getProjectDonorIdForGivenDonor = (
	projectDonors: IGetProjectDonor["projectDonors"],
	donorId: string
) => projectDonors.find((projectDonor) => projectDonor.donor.id === donorId)?.id;

const checkIfCreateProjectDonorCheckBoxShouldBeShown = ({
	selectedDonor,
	formAction,
	projectDonors,
}: {
	selectedDonor: string;
	formAction: FORM_ACTIONS;
	projectDonors: IGetProjectDonor["projectDonors"] | undefined;
}) => {
	if (!projectDonors || !selectedDonor || formAction !== FORM_ACTIONS.UPDATE) {
		return false;
	}
	return checkIfSelectedDonorIsDeletedProjectDonor({ projectDonors, selectedDonor });
};

let selectedDonorGlobal = "";
let createProjectDonorCheckboxValGlobal = false;
let showCreateProjectDonorCheckboxGlobal = false;

const useProjectDonorSelectInput = ({
	formAction,
	initialDonorId,
}: {
	formAction: FORM_ACTIONS;
	initialDonorId: string;
}) => {
	const [getProjectDonors, { data: projectDonors }] = useLazyQuery<IGetProjectDonor>(
		GET_PROJ_DONORS
	);
	const [getOrganizationDonors, { data: orgDonors }] = useLazyQuery<IGET_DONOR>(GET_ORG_DONOR);
	const apolloClient = useApolloClient();
	const [createProjectDonorMutation, { loading: creatingProjectDonors }] = useMutation<
		ICreateProjectDonor,
		ICreateProjectDonorVariables
	>(CREATE_PROJECT_DONOR, {
		onCompleted: (data) => {
			updateProjectDonorCache({ apolloClient, projecttDonorCreated: data });
		},
	});
	const [updateProjectDonorMutation] = useMutation<
		ICreateProjectDonor,
		IUpdateProjectDonorVariables
	>(UPDATE_PROJECT_DONOR);
	const notificationDispatch = useNotificationDispatch();

	const [selectedDonor, setSelectedDonor] = useState<string>("");

	const [createProjectDonorCheckboxVal, setCreateProjectDonorCheckboxVal] = useState<boolean>(
		false
	);
	const [showCreateProjectDonorCheckbox, setShowCreateProjectDonorCheckbox] = useState<boolean>(
		false
	);

	useEffect(() => {
		setSelectedDonor(initialDonorId);
	}, [initialDonorId]);

	const intl = useIntl();
	const dashboardData = useDashBoardData();
	const projectId = dashboardData?.project?.id;
	const organizationId = dashboardData?.organization?.id;

	useEffect(() => {
		createProjectDonorCheckboxValGlobal = createProjectDonorCheckboxVal;
	}, [createProjectDonorCheckboxVal]);

	// useEffect(() => {
	selectedDonorGlobal = selectedDonor;
	// }, [selectedDonor]);

	useEffect(() => {
		showCreateProjectDonorCheckboxGlobal = !!showCreateProjectDonorCheckbox;
		if (!showCreateProjectDonorCheckbox) {
			setCreateProjectDonorCheckboxVal(false);
		}
	}, [showCreateProjectDonorCheckbox]);

	useEffect(() => {
		return () => {
			selectedDonorGlobal = "";
			createProjectDonorCheckboxValGlobal = false;
			showCreateProjectDonorCheckboxGlobal = false;
		};
	}, []);

	useEffect(() => {
		if (projectId) {
			getProjectDonors({
				variables: {
					filter: {
						project: projectId,
					},
				},
			});
		}
	}, [getProjectDonors, projectId]);

	useEffect(() => {
		if (organizationId) {
			getOrganizationDonors({
				variables: {
					filter: {
						organization: organizationId,
					},
				},
			});
		}
	}, [getOrganizationDonors, organizationId]);

	useEffect(() => {
		if (selectedDonor && projectDonors) {
			setShowCreateProjectDonorCheckbox(
				!!checkIfCreateProjectDonorCheckBoxShouldBeShown({
					formAction,
					projectDonors: projectDonors?.projectDonors,
					selectedDonor,
				})
			);
		}
	}, [selectedDonor, formAction, projectDonors]);

	const selectedDonorInputOptionArray: donorSelectFieldOptionArray = useMemo(() => {
		if (orgDonors && projectDonors) {
			return getDonors({
				orgDonors: orgDonors?.orgDonors,
				projectDonors: projectDonors?.projectDonors,
				intl,
			});
		}
		return [];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getDonors, orgDonors, projectDonors, intl]);

	const createProjectDonor = async () => {
		try {
			let selectedDonorProjectDonorId = getProjectDonorIdForGivenDonor(
				projectDonors?.projectDonors || [],
				selectedDonorGlobal
			);
			let donorTypeSelected = checkDonorType({
				projectDonors: projectDonors?.projectDonors || [],
				donorId: selectedDonorGlobal,
			});
			if (donorTypeSelected === donorType.organization) {
				if (
					formAction === FORM_ACTIONS.CREATE ||
					(formAction === FORM_ACTIONS.UPDATE && !showCreateProjectDonorCheckboxGlobal)
				) {
					if (selectedDonorProjectDonorId) {
						await updateProjectDonorMutation({
							variables: {
								id: selectedDonorProjectDonorId as string,
								input: {
									donor: selectedDonorGlobal,
									project: `${projectId}`,
									deleted: false,
								},
							},
						});
					} else {
						const createdProjDonor = await createProjectDonorMutation({
							variables: {
								input: { donor: selectedDonorGlobal, project: `${projectId}` },
							},
						});
						selectedDonorProjectDonorId = createdProjDonor.data?.createProjDonor.id;
					}
				} else if (
					formAction === FORM_ACTIONS.UPDATE &&
					showCreateProjectDonorCheckboxGlobal &&
					createProjectDonorCheckboxValGlobal
				) {
					await updateProjectDonorMutation({
						variables: {
							id: selectedDonorProjectDonorId as string,
							input: {
								donor: selectedDonorGlobal,
								project: `${projectId}`,
								deleted: false,
							},
						},
					});
				}
			}
			return selectedDonorProjectDonorId;
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
		}
	};

	return {
		selectedDonorInputOptionArray,
		creatingProjectDonors,
		showCreateProjectDonorCheckbox,
		createProjectDonor,
		setSelectedDonor,
		setCreateProjectDonorCheckboxVal,
	};
};

export { useProjectDonorSelectInput };
