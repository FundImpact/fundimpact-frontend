import { IBudget } from "./budget";

export interface IBudgetFormProps {
	initialValues: IBudget;
	onSubmit: (values: IBudget) => void;
	validate: any;
}
