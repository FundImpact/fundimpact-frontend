import React, { useEffect, useState, useMemo } from "react";
import { FORM_ACTIONS } from "../constant";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import CommonForm from "../../CommonForm/commonForm";
// import { AttachFileForm } from "./inputField.json";
import { useIntl } from "react-intl";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import FullScreenLoader from "../../commons/GlobalLoader";
import FormDialog from "../../FormDialog";
import {
	Box,
	Button,
	Dialog,
	DialogTitle,
	FormControl,
	Grid,
	GridList,
	GridListTile,
	Input,
	InputLabel,
	makeStyles,
	TextField,
	Typography,
} from "@material-ui/core";
function getInitialValues(props: any) {
	if (props.type === FORM_ACTIONS.UPDATE) {
		return { ...props.data };
	}
	return {
		files: [],
	};
}

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "space-around",
		overflow: "hidden",
		backgroundColor: theme.palette.background.paper,
	},
	gridList: {
		width: 350,
		height: 350,
	},
	buttonAddFiles: {
		marginLeft: theme.spacing(1),
	},
}));

function AttachFileForm(props: any) {
	const notificationDispatch = useNotificationDispatch();
	let initialValues: any = getInitialValues(props);
	const dashboardData = useDashBoardData();
	const [formValues, setFormValues] = useState<{ email: string; role: string } | null>();
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;
	const [filesArray, setFilesArray] = React.useState<any>([]);
	const intl = useIntl();
	let title = intl.formatMessage({
		id: "addAttachFileFormTitle",
		defaultMessage: "Add Role to a User",
		description: "This text will be show on user update form for title",
	});
	let subtitle = intl.formatMessage({
		id: "addAttachFileFormTitle",
		defaultMessage: "give user a role",
		description: "This text will be show on user update form for subtitle",
	});

	const onCreate = (value: any) => {};

	const onUpdate = async (value: any) => {};

	const validate = (values: any) => {
		let errors: Partial<any> = {};
		if (!values.files) {
			errors.role = "Role is required";
		}
		return errors;
	};

	React.useEffect(() => {
		console.log("filesArray", filesArray);
	}, [filesArray]);
	const classes = useStyles();
	return (
		<React.Fragment>
			<Dialog
				onClose={props.onClose}
				aria-labelledby="simple-dialog-title"
				open={formIsOpen}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle id="simple-dialog-title">Upload</DialogTitle>
				<Grid container>
					<Grid item xs={12}>
						<FormControl fullWidth>
							<InputLabel
								shrink={false}
								htmlFor={"id"}
								style={{ width: "100%", position: "static" }}
							>
								<Button component="span" className={classes.buttonAddFiles}>
									{filesArray?.length > 0 ? "Add more files" : "Add files"}
								</Button>
							</InputLabel>

							<Input
								onChange={(e: any): void => {
									e.persist();
									e.preventDefault();

									setFilesArray([
										...filesArray,
										{
											file: e.target.files[0],
											preview: URL.createObjectURL(e.target.files[0]),
										},
									]);
								}}
								id={"id"}
								// onBlur={formik.handleBlur}
								// required={required}
								// name={name}
								data-testid={"dataTestId"}
								inputProps={{
									"data-testid": "testId",
								}}
								type={"file"}
								style={{
									visibility: "hidden",
								}}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={12} style={{ minHeight: "600px", overflow: "scroll" }}>
						<div className={classes.root}>
							<GridList cellHeight={150} className={classes.gridList}>
								{filesArray.map((file: any) => (
									<GridListTile key={file?.preview} cols={1}>
										<img src={file?.preview} alt={file?.file?.name} />
									</GridListTile>
								))}
							</GridList>
						</div>
					</Grid>
				</Grid>
			</Dialog>
			{/* <FormDialog title={title} subtitle={subtitle} open={formIsOpen} handleClose={onCancel}>
				<CommonForm
					{...{
						initialValues,
						validate,
						onCreate,
						cancelButtonName: "Reset",
						createButtonName: "Add",
						formAction,
						onUpdate,
						inputFields: [],
					}}
				/>
			</FormDialog> */}
			{/* {sendInvitationToUserLoading ? <FullScreenLoader /> : null} */}
		</React.Fragment>
	);
}

const AttachedFileList = (props: any) => {
	const [openAddRemark, setOpenAddRemark] = React.useState(false);
	const { file } = props;
	const [text, setText] = React.useState<any>();
	const handleTextField = (event: any) => {
		setText(event.target.value);
	};
	return (
		<GridListTile key={file?.preview} cols={1}>
			<Grid container>
				<Grid item xs={12}>
					<img src={file?.preview} alt={file?.file?.name} />
				</Grid>
				<Grid item xs={12} container>
					{openAddRemark ? (
						<>
							<Grid item xs={8}>
								<TextField
									id="outlined-basic"
									label="Enter Name"
									value={text}
									onChange={handleTextField}
									inputProps={{
										"data-testid": "editable-input",
									}}
								/>
							</Grid>
							<Grid item xs={4}>
								<Button onClick={() => setOpenAddRemark(true)}>Save</Button>
							</Grid>
						</>
					) : (
						<Button onClick={() => setOpenAddRemark(true)}>Add remark</Button>
					)}
					<img src={file?.preview} alt={file?.file?.name} />
				</Grid>
			</Grid>
		</GridListTile>
	);
};
export default AttachFileForm;
