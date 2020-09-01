import { useApolloClient, useMutation } from "@apollo/client";
import React from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { CREATE_GRANT_PERIOD, UPDATE_GRANT_PERIOD } from "../../graphql/grantPeriod/mutation";
import { FETCH_GRANT_PERIODS } from "../../graphql/grantPeriod/query";
import { FORM_ACTIONS } from "../../models/constants";
import { GrantPeriodDialogProps } from "../../models/grantPeriod/grantPeriodDialog";
import { IGrantPeriod } from "../../models/grantPeriod/grantPeriodForm";
import { setSuccessNotification } from "../../reducers/notificationReducer";
import FormDialog from "../FormDialog";
import { GranPeriodForm } from "../Forms/GrantPeriod/GranPeriod";

function GrantPeriodDialog({ open, onClose, action, ...rest }: GrantPeriodDialogProps) {
	const dashboardData = useDashBoardData();
	const apolloClient = useApolloClient();
	const cache = apolloClient.cache;

	const notificationDispatch = useNotificationDispatch();

	const onCancel = () => {
		onClose();
	};

	const onCreatingNewGrantPeriodSuccess = (
		newGrantPeriod: IGrantPeriod,
		action: FORM_ACTIONS
	) => {
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

	const onSubmit = (value: IGrantPeriod) => {
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

	return (
		<div>
			<FormDialog
				open={open}
				loading={loading || updating}
				title={"Grant Period"}
				subtitle={"Grant Period for the project"}
				workspace={dashboardData?.workspace?.name || ""}
				handleClose={onClose}
				project={dashboardData?.project?.name || ""}
			>
				{action === FORM_ACTIONS.CREATE ? (
					<GranPeriodForm
						action={FORM_ACTIONS.CREATE}
						onCancel={onCancel}
						onSubmit={onSubmit}
					/>
				) : (
					<GranPeriodForm
						action={FORM_ACTIONS.UPDATE}
						onCancel={onCancel}
						onSubmit={onSubmit}
						initialValues={defaultValues}
					/>
				)}
			</FormDialog>
		</div>
	);
}

export default GrantPeriodDialog;
