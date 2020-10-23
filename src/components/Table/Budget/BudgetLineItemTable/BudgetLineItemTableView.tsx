import React, { useEffect, useMemo } from "react";
import CommonTable from "../../CommonTable";
import BudgetLineitem from "../../../Budget/BudgetLineitem";
import { FORM_ACTIONS } from "../../../Forms/constant";
import { IBUDGET_LINE_ITEM_RESPONSE } from "../../../../models/budget/query";
import { IBudgetTrackingLineitem } from "../../../../models/budget";
import { budgetLineItemTableHeading as tableHeadings } from "../../constants";
import { getTodaysDate, uploadPercentageCalculator } from "../../../../utils";
import { Box, Chip, Avatar, Grid } from "@material-ui/core";
import FilterList from "../../../FilterList";
import { getValueFromObject } from "../../../../utils";
import { userHasAccess, MODULE_CODES } from "../../../../utils/access";
import { BUDGET_TARGET_LINE_ITEM_ACTIONS } from "../../../../utils/access/modules/budgetTargetLineItem/actions";
import { removeArrayElementsAtVariousIndex as filterTableHeadingsAndRows } from "../../../../utils";
import { ANNUAL_YEAR_ACTIONS } from "../../../../utils/access/modules/annualYear/actions";
import { FINANCIAL_YEAR_ORG_ACTIONS } from "../../../../utils/access/modules/financialYearOrg/actions";
import { FINANCIAL_YEAR_DONOR_ACTIONS } from "../../../../utils/access/modules/financialYearDonor/actions";
import { CURRENCY_ACTION } from "../../../../utils/access/modules/currency/actions";
import { AttachFile } from "../../../../models/AttachFile";
import AttachFileForm from "../../../Forms/AttachFiles";
import useMultipleFileUpload from "../../../../hooks/multipleFileUpload";
import { useDashBoardData } from "../../../../contexts/dashboardContext";
import { CommonUploadingFilesMessage } from "../../../../utils/commonFormattedMessage";
import { CircularPercentage } from "../../../commons";
import { ApolloQueryResult } from "@apollo/client";
import { useNotificationDispatch } from "../../../../contexts/notificationContext";
import { setSuccessNotification } from "../../../../reducers/notificationReducer";

//The value of the year tags is the way to retrieve value from budgetLineItem and keyName is the name
//that we want to display in the chip
const yearTags = {
	FYO: "fy_org,name",
	FYD: "fy_donor,name",
	AY: "annual_year,name",
};

const filterYearTagsAccordingToUserAccess = () => {
	const tags: { [key: string]: string } = { ...yearTags };
	const annualYearFindAccess = userHasAccess(
		MODULE_CODES.ANNUAL_YEAR,
		ANNUAL_YEAR_ACTIONS.FIND_ANNUAL_YEAR
	);

	const financialYearOrgFindAccess = userHasAccess(
		MODULE_CODES.FINANCIAL_YEAR_ORG,
		FINANCIAL_YEAR_ORG_ACTIONS.FIND_FINANCIAL_YEAR_ORG
	);

	const financialYearDonorFindAccess = userHasAccess(
		MODULE_CODES.FINANCIAL_YEAR_DONOR,
		FINANCIAL_YEAR_DONOR_ACTIONS.FIND_FINANCIAL_YEAR_DONOR
	);
	if (!annualYearFindAccess) {
		delete tags.AY;
	}
	if (!financialYearOrgFindAccess) {
		delete tags.FYO;
	}
	if (!financialYearDonorFindAccess) {
		delete tags.FYD;
	}
	return tags;
};

const BudgetLineitemYearTags: React.SFC<{ budgetLineItem: IBUDGET_LINE_ITEM_RESPONSE }> = ({
	budgetLineItem,
}) => {
	const tags = filterYearTagsAccordingToUserAccess();
	return (
		<Box display="flex">
			{Object.entries(tags).map(([yearTag, yearTagValue], arrIndex) => {
				return (
					getValueFromObject(budgetLineItem, yearTagValue.split(",")) && (
						<Box mr={1} key={arrIndex}>
							<Chip
								avatar={
									<Avatar>
										<span>{yearTag}</span>
									</Avatar>
								}
								label={getValueFromObject(budgetLineItem, yearTagValue.split(","))}
								size="small"
							/>
						</Box>
					)
				);
			})}
		</Box>
	);
};

const rows = [
	{
		valueAccessKey: "",
		renderComponent: (budgetLineItem: IBUDGET_LINE_ITEM_RESPONSE) => (
			<span>{getTodaysDate(budgetLineItem.reporting_date, true)}</span>
		),
	},
	{ valueAccessKey: "note" },
	{ valueAccessKey: "amount" },
	{ valueAccessKey: "grant_periods_project,name" },
	{
		valueAccessKey: "",
		renderComponent: (budgetLineItem: IBUDGET_LINE_ITEM_RESPONSE) => {
			return <BudgetLineitemYearTags budgetLineItem={budgetLineItem} />;
		},
	},
];

enum tableHeader {
	date = 1,
	note = 2,
	amount = 3,
	grantPeriod = 4,
	year = 5,
}

