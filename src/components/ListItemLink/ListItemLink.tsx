import { ListItem, ListItemText } from "@material-ui/core";
import React from "react";
import { NavLink } from "react-router-dom";
import { sidePanelStyles } from "../../components/Dasboard/styles";

function ListItemLink(props: { primary: string; to: string }) {
	const { primary, to } = props;
	const { sidePanelActiveLink } = sidePanelStyles();

	const CustomLink = React.useMemo(
		() =>
			React.forwardRef((linkProps, ref) => (
				<NavLink activeClassName={sidePanelActiveLink} to={to} {...linkProps} />
			)),
		[to]
	);

	return (
		<ListItem button component={CustomLink}>
			<ListItemText primary={primary} />
		</ListItem>
	);
}

export default ListItemLink;
