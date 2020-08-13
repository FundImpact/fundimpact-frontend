import Menu, { MenuProps } from "@material-ui/core/Menu";
import { withStyles } from "@material-ui/core/styles";
import React, { ReactNode } from "react";

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
	children,
}: {
	handleClose: () => void;
	id: string;
	anchorEl: any;
	menuList?: { children: ReactNode }[];
	children?: any;
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
					menuList.map((menu: any, index: any) =>
						React.cloneElement(menu.children, {
							...menu.children.props,
							key: index,
						})
					)}
				{children ? children : null}
			</StyledMenu>
		</div>
	);
}
