/**
 * @summary These are the keys that must be used in a module. Keys other than these are
 * considered invalid.
 */

const BudgetModuleKeys = {
	Budget: "BG",
	Budget_Target: "BG_Target",
	Budget_LineItem: "BG_Lineitem",
	Budget_Category: "BG_CAT",
	Budget_Spend: "BG_SP",
};

export const ModulesKeys = { ...BudgetModuleKeys };
