import { Box, Container, Grid } from "@material-ui/core";
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { sidePanelStyles } from "../../components/Dasboard/styles";
import LeftPanel from "../../components/LeftPanel/LeftPanel";
import Snackbar from "../../components/Snackbar/Snackbar";
import { useNotificationData } from "../../contexts/notificationContext";
import { DonorContainer } from "./donor/container";
import Organization from "./Organization";
import BudgetCategory from "./BudgetMaster";
import SettingsSidebar from "./sidebar";
import ImpactMaster from "./ImpactMaster";
import DeliverableMaster from "./DeliverableMaster";
import { RouteProps } from "react-router";
import { userHasAccess, MODULE_CODES } from "../../utils/access";
import { BUDGET_CATEGORY_ACTIONS } from "../../utils/access/modules/budgetCategory/actions";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../utils/access/modules/deliverableCategory/actions";
import { DELIVERABLE_UNIT_ACTIONS } from "../../utils/access/modules/deliverableUnit/actions";
import { IMPACT_CATEGORY_ACTIONS } from "../../utils/access/modules/impactCategory/actions";
import { IMPACT_UNIT_ACTIONS } from "../../utils/access/modules/impactUnit/actions";
import { ORGANIZATION_ACTIONS } from "../../utils/access/modules/organization/actions";
import { DONOR_ACTIONS } from "../../utils/access/modules/donor/actions";
import { UserRoleContainer } from "./UserRole/container";
import { USER_PERMISSIONS_ACTIONS } from "../../utils/access/modules/userPermissions/actions";
import { AUTH_ACTIONS } from "../../utils/access/modules/auth/actions";
import OrganizationDocumentContainer from "./Organization/Documents";
import IndividualContainer from "./Individual";
import { INDIVIDUAL_ACTIONS } from "../../utils/access/modules/individual/actions";
import GoegraphiesContainer from "./Goegraphies";
import GeoRegionsMasterContainer from "./geoRegions";
import YearTags from "./YearTags";
import { YEARTAG_ACTIONS } from "../../utils/access/modules/yearTag/actions";
import Categories from "./Categories";
import Units from "./Units";
import TallyMapperMasterContainer from "./TallyMapper";

interface IPrivateRouterProps extends RouteProps {
	userAccess?: boolean;
}

function PrivateRoute({
	children,
	userAccess = true,
	...rest
}: IPrivateRouterProps): React.ReactElement | null {
	if (userAccess) {
		return <Route children={children} {...rest} />;
	}
	return null;
}

