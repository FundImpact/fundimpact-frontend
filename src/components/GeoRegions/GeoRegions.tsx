import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import {
	GET_ORG_BUDGET_CATEGORY_COUNT,
	GET_ORGANIZATION_BUDGET_CATEGORY,
} from "../../graphql/Budget";
import { IInputField, IGeoregionInputField } from "../../models";
import { IGET_BUDGET_CATEGORY } from "../../models/budget/query";
import { DIALOG_TYPE, FORM_ACTIONS } from "../../models/constants";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { compareObjectKeys, removeEmptyKeys } from "../../utils";
import { CommonFormTitleFormattedMessage } from "../../utils/commonFormattedMessage";
import FormDialog from "../FormDialog";
import CommonForm from "../CommonForm";
import { GeoRegionsFormInputFields } from "./inputFields.json";
import DeleteModal from "../DeleteModal";
import { IGeoRegions, IGeoRegionsProps, IGET_GEO_REGIONS } from "../../models/GeoRegions";
import {
	CREATE_GEOREGIONS,
	DELETE_GEOREGIONS,
	GET_GEOREGIONS_COUNT,
	GET_GEOREGIONS_DATA,
	UPDATE_GEOREGIONS,
} from "../../graphql/GeoRegions/query";
import { GET_COUNTRY_DATA } from "../../graphql/Geographies/GeographyCountry";
import { GET_VILLAGE_DATA } from "../../graphql/Geographies/GeographiesVillage";
import { GET_GRAMPANCHAYAT_DATA } from "../../graphql/Geographies/GeographiesGrampanchayat";
import { GET_BLOCK_DATA } from "../../graphql/Geographies/GeographiesBlock";
import { GET_DISTRICT_DATA } from "../../graphql/Geographies/GeographiesDistrict";
import { GET_STATE_DATA } from "../../graphql/Geographies/GeographyState";
import { GET_PROJECTS } from "../../graphql";
import GeoTabs from "./GeoTabs";

let inputFields: IGeoregionInputField[] = GeoRegionsFormInputFields;
let defaultFormValues: IGeoRegions = {
	name: "",
	description: "",
	project_id: "",
	is_project: "",
	country_id: "",
	state_id: "",
	district_id: "",
	block_id: "",
	gp_id: "",
	village_id: "",
};

const validate = (values: IGeoRegions) => {
	let errors: Partial<IGeoRegions> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	return errors;
};