enum tableRow {
	date = 0,
	note = 1,
	amount = 2,
	grantPeriod = 3,
	year = 4,
}

const chipArray = ({
	arr,
	name,
	removeChip,
}: {
	arr: string[];
	removeChip: (index: number) => void;
	name: string;
}) => {
	return arr.map((element, index) => (
		<Box key={index} m={1}>
			<Chip
				label={element}
				avatar={
					<Avatar
						style={{
							width: "30px",
							height: "30px",
						}}
					>
						<span>{name}</span>
					</Avatar>
				}
				onDelete={() => removeChip(index)}
			/>
		</Box>
	));
};

const getNewAmountHeaderOfTable = (currency: string) => `Amount (${currency})`;

const createChipArray = ({
	filterListObjectKeyValuePair,
	removeFilterListElements,
	grantPeriodHash,
	annualYearHash,
	financialYearDonorHash,
	financialYearOrgHash,
}: {
	filterListObjectKeyValuePair: any[];
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	grantPeriodHash: { [key: string]: string };
	annualYearHash: { [key: string]: string };
	financialYearDonorHash: { [key: string]: string };
	financialYearOrgHash: { [key: string]: string };
}) => {
	if (filterListObjectKeyValuePair[1] && Array.isArray(filterListObjectKeyValuePair[1])) {
		if (filterListObjectKeyValuePair[0] === "grant_periods_project") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map((element) => grantPeriodHash[element]),
				name: "gp",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
		if (filterListObjectKeyValuePair[0] === "annual_year") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map((element) => annualYearHash[element]),
				name: "ay",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
		if (filterListObjectKeyValuePair[0] === "fy_org") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map(
					(element) => financialYearOrgHash[element]
				),
				name: "fyo",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
		if (filterListObjectKeyValuePair[0] === "fy_donor") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map(
					(element) => financialYearDonorHash[element]
				),
				name: "fyd",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
	}
	if (filterListObjectKeyValuePair[1] && typeof filterListObjectKeyValuePair[1] === "string") {
		return chipArray({
			arr: [filterListObjectKeyValuePair[1]],
			name: filterListObjectKeyValuePair[0].slice(0, 4),
			removeChip: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
		});
	}
	return null;
};

let budgetLineItemTableEditMenu: string[] = [];