export default function SettingContainer() {
	const classes = sidePanelStyles();
	const notificationData = useNotificationData();

	const organizationEditAccess = userHasAccess(
		MODULE_CODES.ORGANIZATION,
		ORGANIZATION_ACTIONS.UPDATE_ORGANIZATION
	);

	const deliverableCategoryFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.FIND_DELIVERABLE_CATEGORY
	);

	const createBudgetCategoryAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.CREATE_BUDGET_CATEGORY
	);

	const impactUnitFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_UNIT,
		IMPACT_UNIT_ACTIONS.FIND_IMPACT_UNIT
	);

	const budgetCategoryFindAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.FIND_BUDGET_CATEGORY
	);
	const impactCategoryFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_CATEGORY,
		IMPACT_CATEGORY_ACTIONS.FIND_IMPACT_CATEGORY
	);

	const deliverableUnitFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT
	);
	const deliverableCategoryCreateAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.CREATE_DELIVERABLE_CATEGORY
	);

	const impactUnitCreateAccess = userHasAccess(
		MODULE_CODES.IMPACT_UNIT,
		IMPACT_UNIT_ACTIONS.CREATE_IMPACT_UNIT
	);
	const deliverableUnitCreateAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.CREATE_DELIVERABLE_UNIT
	);

	const impactCategoryCreateAccess = userHasAccess(
		MODULE_CODES.IMPACT_CATEGORY,
		IMPACT_CATEGORY_ACTIONS.CREATE_IMPACT_CATEGORY
	);

	const userRoleFindAccess = userHasAccess(
		MODULE_CODES.USER_PERMISSIONS,
		USER_PERMISSIONS_ACTIONS.FIND_USER_PERMISSIONS
	);

	const userRoleCreateAccess = userHasAccess(
		MODULE_CODES.USER_PERMISSIONS,
		USER_PERMISSIONS_ACTIONS.CREATE_USER_PERMISSIONS
	);

	const individualCreateAccess = userHasAccess(
		MODULE_CODES.INDIVIDUAL,
		INDIVIDUAL_ACTIONS.CREATE_INDIVIDUAL
	);
	const individualFindAccess = userHasAccess(
		MODULE_CODES.INDIVIDUAL,
		INDIVIDUAL_ACTIONS.CREATE_INDIVIDUAL
	);

	const authInviteUser = userHasAccess(MODULE_CODES.AUTH, AUTH_ACTIONS.INVITE_USER);

	const authFindUser = userHasAccess(MODULE_CODES.AUTH, AUTH_ACTIONS.FIND);

	const donorFindAccess = userHasAccess(MODULE_CODES.DONOR, DONOR_ACTIONS.FIND_DONOR);

	const donorCreateAccess = userHasAccess(MODULE_CODES.DONOR, DONOR_ACTIONS.CREATE_DONOR);

	const organizationFindAccess = userHasAccess(
		MODULE_CODES.ORGANIZATION,
		ORGANIZATION_ACTIONS.UPDATE_ORGANIZATION
	);

	const yearTagFindAccess = userHasAccess(MODULE_CODES.YEAR_TAG, YEARTAG_ACTIONS.FIND_YEAR_TAG);

	const getDefaultRoute = () => {
		if (organizationEditAccess) {
			return <Navigate to="organization" />;
		}
		if (organizationFindAccess) {
			return <Navigate to="documents" />;
		}
		if (donorFindAccess || donorCreateAccess) {
			return <Navigate to="donors" />;
		}
		if (budgetCategoryFindAccess || createBudgetCategoryAccess) {
			return <Navigate to="budget" />;
		}
		if (
			impactCategoryFindAccess ||
			impactUnitFindAccess ||
			impactCategoryCreateAccess ||
			impactUnitCreateAccess
		) {
			return <Navigate to="impact" />;
		}
		if (
			deliverableCategoryFindAccess ||
			deliverableUnitFindAccess ||
			deliverableCategoryCreateAccess ||
			deliverableUnitCreateAccess
		) {
			return <Navigate to="deliverable" />;
		}
		if (userRoleFindAccess || userRoleCreateAccess) {
			return <Navigate to="user_roles" />;
		}
		if (individualCreateAccess || individualFindAccess) {
			return <Navigate to="individual" />;
		}
	};

	return (
		<Container
			component={Grid}
			className={classes.root}
			maxWidth={"xl"}
			container
			disableGutters
		>
			<Grid container>
				<Grid item xs={12} md={3}>
					<Box position="sticky" top={0} left={0} style={{ width: "100%" }}>
						<Grid container>
							<Grid item xs={2}>
								<LeftPanel />
							</Grid>
							<Grid item xs={10}>
								<SettingsSidebar />
							</Grid>
						</Grid>
					</Box>
				</Grid>
				<Grid item xs={12} md={9}>
					<Routes>
						<PrivateRoute
							path="donors"
							userAccess={donorFindAccess || donorCreateAccess}
							element={<DonorContainer />}
						/>
						<PrivateRoute
							userAccess={budgetCategoryFindAccess || createBudgetCategoryAccess}
							path="budget"
							element={<BudgetCategory />}
						/>
						<PrivateRoute
							userAccess={impactCategoryFindAccess || deliverableCategoryFindAccess}
							path="categories"
							element={<Categories />}
						/>
						<PrivateRoute userAccess={true} path="units" element={<Units />} />
						<PrivateRoute
							userAccess={
								impactCategoryFindAccess ||
								impactUnitFindAccess ||
								impactCategoryCreateAccess ||
								impactUnitCreateAccess
							}
							path="impact"
							element={<ImpactMaster />}
						/>
						<PrivateRoute
							userAccess={
								deliverableCategoryFindAccess ||
								deliverableUnitFindAccess ||
								deliverableCategoryCreateAccess ||
								deliverableUnitCreateAccess
							}
							path="deliverable"
							element={<DeliverableMaster />}
						/>
						<PrivateRoute
							path="organization"
							userAccess={organizationEditAccess}
							element={<Organization />}
						/>
						<PrivateRoute
							path="documents"
							userAccess={organizationFindAccess}
							element={<OrganizationDocumentContainer />}
						/>
						{/* <Route path="settingsDefault" element={<DefaultSettingsView />} /> */}
						{/* <PrivateRoute path="">
							{organizationEditAccess ? (
								<Navigate to="organization" />
							) : (
								<Navigate to="settingsDefault" />
							)}
						</PrivateRoute> */}
						{/* <Route path="settingsDefault" element={<DefaultSettingsView />} /> */}
						<PrivateRoute path="">{getDefaultRoute()}</PrivateRoute>
						<PrivateRoute
							path="users"
							userAccess={authFindUser || authInviteUser}
							element={<UserRoleContainer />}
						/>
						{/* <PrivateRoute
							userAccess={userRoleFindAccess || userRoleCreateAccess}
							path="user_roles"
							element={<RolesContainer />}
						/> */}
						<PrivateRoute
							userAccess={organizationEditAccess}
							element={<IndividualContainer />}
							path="individual"
						/>
						{/* <PrivateRoute
							userAccess={organizationEditAccess}
							element={<TallyContainer />}
							path="tally"
						/> */}
						<PrivateRoute
							userAccess={organizationEditAccess}
							element={<GoegraphiesContainer />}
							path="goeGraphies"
						/>
						<PrivateRoute
							userAccess={organizationEditAccess}
							element={<TallyMapperMasterContainer />}
							path="tallyMapper"
						/>
						<PrivateRoute
							// userAccess={organizationEditAccess}
							// element={<GeoRegionsContainer />}
							// path="goeRegions"
							userAccess={yearTagFindAccess}
							element={<YearTags />}
							path="yeartags"
						/>
						{/* <PrivateRoute
							userAccess={true} //To be changed
							element={<GeoRegionsMasterContainer />}
							// element={<GeoRegions />}
							path="georegions"
						/> */}
						{/* <PrivateRoute
							userAccess={organizationEditAccess}
							element={<GeoRegionsContainer />}
							path="goeRegions"
						/> */}
						<PrivateRoute
							userAccess={organizationEditAccess}
							element={<GeoRegionsMasterContainer />}
							path="goeRegions"
						/>
					</Routes>
				</Grid>
			</Grid>
			{notificationData!.successNotification && (
				<Snackbar severity="success" msg={notificationData!.successNotification} />
			)}
			{notificationData!.errorNotification && (
				<Snackbar severity="error" msg={notificationData!.errorNotification} />
			)}
		</Container>
	);
}
