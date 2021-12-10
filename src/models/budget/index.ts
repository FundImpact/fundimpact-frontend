import { FORM_ACTIONS } from "./constants";
import { IBudgetTargetForm, IBudgetTrackingLineitemForm } from "./budgetForm";
import { AttachFile } from "../AttachFile";
import { ApolloQueryResult } from "@apollo/client";
import { IGET_BUDGET_TARGET_PROJECT } from "./query";
import { DIALOG_TYPE } from "../constants";

export interface IBudgetCategory {
	id?: string;
	name: string;
	description?: string;
	code: string;
	is_project: boolean;
	// project_id: {
	// 	id: string;
	// 	name: string;
	// };
	project_id: string;
}

export interface IBudgetTrackingLineitem {
	id?: string;
	amount: number;
	note: string;
	budget_targets_project?: string;
	budget_sub_target?: string;
	annual_year: string;
	reporting_date: string;
	fy_donor?: string;
	fy_org?: string;
	financial_year_org: string;
	financial_year_donor: string;
	grant_periods_project?: string;
	timeperiod_start: string;
	timeperiod_end: string;
	attachments?: AttachFile[];
}

export interface IBudgetTarget {
	name: string;
	description: string;
	total_target_amount: number;
	budget_category_organization: string;
	id?: string;
	donor: string;
}

export type IBudgetTargetProjectProps =
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IBudgetTargetForm;
			dialogType?: DIALOG_TYPE;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.CREATE;
			dialogType?: DIALOG_TYPE;
	  };

export type IBudgetLineitemProps =
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IBudgetTrackingLineitem;
			dialogType?: DIALOG_TYPE;
			refetchOnSuccess:
				| ((
						variables?: Partial<Record<string, any>> | undefined
				  ) => Promise<ApolloQueryResult<any>>)
				| undefined;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.CREATE;
			targetId?: string | number;
			initialValues?: IBudgetTrackingLineitemForm;
			dialogType?: DIALOG_TYPE;
	  };

export type IBudgetCategoryProps =
	| {
			open: boolean;
			handleClose: (res?: any) => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IBudgetCategory;
			getCreatedBudgetCategory?: (budgetCategory: IBudgetCategory) => void;
			dialogType?: DIALOG_TYPE;
	  }
	| {
			open: boolean;
			handleClose: (res?: any) => void;
			formAction: FORM_ACTIONS.CREATE;
			initialValues?: IBudgetCategory;
			getCreatedBudgetCategory?: (budgetCategory: IBudgetCategory) => void;
			dialogType?: DIALOG_TYPE;
	  };
