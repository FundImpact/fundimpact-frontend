import { useMutation } from "@apollo/client";
import React from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import {
	CREATE_DELIVERABLE_LINEITEM_FYDONOR,
	GET_DELIVERABLE_LINEITEM_FYDONOR,
	UPDATE_DELIVERABLE_LINEITEM_FYDONOR,
} from "../../graphql/Deliverable/trackline";
import { FORMOF, TracklineDonorFormProps } from "../../models/TracklineDonor/tracklineDonor";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import FullScreenLoader from "../commons/GlobalLoader";
import { FORM_ACTIONS } from "../Forms/constant";
import DonorYearTagForm from "../Forms/FYDonorYearTagsForm/FYDonorYearTags";

/*	financial_year: props.organizationCountry &&
	props.organizationCountry === element.donor.country.id
	? props.TracklineFyId : "" */

export function getTracklineDonorsInitialValues(props: TracklineDonorFormProps) {
	let projectDonors: any = [];
	if (props.type === FORM_ACTIONS.UPDATE) {
		/*Removing already mapped donors from donor list*/
		let afterRemovingAlreadyMappedDonorsList: any = [];
		props?.donors?.forEach((element) => {
			if (!props.alreadyMappedDonorsIds?.includes(element.id))
				afterRemovingAlreadyMappedDonorsList.push(element);
		});
		projectDonors = afterRemovingAlreadyMappedDonorsList;
	} else {
		/*All donors if props.type === FORM_ACTION.CREATE */
		projectDonors = props.donors;
	}

	let initialValuesObj: any = {};

	projectDonors?.forEach(
		(element: {
			id: string;
			name: string;
			donor: { id: string; name: string; country: { id: string; name: string } };
		}) => {
			/*if Donor Id is 15 then it details will be stored in initialValues[15mapValues] */
			initialValuesObj[`${element.id}mapValues`] = {
				financial_year: "", //
				grant_periods_project: "",
				project_donor: element.id,
			};
			if (props.formType === FORMOF.DELIVERABLE)
				initialValuesObj[`${element.id}mapValues`].deliverable_tracking_lineitem =
					props.TracklineId;
			else
				initialValuesObj[`${element.id}mapValues`].impact_tracking_lineitem =
					props.TracklineId;
		}
	);
	return props.type === FORM_ACTIONS.UPDATE
		? { ...initialValuesObj, ...props.data }
		: initialValuesObj;
}

function DeliverableTracklineDonorYearTags(props: TracklineDonorFormProps) {
	const dashboardData = useDashBoardData();
	let organizationCountry = dashboardData?.organization?.country?.id;
	const notificationDispatch = useNotificationDispatch();
	let initialValues: any = getTracklineDonorsInitialValues({
		...props,
		organizationCountry,
		formType: FORMOF.DELIVERABLE,
	});
	const [createDeliverableLineitemFydonor, { loading }] = useMutation(
		CREATE_DELIVERABLE_LINEITEM_FYDONOR,
		{
			onCompleted(data) {
				notificationDispatch(
					setSuccessNotification(
						"Deliverable Trackline Financial year tags created successfully!"
					)
				);
				props.onCancel();
			},
			onError(data) {
				notificationDispatch(
					setErrorNotification(
						"Deliverable Trackline Financial year tags creation Failed !"
					)
				);
			},
		}
	);

	const [updateDeliverableLineitemFydonor, { loading: updateLoading }] = useMutation(
		UPDATE_DELIVERABLE_LINEITEM_FYDONOR,
		{
			onCompleted(data) {
				notificationDispatch(
					setSuccessNotification(
						"Deliverable Trackline Financial year tags updated successfully!"
					)
				);
				props.onCancel();
			},
			onError(data) {
				notificationDispatch(
					setErrorNotification(
						"Deliverable Trackline Financial year tags updation Failed !"
					)
				);
			},
		}
	);

	const onSubmit = (value: any) => {
		let finalvalues: any = Object.values(value);
		console.log("finalValues", finalvalues);
		for (let i = 0; i < finalvalues.length; i++) {
			let deliverable_lineitem_fy_id = finalvalues[i]?.id;
			if (deliverable_lineitem_fy_id) {
				delete (finalvalues[i] as any).id;
				updateDeliverableLineitemFydonor({
					variables: { id: deliverable_lineitem_fy_id, input: finalvalues[i] },
					refetchQueries: [
						{
							query: GET_DELIVERABLE_LINEITEM_FYDONOR,
							variables: {
								filter: { deliverable_tracking_lineitem: props.TracklineId },
							},
						},
					],
				});
			} else {
				createDeliverableLineitemFydonor({
					variables: { input: finalvalues[i] },
					refetchQueries: [
						{
							query: GET_DELIVERABLE_LINEITEM_FYDONOR,
							variables: {
								filter: { deliverable_tracking_lineitem: props.TracklineId },
							},
						},
					],
				});
			}
		}
	};

	const validate = (values: any) => {
		let errors: Partial<any> = {};
		props.donors?.forEach(
			(element: {
				id: string;
				name: string;
				donor: { id: string; name: string; country: { id: string; name: string } };
			}) => {
				if (!values[`${element.id}mapValues.grant_periods_project`]) {
					errors[`${element.id}mapValues`] = {};
					errors[`${element.id}mapValues.grant_periods_project`] =
						"Grant Period is required";
				}
				if (!values[`${element.id}mapValues.financial_year`]) {
					errors[`${element.id}mapValues`] = {};
					errors[`${element.id}mapValues.financial_year`] = "Financial Year is required";
				}
			}
		);

		return errors;
	};

	const formAction = props.type;
	return (
		<>
			{loading ? <FullScreenLoader /> : null}
			{updateLoading ? <FullScreenLoader /> : null}
			{props.donors && (
				<DonorYearTagForm
					{...{
						initialValues,
						projectDonors: props.donors,
						TracklineFyId: props.TracklineFyId,
						organizationCountry,
						validate,
						onCancel: props.onCancel,
						onUpdate: onSubmit,
						onCreate: onSubmit,
						formAction,
					}}
				/>
			)}
		</>
	);
}

export default DeliverableTracklineDonorYearTags;
