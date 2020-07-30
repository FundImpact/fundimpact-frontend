import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import FIModal from "../Modal/Modal";
import CreateProject from "../Forms/CreateProject/createProject";

const StyledMenu = withStyles({
	paper: {
		border: "1px solid #d3d4d5",
	},
})((props: MenuProps) => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
			vertical: "bottom",
			horizontal: "center",
		}}
		transformOrigin={{
			vertical: "top",
			horizontal: "center",
		}}
		{...props}
	/>
));

const StyledMenuItem = withStyles((theme) => ({
	root: {
		"&:focus": {
			backgroundColor: theme.palette.primary.main,
			"& .MuiListItemIcon-root, & .MuiListItemText-primary": {
				color: theme.palette.common.white,
			},
		},
	},
}))(MenuItem);

export default function SimpleMenu({
	handleClose,
	id,
	anchorEl,
	menuList,
}: {
	handleClose: () => void;
	id: string;
	anchorEl: any;
	menuList?: object[];
}) {
	const [open, setOpen] = React.useState<any>([]);
	const handleModalOpen = (index: any) => {
		let array = [...open];
		array[index] = true;
		setOpen(array);
		handleClose();
	};
	const handleModalClose = (index: number) => {
		let array = [...open];
		array[index] = false;
		setOpen(array);
	};
	return (
		<div>
			<StyledMenu
				id={id}
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				{menuList &&
					menuList.map((menu: any, index: any) => {
						return (
							<div>
								<MenuItem onClick={() => handleModalOpen(index)}>
									{menu.listName}
								</MenuItem>
								{open[index] && (
									<FIModal
										open={open[index]}
										handleClose={() => handleModalClose(index)}
										children={menu.children}
									/>
								)}
							</div>
						);
					})}
			</StyledMenu>
		</div>
	);
}
