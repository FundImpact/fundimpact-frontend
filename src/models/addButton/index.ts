export interface CreateButton {
	text: string;
	dialog?: ({
		open,
		handleClose,
	}: {
		open: boolean;
		handleClose: () => void;
	}) => React.ReactNode | void;
}
