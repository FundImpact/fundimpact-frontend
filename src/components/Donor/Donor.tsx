import React, { useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { IDONOR, IDONOR_PROPS } from "../../models/donor";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { addDonorForm, addDonorFormSelectFields } from "./inputField.json";
import { IInputField } from "../../models";
import FormDialog from "../FormDialog";
import CommonForm from "../Forms/CommonForm";
import { CREATE_ORG_DONOR, UPDATE_ORG_DONOR } from "../../graphql/donor/mutation";
import { GET_ORG_DONOR } from "../../graphql/donor";
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

function Donor(props: IDONOR_PROPS) {
	const [createOrgDonor, { loading: creatingDonor }] = useMutation(CREATE_ORG_DONOR);
	const [updateOrgDonor, { loading: updatingDonor }] = useMutation(UPDATE_ORG_DONOR);
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
			await createOrgDonor({
				variables: {
					input: { ...values, organization: dashboardData?.organization?.id },
				},
				update: (store, { data: { createOrgDonor } }) => {
					try {
						const data = store.readQuery<IGET_DONOR>({
							query: GET_ORG_DONOR,
						});

						let orgDonors = data?.orgDonors ? data?.orgDonors : [];

						store.writeQuery<IGET_DONOR>({
							query: GET_ORG_DONOR,
							data: {
								orgDonors: [...orgDonors, createOrgDonor],
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

			await updateOrgDonor({
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
