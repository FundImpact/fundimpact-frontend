import React from "react";
import Button from "@material-ui/core/IconButton";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles((theme) => ({
	margin: {
		margin: theme.spacing(1),
	},
	extendedIcon: {
		marginRight: theme.spacing(1),
	},
}));

interface Props {
	onClick?: () => void;
	open: boolean;
	setOpen: any;
}

const ExpandAllRows: React.FC<Props> = ({ onClick, open, setOpen }) => {
	return (
		<Button size="small" href="#text-buttons" color="primary" onClick={() => setOpen(!open)}>
			<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
				{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
			</IconButton>
		</Button>
	);
};

export default ExpandAllRows;