function GeoRegions({
	open,
	handleClose,
	initialValues: formValues,
	formAction,
	getCreatedGeoRegions,
	dialogType,
}: IGeoRegionsProps) {
	// const [currCountryId, setCurrCountryId] = useState<string>("");
	// const [currStateId, setCurrStateId] = useState<string>("");
	// const [currDistrictId, setCurrDistrictId] = useState<string>("");
	// const [currBlockId, setCurrBlockId] = useState<string>("");
	// const [currGrampanchyatId, setCurrGrampanchayatId] = useState<string>("");
	// const [currVillageId, setCurrVillageId] = useState<string>("");
	const [createNewOrgGeoRegions, { loading: creatingGeoRegions }] = useMutation(
		CREATE_GEOREGIONS
	);
	const [updateGeoRegions, { loading: updatingGeoRegions }] = useMutation(UPDATE_GEOREGIONS);

	const [deleteGeoRegions] = useMutation(DELETE_GEOREGIONS);

	const [getProjects, { data: projectsList }] = useLazyQuery(GET_PROJECTS);

	useEffect(() => {
		getProjects();
	}, []);

	console.log("projectsList", projectsList);

	useEffect(() => {
		if (projectsList) {
			inputFields[3].optionsArray = projectsList.orgProject;
		}
	}, [projectsList]);

	// const [getCountry, countryResponse] = useLazyQuery(GET_COUNTRY_DATA);
	// const [getState, stateResponse] = useLazyQuery(GET_STATE_DATA);
	// const [getDistrict, districtResponse] = useLazyQuery(GET_DISTRICT_DATA);
	// const [getBlock, blockResponse] = useLazyQuery(GET_BLOCK_DATA);
	// const [getGrampanchayat, grampanchayatResponse] = useLazyQuery(GET_GRAMPANCHAYAT_DATA);
	// const [getVillage, villageResponse] = useLazyQuery(GET_VILLAGE_DATA);

	// useEffect(() => {
	// 	getCountry();
	// }, []);

	// useEffect(() => {
	// 	if (currCountryId !== "") getState();
	// }, [currCountryId]);

	// useEffect(() => {
	// 	if (currStateId !== "") getDistrict();
	// }, [currStateId]);

	// useEffect(() => {
	// 	if (currDistrictId !== "") getBlock();
	// }, [currDistrictId]);

	// useEffect(() => {
	// 	if (currDistrictId !== "") getGrampanchayat();
	// }, [currDistrictId]);

	// useEffect(() => {
	// 	if (currBlockId !== "") getVillage();
	// }, [currBlockId]);

	// let dependentApi = {
	// 	country: "call state api url with id",
	// 	state: "call district api url with state id",
	// };

	// inputFields[2].optionsArray = countryResponse?.data?.countries || [];
	// inputFields[3].optionsArray = stateResponse?.data?.states || [];
	// inputFields[4].optionsArray = districtResponse?.data?.districts || [];
	// inputFields[5].optionsArray = blockResponse?.data?.blocks || [];
	// inputFields[6].optionsArray = grampanchayatResponse?.data?.grampanchayats || [];
	// inputFields[7].optionsArray = villageResponse?.data?.villages || [];

	// inputFields[2].getInputValue = (id: any) => {
	// 	console.log("Country ID", id);

	// 	setCurrCountryId(id);
	// };
	// inputFields[3].getInputValue = (id: any) => {
	// 	console.log("state id", id);
	// 	setCurrStateId(id);
	// };
	// inputFields[4].getInputValue = (id: any) => {
	// 	console.log("district Id", id);
	// 	setCurrDistrictId(id);
	// };
	// inputFields[5].getInputValue = (id: any) => {
	// 	console.log("block ID", id);
	// 	setCurrBlockId(id);
	// };
	// inputFields[6].getInputValue = (id: any) => {
	// 	console.log("gramoanchayat ID", id);
	// 	setCurrGrampanchayatId(id);
	// };
	// inputFields[7].getInputValue = (id: any) => {
	// 	console.log("village ID", id);
	// 	setCurrVillageId(id);
	// };

	const notificationDispatch = useNotificationDispatch();

	const dashboardData = useDashBoardData();

	let initialValues = formAction === FORM_ACTIONS.CREATE ? defaultFormValues : formValues;

	const onSubmit = async (valuesSubmitted: IGeoRegions) => {
		let values = removeEmptyKeys<IGeoRegions>({ objectToCheck: valuesSubmitted });
		console.log("geo region Values", values);

		try {
			delete values.is_project;
			await createNewOrgGeoRegions({
				variables: {
					input: { data: values },
				},
				refetchQueries: [
					{
						query: GET_GEOREGIONS_DATA,
					},
					{
						query: GET_GEOREGIONS_COUNT,
					},
				],
				update: async (store, { data: { createOrgGeoRegions } }) => {
					try {
						if (getCreatedGeoRegions) {
							getCreatedGeoRegions(createOrgGeoRegions);
						}

						const count = await store.readQuery<{ orgGeoRegionsCount: number }>({
							query: GET_ORG_BUDGET_CATEGORY_COUNT,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
						});

						store.writeQuery<{ orgGeoRegionsCount: number }>({
							query: GET_ORG_BUDGET_CATEGORY_COUNT,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								orgGeoRegionsCount: (count && count.orgGeoRegionsCount + 1) || 0,
							},
						});

						let limit = 0;
						if (count) {
							limit = count.orgGeoRegionsCount;
						}
						const dataRead = await store.readQuery<IGET_GEO_REGIONS>({
							// const dataRead = await store.readQuery<IGET_BUDGET_CATEGORY>({
							query: GET_ORGANIZATION_BUDGET_CATEGORY,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
						});
						let geoRegions: Partial<IGeoRegions>[] = dataRead?.orgGeoRegions
							? dataRead?.orgGeoRegions
							: [];
						// let geoRegions: Partial<IGeoRegions>[] = dataRead?.orgBudgetCategory
						// 	? dataRead?.orgBudgetCategory
						// 	: [];

						store.writeQuery<IGET_GEO_REGIONS>({
							// store.writeQuery<IGET_BUDGET_CATEGORY>({
							query: GET_ORGANIZATION_BUDGET_CATEGORY,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
							data: {
								orgGeoRegions: [createOrgGeoRegions, ...geoRegions],
							},
						});
					} catch (err) {
						// console.error(err);
					}

					try {
						const data = store.readQuery<IGET_GEO_REGIONS>({
							// const data = store.readQuery<IGET_BUDGET_CATEGORY>({
							query: GET_ORGANIZATION_BUDGET_CATEGORY,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
						});
						let geoRegion: Partial<IGeoRegions>[] = data?.orgGeoRegions
							? // let budgetCategory: Partial<IGeoRegions>[] = data?.orgBudgetCategory
							  data?.orgGeoRegions
							: [];
						store.writeQuery<IGET_GEO_REGIONS>({
							query: GET_ORGANIZATION_BUDGET_CATEGORY,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								orgGeoRegions: [createOrgGeoRegions, ...geoRegion],
							},
						});
					} catch (err) {
						// console.error(err);
					}
				},
			});
			notificationDispatch(setSuccessNotification("Geo Regions Creation Success"));
			handleClose();
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
			handleClose();
		}
	};

	const onUpdate = async (value: IGeoRegions) => {
		try {
			const id = value.id;
			delete value.id;
			delete value.is_project;
			delete value.country_id;
			delete value.state_id;
			delete value.block_id;
			delete value.district_id;
			delete value.gp_id;
			delete value.village_id;
			await updateGeoRegions({
				variables: {
					input: {
						where: {
							id: id,
							// id: id?.toString(),
						},
						data: value,
					},
				},
				refetchQueries: [
					{
						query: GET_GEOREGIONS_DATA,
					},
					{
						query: GET_GEOREGIONS_COUNT,
					},
				],
			});
			notificationDispatch(setSuccessNotification("Geo Regions Updation Success"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
		} finally {
			handleClose();
		}
	};

	inputFields[2].getInputValue = (value: boolean) => {
		value ? (inputFields[3].hidden = false) : (inputFields[3].hidden = true);
	};

	const onDelete = async () => {
		try {
			deleteGeoRegions({
				variables: {
					input: {
						where: {
							id: initialValues?.id,
						},
					},
				},
				refetchQueries: [
					{
						query: GET_GEOREGIONS_DATA,
					},
					{
						query: GET_GEOREGIONS_COUNT,
					},
				],
			});
			notificationDispatch(setSuccessNotification("Geo Regions Delete Success"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			handleClose();
		}
	};

	const intl = useIntl();
	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);

	const updateGeoRegionSubtitle = intl.formatMessage({
		id: "GeoRegionsUpdateFormSubtitle",
		defaultMessage: "Update Geo Regions Of Organization",
		description: `This text will be show on update geo regions form`,
	});

	const createGeoRegionSubtitle = intl.formatMessage({
		id: "GeoRegionsCreateCreateFormSubtitle",
		defaultMessage: "Create New Geo Regions For Organization",
		description: `This text will be show on create geo regions form`,
	});

	if (dialogType === DIALOG_TYPE.DELETE) {
		return (
			<DeleteModal
				open={open}
				handleClose={handleClose}
				title="Geo Regions"
				onDeleteConformation={onDelete}
			/>
		);
	}

	if (!formValues?.project_id && formAction === "UPDATE") {
		inputFields[2].hidden = true;
		inputFields[3].hidden = true;
	}

	if (formValues?.project_id && formAction === "UPDATE") {
		inputFields[3].disabled = true;
		inputFields[2].hidden = false;
	}
	if (formAction === "CREATE") {
		inputFields[2].hidden = false;
		inputFields[3].disabled = false;
	}

	return (
		<>
			<FormDialog
				handleClose={handleClose}
				open={open}
				loading={updatingGeoRegions || creatingGeoRegions}
				title={
					newOrEdit +
					" " +
					intl.formatMessage({
						id: "geoRegionsFormTitle",
						defaultMessage: "Geo Regions",
						description: `This text will be show on Geo Regions form for title`,
					})
				}
				subtitle={
					formAction === FORM_ACTIONS.CREATE
						? createGeoRegionSubtitle
						: updateGeoRegionSubtitle
				}
				workspace={""}
				project={""}
			>
				<CommonForm
					initialValues={initialValues}
					validate={validate}
					onCreate={onSubmit}
					onCancel={handleClose}
					inputFields={inputFields}
					formAction={formAction}
					onUpdate={onUpdate}
				/>
				{/* <GeoTabs /> */}
			</FormDialog>
		</>
	);
}

export default GeoRegions;
