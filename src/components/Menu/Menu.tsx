import React, { ReactNode } from "react";
import { withStyles } from "@material-ui/core/styles";
import Menu, { MenuProps } from "@material-ui/core/Menu";

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

export default function SimpleMenu({
	handleClose,
	id,
	anchorEl,
	menuList,
}: {
	handleClose: () => void;
	id: string;
	anchorEl: any;
	menuList?: { children: ReactNode }[];
}) {
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
					menuList.map((menu, index: number) => {
						return (
							<div onClick={handleClose} key={index}>
								{menu.children}
							</div>
						);
					})}
			</StyledMenu>
		</div>
	);
}
