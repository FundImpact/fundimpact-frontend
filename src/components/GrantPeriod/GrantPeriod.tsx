import { useApolloClient, useMutation, useQuery, useLazyQuery, ApolloClient } from "@apollo/client";
import React, { useEffect } from "react";
import { useIntl, FormattedMessage } from "react-intl";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { CREATE_GRANT_PERIOD, UPDATE_GRANT_PERIOD } from "../../graphql/grantPeriod/mutation";
import { FETCH_GRANT_PERIODS } from "../../graphql/grantPeriod/query";
import { FORM_ACTIONS } from "../../models/constants";
import { GrantPeriodDialogProps } from "../../models/grantPeriod/grantPeriodDialog";
import { IGrantPeriod, DonorType } from "../../models/grantPeriod/grantPeriodForm";
import { setSuccessNotification } from "../../reducers/notificationReducer";
import { CommonFormTitleFormattedMessage } from "../../utils/commonFormattedMessage";
import FormDialog from "../FormDialog";
import { GranPeriodForm } from "../Forms/GrantPeriod/GranPeriod";
import {
	IGetProjectDonor,
	ICreateProjectDonor,
	ICreateProjectDonorVariables,
} from "../../models/project/project";
import { IGET_DONOR } from "../../models/donor/query";
import { GET_PROJ_DONORS } from "../../graphql/project";
import { GET_ORG_DONOR } from "../../graphql/donor";
import { CREATE_PROJECT_DONOR } from "../../graphql/donor/mutation";

const getDonors = ({
	projectDonors,
	orgDonors,
}: {
	projectDonors: IGetProjectDonor["projectDonors"];
	orgDonors: IGET_DONOR["orgDonors"];
}) => {
	let projectDonorIdHash = projectDonors.reduce((acc: { [key: string]: boolean }, projDonor) => {
		acc[projDonor.donor.id] = true;
		return acc;
	}, {});
	let donorArr = [];
	projectDonors.length &&
		donorArr.push(
			{
				groupName: (
					<FormattedMessage
						id="selectInputProjectDonor"
						defaultMessage="PROJECT'S DONOR"
						description="This text will be heading of project donor"
					/>
				),
			},
			...projectDonors
				.filter((donor) => donor)
				.map((projDonor) => ({
					id: projDonor.donor.id,
					name: projDonor.donor.name,
				}))
		);

	let filteredOrgDonor = orgDonors
		.filter((donor) => !projectDonorIdHash[donor.id])
		.map((donor) => ({ id: donor.id, name: donor.name }));

	filteredOrgDonor.length &&
		donorArr.push(
			{
				groupName: (
					<FormattedMessage
						id="selectInputAllDonor"
						defaultMessage="ALL DONOR"
						description="This text will be heading of all donor"
					/>
				),
			},
			...filteredOrgDonor
		);

	return donorArr;
};

const checkDonorType = ({
	projectDonors,
	donorId,
}: {
	projectDonors: IGetProjectDonor["projectDonors"];
	donorId: string;
}) => {
	for (let i = 0; i < projectDonors.length; i++) {
		if (projectDonors[i].donor.id === donorId) {
			return DonorType.project;
		}
	}
	return DonorType.organization;
};

const updateProjectDonorCache = ({
	apolloClient,
	projectDonorCreated,
}: {
	apolloClient: ApolloClient<object>;
	projectDonorCreated: ICreateProjectDonor;
}) => {
	try {
		let cachedProjectDonors = apolloClient.readQuery<IGetProjectDonor>({
			variables: { filter: { project: projectDonorCreated.createProjDonor.project.id } },
			query: GET_PROJ_DONORS,
		});
		if (cachedProjectDonors) {
			apolloClient.writeQuery<IGetProjectDonor>({
				variables: { filter: { project: projectDonorCreated.createProjDonor.project.id } },
				query: GET_PROJ_DONORS,
				data: {
					projectDonors: [
						projectDonorCreated.createProjDonor,
						...cachedProjectDonors.projectDonors,
					],
				},
			});
		}
	} catch (err) {
		console.error(err);
	}
};

