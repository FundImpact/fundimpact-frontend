import { GrantPeriodFormProps } from "./grantPeriodForm";

export type GrantPeriodDialogProps = {
	open: boolean;
	onClose: () => void;
} & Pick<GrantPeriodFormProps, "action">;