function BudgetLineItemTableView({
	toggleDialogs,
	openDialogs,
	selectedBudgetLineItem,
	initialValues,
	budgetLineitemList,
	changePage,
	loading,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	removeFilterListElements,
	filterList,
	setFilterList,
	inputFields,
	grantPeriodHash,
	annualYearHash,
	financialYearDonorHash,
	financialYearOrgHash,
	currency,
	refetchOnSuccess,
}: {
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	selectedBudgetLineItem: React.MutableRefObject<IBUDGET_LINE_ITEM_RESPONSE | null>;
	initialValues: IBudgetTrackingLineitem;
	budgetLineitemList: IBUDGET_LINE_ITEM_RESPONSE[];
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	filterList: {
		[key: string]: string | string[];
	};
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string | string[];
		}>
	>;
	inputFields: any[];
	grantPeriodHash: { [key: string]: string };
	annualYearHash: { [key: string]: string };
	financialYearDonorHash: { [key: string]: string };
	financialYearOrgHash: { [key: string]: string };
	currency: string;
	refetchOnSuccess:
		| ((
				variables?: Partial<Record<string, any>> | undefined
		  ) => Promise<ApolloQueryResult<any>>)
		| undefined;
}) {
	const currencyFindAccess = userHasAccess(MODULE_CODES.CURRENCY, CURRENCY_ACTION.FIND_CURRENCY);
	currencyFindAccess && (tableHeadings[3].label = getNewAmountHeaderOfTable(currency));

	const budgetLineItemEditAccess = userHasAccess(
		MODULE_CODES.BUDGET_TARGET_LINE_ITEM,
		BUDGET_TARGET_LINE_ITEM_ACTIONS.UPDATE_BUDGET_TARGET_LINE_ITEM
	);

	useEffect(() => {
		if (budgetLineItemEditAccess) {
			budgetLineItemTableEditMenu = ["Edit Budget Line Item", "View Documents"];
		}
	}, [budgetLineItemEditAccess]);

	const annualYearFindAccess = userHasAccess(
		MODULE_CODES.ANNUAL_YEAR,
		ANNUAL_YEAR_ACTIONS.FIND_ANNUAL_YEAR
	);

	const financialYearOrgFindAccess = userHasAccess(
		MODULE_CODES.FINANCIAL_YEAR_ORG,
		FINANCIAL_YEAR_ORG_ACTIONS.FIND_FINANCIAL_YEAR_ORG
	);

	const financialYearDonorFindAccess = userHasAccess(
		MODULE_CODES.FINANCIAL_YEAR_DONOR,
		FINANCIAL_YEAR_DONOR_ACTIONS.FIND_FINANCIAL_YEAR_DONOR
	);

	const filteredTableHeadings = useMemo(
		() =>
			filterTableHeadingsAndRows(tableHeadings, {
				[tableHeader.year]:
					!annualYearFindAccess &&
					!financialYearOrgFindAccess &&
					!financialYearDonorFindAccess,
			}),
		[annualYearFindAccess, financialYearOrgFindAccess, financialYearDonorFindAccess]
	);

	const filteredTableRows = useMemo(
		() =>
			filterTableHeadingsAndRows(rows, {
				[tableRow.year]:
					!annualYearFindAccess &&
					!financialYearOrgFindAccess &&
					!financialYearDonorFindAccess,
			}),
		[annualYearFindAccess, financialYearOrgFindAccess, financialYearDonorFindAccess]
	);

	filteredTableHeadings[filteredTableHeadings.length - 1].renderComponent = () => (
		<FilterList
			initialValues={{
				note: "",
				amount: "",
				grant_periods_project: [],
				annual_year: [],
				fy_org: [],
				fy_donor: [],
				reporting_date: "",
			}}
			setFilterList={setFilterList}
			inputFields={inputFields}
		/>
	);

	const [budgetTracklineFileArray, setBudgetTracklineFileArray] = React.useState<AttachFile[]>(
		[]
	);

	useEffect(() => {
		setBudgetTracklineFileArray(initialValues.attachments || []);
	}, [initialValues.attachments]);

	const dashBoardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();
	let { multiplefileUpload } = useMultipleFileUpload();
	let uploadingFileMessage = CommonUploadingFilesMessage();
	const [budgetUploadLoading, setbudgetUploadLoading] = React.useState(0);
	const [totalFilesToUpload, setTotalFilesToUpload] = React.useState(0);

	const [uploadSuccess, setUploadSuccess] = React.useState<boolean>(false);
	const successMessage = () => {
		if (totalFilesToUpload) notificationDispatch(setSuccessNotification("Files Uploaded !"));
		if (refetchOnSuccess) refetchOnSuccess();
		setUploadSuccess(false);
	};
	if (uploadSuccess) successMessage();

	const attachFileOnSave = (
		initialValues: IBudgetTrackingLineitem,
		budgetTracklineFileArray: AttachFile[],
		setBudgetTracklineFileArray: React.Dispatch<React.SetStateAction<AttachFile[]>>
	) => {
		setTotalFilesToUpload(budgetTracklineFileArray.filter((elem) => !elem.id).length);
		multiplefileUpload({
			ref: "budget-tracking-lineitem",
			refId: initialValues?.id || "",
			field: "attachments",
			path: `org-${dashBoardData?.organization?.id}/budget-tracking-lineitem`,
			filesArray: budgetTracklineFileArray,
			setFilesArray: setBudgetTracklineFileArray,
			setUploadSuccess: setUploadSuccess,
		});
	};

	React.useEffect(() => {
		let remainFilestoUpload = budgetTracklineFileArray.filter((elem) => !elem.id).length;
		let percentage = uploadPercentageCalculator(remainFilestoUpload, totalFilesToUpload);
		setbudgetUploadLoading(percentage);
	}, [budgetTracklineFileArray, totalFilesToUpload, setbudgetUploadLoading]);

	const [openAttachFiles, setOpenAttachFiles] = React.useState(false);
	return (
		<>
			<Grid container>
				<Grid item xs={12}>
					<Box display="flex" flexWrap="wrap">
						{Object.entries(filterList).map((filterListObjectKeyValuePair) =>
							createChipArray({
								filterListObjectKeyValuePair,
								removeFilterListElements,
								grantPeriodHash,
								annualYearHash,
								financialYearDonorHash,
								financialYearOrgHash,
							})
						)}
					</Box>
				</Grid>
			</Grid>
			<CommonTable
				tableHeadings={filteredTableHeadings}
				valuesList={budgetLineitemList}
				rows={filteredTableRows}
				selectedRow={selectedBudgetLineItem}
				toggleDialogs={toggleDialogs}
				editMenuName={budgetLineItemTableEditMenu}
				collapsableTable={false}
				changePage={changePage}
				loading={loading}
				count={count}
				order={order}
				setOrder={setOrder}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
				setOpenAttachFiles={setOpenAttachFiles}
			>
				<>
					<BudgetLineitem
						open={openDialogs[0]}
						handleClose={() => toggleDialogs(0, false)}
						formAction={FORM_ACTIONS.UPDATE}
						initialValues={initialValues}
						refetchOnSuccess={refetchOnSuccess}
					/>
					<AttachFileForm
						{...{
							open: openAttachFiles,
							handleClose: () => setOpenAttachFiles(false),
							filesArray: budgetTracklineFileArray,
							setFilesArray: setBudgetTracklineFileArray,
							parentOnSave: () =>
								attachFileOnSave(
									initialValues,
									budgetTracklineFileArray,
									setBudgetTracklineFileArray
								),
						}}
					/>
					{budgetUploadLoading > 0 ? (
						<CircularPercentage
							progress={budgetUploadLoading}
							message={uploadingFileMessage}
						/>
					) : null}
				</>
			</CommonTable>
		</>
	);
}

export default BudgetLineItemTableView;
