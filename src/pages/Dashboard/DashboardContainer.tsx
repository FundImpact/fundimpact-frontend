import React from "react";
import { Box, Container, Grid, Typography } from "@material-ui/core";
import { useStyles } from "../../components/Dasboard/styles";
import SideBar from "../../components/Dasboard/SideBar";
import LeftPanel from "../../components/Dasboard/LeftPanel";
import { useQuery } from "@apollo/client";
import { GET_ORGANISATIONS } from "../../graphql/queries";
import { Skeleton } from "@material-ui/lab";
import { useAuth } from "../../contexts/userContext";

interface IDashboardContainer {
	left: React.ReactNode;
	main: React.ReactNode;
	top?: React.ReactNode;
}

export default function DashboardContainer({ left, main, top }: IDashboardContainer) {
	const classes = useStyles();
	const [showSideBar, setShowSideBar] = React.useState(false);
	const { user } = useAuth();
	const { loading, error, data } = useQuery(GET_ORGANISATIONS, {
		variables: {
			id: user?.id,
		},
	});
	React.useEffect(() => {
		setTimeout(() => setShowSideBar(true), 1000);
	});

	return (
		<Container
			component={Grid}
			disableGutters
			container
			className={classes.root}
			maxWidth={"xl"}
		>
			<Grid item xs={12} md={3} container>
				<Grid item xs={2}>
					<LeftPanel />
				</Grid>
				<Grid item xs={10}>
					<SideBar>
						<Grid item>
							<Typography variant="h4" gutterBottom noWrap={true}>
								{loading ? (
									<Skeleton variant="text" />
								) : (
									<Box color="primary.main"> {""}</Box>
								)}
							</Typography>
						</Grid>
					</SideBar>
				</Grid>
			</Grid>

			<Grid item xs md={9} container>
				<Grid item xs={12}>
					Top Content
				</Grid>
				<Grid item xs={12}>
					<Box ml={1}>{main}</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
