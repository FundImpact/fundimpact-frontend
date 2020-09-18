import { Box, Typography, IconButton } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { Link } from "react-router-dom";

export function MoreButton({ handleClick, link }: { handleClick?: () => void; link?: string }) {
	return (
		<Box>
			<Typography variant="caption">
				{" "}
				<FormattedMessage
					id="moreHeadingCards"
					defaultMessage="more"
					description="This text will be show on cards for more heading"
				/>
			</Typography>
			{handleClick && (
				<IconButton onClick={() => handleClick()}>
					<ArrowRightAltIcon fontSize="small" />
				</IconButton>
			)}
			{link && (
				<Link to={link}>
					<IconButton>
						<ArrowRightAltIcon fontSize="small" />
					</IconButton>
				</Link>
			)}
		</Box>
	);
}
