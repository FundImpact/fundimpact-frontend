import React, { useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { IDONOR, IDonorProps } from "../../models/donor";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { addDonorForm, addDonorFormSelectFields } from "./inputField.json";
import { IInputField } from "../../models";
import FormDialog from "../FormDialog";
import CommonForm from "../Forms/CommonForm";
import { CREATE_ORG_DONOR, UPDATE_ORG_DONOR } from "../../graphql/donor/mutation";
import { GET_ORG_DONOR, GET_DONOR_COUNT } from "../../graphql/donor";
import { FORM_ACTIONS } from "../../models/constants";
import { compareObjectKeys } from "../../utils/index";
import { IGET_DONOR } from "../../models/donor/query";
import { GET_COUNTRY_LIST } from "../../graphql/";

let inputFields: IInputField[] = addDonorForm;

const defaultFormValues: IDONOR = {
	country: "",
	legal_name: "",
	name: "",
	short_name: "",
};

const validate = (values: IDONOR) => {
	let errors: Partial<IDONOR> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	if (!values.country) {
		errors.country = "Country is required";
	}
	if (!values.legal_name) {
		errors.legal_name = "Legal name is required";
	}
	if (!values.short_name) {
		errors.short_name = "Short name is required";
	}
	return errors;
};

function Donor(props: IDonorProps) {
	const [createDonor, { loading: creatingDonor }] = useMutation(CREATE_ORG_DONOR);
	const [updateDonor, { loading: updatingDonor }] = useMutation(UPDATE_ORG_DONOR);
	const [getCountryList] = useLazyQuery(GET_COUNTRY_LIST, {
		onCompleted: ({ countryList }) => {
			addDonorFormSelectFields[0].optionsArray = countryList;
		},
	});

	const initialValues =
		props.formAction == FORM_ACTIONS.CREATE ? defaultFormValues : props.initialValues;

	const notificationDispatch = useNotificationDispatch();

	const dashboardData = useDashBoardData();

	const onCreate = async (values: IDONOR) => {
		try {
			await createDonor({
				variables: {
					input: { ...values, organization: dashboardData?.organization?.id },
				},
				update: async (store, { data: { createOrgDonor } }) => {
					try {
						const count = await store.readQuery<{ orgDonorsCount: number }>({
							query: GET_DONOR_COUNT,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
						});

						store.writeQuery<{ orgDonorsCount: number }>({
							query: GET_DONOR_COUNT,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								orgDonorsCount: count!.orgDonorsCount + 1,
							},
						});

						let limit = 0;
						if (count) {
							limit = count.orgDonorsCount;
						}

						const data = await store.readQuery<IGET_DONOR>({
							query: GET_ORG_DONOR,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
						});

						let orgDonors = data?.orgDonors ? data?.orgDonors : [];

						store.writeQuery<IGET_DONOR>({
							query: GET_ORG_DONOR,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
							data: {
								orgDonors: [createOrgDonor, ...orgDonors],
							},
						});

						store.writeQuery<IGET_DONOR>({
							query: GET_ORG_DONOR,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								orgDonors: [createOrgDonor, ...orgDonors],
							},
						});
					} catch (err) {}
				},
			});
			notificationDispatch(setSuccessNotification("Donor Creation Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification("Donor Creation Failure"));
		} finally {
			props.handleClose();
		}
	};

	const onUpdate = async (values: IDONOR) => {
		try {
			if (compareObjectKeys(values, initialValues)) {
				props.handleClose();
				return;
			}
			delete values.id;

			await updateDonor({
				variables: {
					id: initialValues.id,
					input: {
						...values,
						organization: dashboardData?.organization?.id,
					},
				},
			});
			notificationDispatch(setSuccessNotification("Donor Updation Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification("Donor Updation Failure"));
		} finally {
			props.handleClose();
		}
	};

	useEffect(() => {
		getCountryList();
	}, []);

	return (
		<>
			<FormDialog
				handleClose={props.handleClose}
				open={props.open}
				loading={creatingDonor || updatingDonor}
				title="Add Donor"
				subtitle="Physical addresses of your organizatin like headquater, branch etc."
				workspace={""}
				project={""}
			>
				<CommonForm
					initialValues={initialValues}
					validate={validate}
					onSubmit={onCreate}
					onCancel={props.handleClose}
					inputFields={inputFields}
					selectFields={addDonorFormSelectFields}
					formAction={props.formAction}
					onUpdate={onUpdate}
				/>
			</FormDialog>
		</>
	);
}

export default Donor;
