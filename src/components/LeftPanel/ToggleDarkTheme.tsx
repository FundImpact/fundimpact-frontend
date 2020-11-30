import React, { ReactText } from "react";
import { MenuItem, Box, CircularProgress, ThemeOptions, Typography, Grid } from "@material-ui/core";
import { Brightness4, Brightness7 } from "@material-ui/icons";
import { useAuth, UserDispatchContext } from "../../contexts/userContext";
import { useMutation, MutationFunctionOptions, FetchResult } from "@apollo/client";
import { UPDATE_USER_DETAILS } from "../../graphql/User/mutation";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { IUserDataContext } from "../../models/userProvider";
import { setUser } from "../../reducers/userReducer";
import { GET_USER_DETAILS } from "../../graphql/User/query";
import { FormattedMessage } from "react-intl";

const updateUserTheme = async ({
	user,
	notificationDispatch,
	updateUser,
	userDispatch,
}: {
	user: IUserDataContext["user"];
	notificationDispatch: React.Dispatch<any>;
	updateUser: (
		options?:
			| MutationFunctionOptions<
					{
						updateUserCustomerInput: IUserDataContext["user"] | undefined;
					},
					{
						id: string | number;
						input: {
							theme: {
								palette: {
									type: "dark" | "light";
								};
							};
						};
					}
			  >
			| undefined
	) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
	userDispatch: React.Dispatch<any> | undefined;
}) => {
	try {
		await updateUser({
			variables: {
				id: user?.id || "",
				input: {
					theme: {
						palette: {
							type: user?.theme?.palette?.type === "dark" ? "light" : "dark",
						},
					},
				},
			},
			update: (store, response) => {
				try {
					if (!response.data) {
						return;
					}
					if (userDispatch) {
						userDispatch(setUser({ user: response.data.updateUserCustomerInput }));
					}
				} catch (err) {
					console.error(err);
				}
			},
			refetchQueries: [{ query: GET_USER_DETAILS }],
		});
		notificationDispatch(
			setSuccessNotification(
				`Switched to ${user?.theme?.palette?.type === "dark" ? "light" : "dark"} theme`
			)
		);
	} catch (err) {
		notificationDispatch(setErrorNotification(err.message));
	}
};

function ToggleDarkTheme() {
	const [updateUser, { loading }] = useMutation<
		{ updateUserCustomerInput: IUserDataContext["user"] },
		{ id: string | number; input: { theme: { palette: { type: "dark" | "light" } } } }
	>(UPDATE_USER_DETAILS);
	const { user } = useAuth();
	const notificationDispatch = useNotificationDispatch();
	const userDispatch = React.useContext(UserDispatchContext);

	return (
		<>
			<MenuItem
				onClick={async () => {
					await updateUserTheme({ notificationDispatch, user, updateUser, userDispatch });
				}}
				data-testid="dark-theme-toggle-button"
			>
				{user?.theme?.palette?.type === "dark" ? (
					<Box display="flex">
						<Brightness7 />
						<Box ml={1}>
							<Typography>
								<FormattedMessage
									id={`lightColor`}
									defaultMessage={`LIGHT`}
									description={`This text will be shown on  toggle theme button for light theme`}
								/>
							</Typography>
						</Box>
					</Box>
				) : (
					<Box display="flex">
						<Brightness4 />
						<Box ml={1}>
							<Typography>
								<FormattedMessage
									id={`darkColor`}
									defaultMessage={`DARK`}
									description={`This text will be shown on  toggle theme button for dark theme`}
								/>
							</Typography>
						</Box>
					</Box>
				)}
			</MenuItem>
			{loading && (
				<Box
					position="fixed"
					left="50%"
					top="50%"
					style={{ transform: "translate(-50%, -50%)" }}
					data-testid="loader"
				>
					<CircularProgress />
				</Box>
			)}
		</>
	);
}

export default ToggleDarkTheme;
