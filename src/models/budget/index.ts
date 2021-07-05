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
}

export interface IBudgetTrackingLineitem {
	id?: string;
	amount: number;
	note: string;
	budget_targets_project: string;
	annual_year: string;
	reporting_date: string;
	fy_donor: string;
	fy_org: string;
	grant_periods_project: string;
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
			renderTotalAgain?: () => void;
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
			renderTotalAgain?: () => void;
			initialValues?: IBudgetTrackingLineitemForm;
			dialogType?: DIALOG_TYPE;
	  };

export type IBudgetCategoryProps =
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IBudgetCategory;
			getCreatedBudgetCategory?: (budgetCategory: IBudgetCategory) => void;
			dialogType?: DIALOG_TYPE;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.CREATE;
			initialValues?: IBudgetCategory;
			getCreatedBudgetCategory?: (budgetCategory: IBudgetCategory) => void;
			dialogType?: DIALOG_TYPE;
	  };