function GrantPeriodDialog({ open, onClose, action, ...rest }: GrantPeriodDialogProps) {
	const dashboardData = useDashBoardData();
	const apolloClient = useApolloClient();
	const cache = apolloClient.cache;

	const [createProjectDonor] = useMutation<ICreateProjectDonor, ICreateProjectDonorVariables>(
		CREATE_PROJECT_DONOR,
		{
			onCompleted: (data) => {
				updateProjectDonorCache({ apolloClient, projectDonorCreated: data });
			},
		}
	);

	const [getProjectDonors, { data: donorList }] = useLazyQuery(GET_PROJ_DONORS);
	let [getOrganizationDonors, { data: orgDonors }] = useLazyQuery<IGET_DONOR>(GET_ORG_DONOR);

	useEffect(() => {
		if (dashboardData?.organization?.id) {
			getOrganizationDonors({
				variables: {
					filter: {
						organization: dashboardData?.organization?.id,
					},
				},
			});
		}
	}, [getOrganizationDonors]);

	useEffect(() => {
		if (dashboardData?.project?.id) {
			getProjectDonors({
				variables: {
					filter: {
						project: dashboardData?.project?.id,
					},
				},
			});
		}
	}, [getProjectDonors]);

	const allDonors = getDonors({
		orgDonors: orgDonors?.orgDonors || [],
		projectDonors: donorList?.projectDonors || [],
	});

	const notificationDispatch = useNotificationDispatch();

	const onCancel = () => {
		onClose();
	};

	//change type
	const onCreatingNewGrantPeriodSuccess = (newGrantPeriod: any, action: FORM_ACTIONS) => {
		console.log("newGrantPeriod :>> ", newGrantPeriod);
		try {
			const cacheData = cache.readQuery({
				query: FETCH_GRANT_PERIODS,
				variables: { filter: { project: dashboardData?.project?.id } },
			});
			let oldList = (cacheData as any).grantPeriodsProjectList;
			let newList = oldList ? [...oldList] : [];
			if (action === FORM_ACTIONS.CREATE) newList = [{ ...newGrantPeriod }, ...newList];
			else {
				const indexFound = newList.find((data) => data.id === newGrantPeriod.id);
				if (indexFound > -1) {
					newList[indexFound] = { ...newGrantPeriod };
				}
			}
			console.log(`new list`, newList);
			let tt = cache.writeQuery({
				query: FETCH_GRANT_PERIODS,
				data: { grantPeriodsProjectList: newList },
				variables: { filter: { project: dashboardData?.project?.id } },
				broadcast: true,
			});
		} catch (err) {
			console.error(err);
		}

		try {
			const garntPeriodList: any = cache.readQuery({
				query: FETCH_GRANT_PERIODS,
				variables: {
					filter: { project: dashboardData?.project?.id, donor: newGrantPeriod.donor.id },
				},
			});
			let newGrantPeriodList = garntPeriodList
				? [...garntPeriodList!.grantPeriodsProjectList]
				: [];
			if (FORM_ACTIONS.CREATE)
				newGrantPeriodList = [{ ...newGrantPeriod }, ...newGrantPeriodList];
			else {
				const indexFound = newGrantPeriodList.find((data) => data.id === newGrantPeriod.id);
				if (indexFound > -1) {
					newGrantPeriodList[indexFound] = { ...newGrantPeriod };
				}
			}
			cache.writeQuery({
				query: FETCH_GRANT_PERIODS,
				variables: {
					filter: { project: dashboardData?.project?.id, donor: newGrantPeriod.donor.id },
				},
				data: {
					grantPeriodsProjectList: newGrantPeriodList,
				},
			});
			// console.log("garntPeriodList :>> ", garntPeriodList);
		} catch (err) {
			console.error(err);
		}

		setTimeout(() => {
			onClose();
		}, 2000);
	};

	const [createGrantPeriod, { loading }] = useMutation(CREATE_GRANT_PERIOD, {
		onCompleted: (data) => {
			const newGrantPeriod = {
				...data.createGrantPeriodsProjectDetail,
				__typename: "GrantPeriodsProject",
			};
			console.log(`created data`, newGrantPeriod);
			notificationDispatch(setSuccessNotification("Grant Period Created."));

			onCreatingNewGrantPeriodSuccess(newGrantPeriod, FORM_ACTIONS.CREATE);
		},
	});

	const [updateGrantPeriod, { loading: updating }] = useMutation(UPDATE_GRANT_PERIOD, {
		onCompleted: (data) => {
			const newGrantPeriod = {
				...data.createGrantPeriodsProjectDetail,
				__typename: "GrantPeriodsProject",
			};
			notificationDispatch(setSuccessNotification("Grant Period Updated."));

			onCreatingNewGrantPeriodSuccess(newGrantPeriod, FORM_ACTIONS.UPDATE);
		},
	});

	const onSubmit = async (value: IGrantPeriod) => {
		let donorTypeSelected = checkDonorType({
			projectDonors: donorList?.projectDonors || [],
			donorId: value?.donor || "",
		});
		if (donorTypeSelected === DonorType.organization) {
			let createdProjectDonor = await createProjectDonor({
				variables: {
					input: {
						donor: value?.donor || "",
						project: `${dashboardData?.project?.id}` || "",
					},
				},
			});
		}

		if (action === FORM_ACTIONS.CREATE)
			return createGrantPeriod({ variables: { input: { ...value } } });
		const id = value.id;
		delete value["id"];
		delete (value as any)["__typename"];

		if (action === FORM_ACTIONS.UPDATE)
			return updateGrantPeriod({ variables: { input: { ...value }, id } });
	};

	let defaultValues: IGrantPeriod = {
		name: "",
		short_name: "",
		description: "",
		start_date: "",
		end_date: "",
		project: "",
		donor: "",
		id: "",
	};

	if (action === FORM_ACTIONS.UPDATE) {
		defaultValues = {
			...(rest as {
				initialValues: IGrantPeriod;
			}).initialValues,
		};
	}
	const intl = useIntl();
	let { newOrEdit } = CommonFormTitleFormattedMessage(action);

	const updateGrantPeriodSubtitle = intl.formatMessage({
		id: "GrantPeriodUpdateFormSubtitle",
		defaultMessage: "Update Grant Period Of Project",
		description: `This text will be show on Grant Period form for subtitle`,
	});

	const createGrantPeriodSubtitle = intl.formatMessage({
		id: "GrantPeriodCreateFormSubtitle",
		defaultMessage: "Create Grant Period For Project",
		description: `This text will be show on Grant Period form for subtitle`,
	});

	return (
		<div>
			<FormDialog
				open={open}
				loading={loading || updating}
				title={
					newOrEdit +
					" " +
					intl.formatMessage({
						id: "grantPeriodFormTitle",
						defaultMessage: "Grant Period",
						description: `This text will be show on Grant Periodform for title`,
					})
				}
				subtitle={
					action == FORM_ACTIONS.CREATE
						? createGrantPeriodSubtitle
						: updateGrantPeriodSubtitle
				}
				workspace={dashboardData?.project?.workspace?.name || ""}
				handleClose={onClose}
				project={dashboardData?.project?.name || ""}
			>
				{action === FORM_ACTIONS.CREATE ? (
					<GranPeriodForm
						action={FORM_ACTIONS.CREATE}
						onCancel={onCancel}
						onSubmit={onSubmit}
						allDonors={allDonors}
					/>
				) : (
					<GranPeriodForm
						action={FORM_ACTIONS.UPDATE}
						onCancel={onCancel}
						onSubmit={onSubmit}
						initialValues={defaultValues}
						allDonors={allDonors}
					/>
				)}
			</FormDialog>
		</div>
	);
}

export default GrantPeriodDialog;
