import { useMutation } from "@apollo/client";
import React from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import {
	CREATE_IMPACT_LINEITEM_FYDONOR,
	GET_IMPACT_LINEITEM_FYDONOR,
	UPDATE_IMPACT_LINEITEM_FYDONOR,
} from "../../graphql/Impact/trackline";
import { TracklineDonorFormProps } from "../../models/TracklineDonor/tracklineDonor";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import FullScreenLoader from "../commons/GlobalLoader";
import { FORM_ACTIONS } from "../Forms/constant";
import DonorYearTagForm from "../Forms/FYDonorYearTagsForm/FYDonorYearTags";

function getInitialValues(props: TracklineDonorFormProps) {
	if (props.type === FORM_ACTIONS.UPDATE) return { ...props.data };
	let impactFyDonorinitialValuesObj: any = {};
	props.donors?.forEach(
		(elem: {
			id: string;
			name: string;
			donor: { id: string; name: string; country: { id: string; name: string } };
		}) => {
			impactFyDonorinitialValuesObj[`${elem.id}mapValues`] = {
				financial_year:
					props.organizationCountry && props.organizationCountry === elem.donor.country.id
						? props.TracklineFyId
						: "", //
				grant_periods_project: "",
				project_donor: elem.id,
				impact_tracking_lineitem: props.TracklineId,
			};
		}
	);
	return impactFyDonorinitialValuesObj;
}

function ImpactTracklineDonorYearTags(props: TracklineDonorFormProps) {
	const dashboardData = useDashBoardData();
	let organizationCountry = dashboardData?.organization?.country?.id;
	const notificationDispatch = useNotificationDispatch();
	let initialValues: any = getInitialValues({ ...props, organizationCountry });
	const [createImpactLineitemFydonor, { loading }] = useMutation(CREATE_IMPACT_LINEITEM_FYDONOR, {
		onCompleted(data) {
			notificationDispatch(
				setSuccessNotification("Impact Trackline Financial year tags created successfully!")
			);
			props.onCancel();
		},
		onError(data) {
			notificationDispatch(
				setErrorNotification("Impact Trackline Financial year tags creation Failed !")
			);
		},
	});

	const [updateImpactLineitemFydonor, { loading: updateLoading }] = useMutation(
		UPDATE_IMPACT_LINEITEM_FYDONOR,
		{
			onCompleted(data) {
				notificationDispatch(
					setSuccessNotification(
						"Impact Trackline Financial year tags updated successfully!"
					)
				);
				props.onCancel();
			},
			onError(data) {
				console.log("err", data);
				notificationDispatch(
					setErrorNotification("Impact Trackline Financial year tags updation Failed !")
				);
			},
		}
	);

	const onCreate = (value: any) => {
		console.log("formik", value);
		let impactFyDonorFinalvalues = Object.values(value);
		console.log(impactFyDonorFinalvalues);
		for (let i = 0; i < impactFyDonorFinalvalues.length; i++) {
			createImpactLineitemFydonor({
				variables: { input: impactFyDonorFinalvalues[i] },
				refetchQueries: [
					{
						query: GET_IMPACT_LINEITEM_FYDONOR,
						variables: { filter: { impact_tracking_lineitem: props.TracklineId } },
					},
				],
			});
		}
	};
	const onUpdate = (value: any) => {
		let impactFyDonorFinalvalues: any = Object.values(value);
		for (let i = 0; i < impactFyDonorFinalvalues.length; i++) {
			let deliverable_lineitem_fy_id = impactFyDonorFinalvalues[i]?.id;
			delete impactFyDonorFinalvalues[i].id;
			updateImpactLineitemFydonor({
				variables: { id: deliverable_lineitem_fy_id, input: impactFyDonorFinalvalues[i] },
				refetchQueries: [
					{
						query: GET_IMPACT_LINEITEM_FYDONOR,
						variables: { filter: { impact_tracking_lineitem: props.TracklineId } },
					},
				],
			});
		}
	};

	const validate = (values: any) => {
		let errors: Partial<any> = {};
		props.donors?.forEach(
			(elem: {
				id: string;
				name: string;
				donor: { id: string; name: string; country: { id: string; name: string } };
			}) => {
				if (!values[`${elem.id}mapValues.financial_year`]) {
					errors[`${elem.id}mapValues`] = {};
					errors[`${elem.id}mapValues.financial_year`] = "Financial Year is required";
				}
				if (!values[`${elem.id}mapValues.grant_periods_project`]) {
					errors[`${elem.id}mapValues`] = {};
					errors[`${elem.id}mapValues.grant_periods_project`] =
						"Grant Period is required";
				}
			}
		);

		return errors;
	};

	const formAction = props.type;
	return (
		<>
			{props.donors && (
				<DonorYearTagForm
					{...{
						initialValues,
						donors: props.donors,
						TracklineFyId: props.TracklineFyId,
						organizationCountry,
						validate,
						onCancel: props.onCancel,
						onUpdate,
						onCreate,
						formAction,
					}}
				/>
			)}
			{loading ? <FullScreenLoader /> : null}
			{updateLoading ? <FullScreenLoader /> : null}
		</>
	);
}

export default ImpactTracklineDonorYearTags;
