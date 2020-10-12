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
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";

import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	Grid,
	GridList,
	GridListTile,
	IconButton,
	Input,
	InputLabel,
	makeStyles,
	Switch,
	TextField,
	Typography,
	useTheme,
} from "@material-ui/core";
import { readableBytes } from "../../../utils";
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
		maxWidth: 345,
	},
	gridList: {
		width: 350,
		height: 350,
	},
	buttonAddFiles: {
		marginLeft: theme.spacing(1),
	},
	media: {
		height: 160,
	},
	mediaListBox: {
		maxHeight: "400px",
		minHeight: "400px",
		overflow: "scroll",
		border: `3px solid ${theme.palette.text.primary}`,
		margin: theme.spacing(2),
		width: "100%",
		backgroundColor: theme.palette.action.selected,
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
	const { filesArray, setFilesArray } = props;
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

	React.useEffect(() => {
		console.log("filesArrays", filesArray);
	}, [filesArray]);
	const [multiple, setMultiple] = useState(false);
	const classes = useStyles();

	return (
		<React.Fragment>
			<Dialog
				onClose={props.onClose}
				aria-labelledby="simple-dialog-title"
				open={formIsOpen}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle id="simple-dialog-title">Upload assets</DialogTitle>
				<DialogContent dividers>
					<Grid container>
						<Grid item xs={12} container justify="space-between">
							<FormControl>
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

										let fileArr: any = [];
										Array.from(e.target?.files).map((file: any) => {
											fileArr.push({
												file: file,
												preview: URL.createObjectURL(file),
											});
										});

										setFilesArray([...filesArray, ...fileArr]);
									}}
									id={"id"}
									// onBlur={formik.handleBlur}
									// required={required}
									// name={name}
									data-testid={"dataTestId"}
									inputProps={{
										"data-testid": "testId",
										multiple: multiple,
									}}
									type={"file"}
									style={{
										visibility: "hidden",
									}}
								/>
							</FormControl>
							<FormControlLabel
								control={
									<Switch
										checked={multiple}
										onChange={() => setMultiple(!multiple)}
										name="multiple"
										color="primary"
									/>
								}
								label="Select multiple files"
							/>
						</Grid>
						<Grid item xs={12} className={classes.mediaListBox} container spacing={1}>
							{filesArray?.length === 0 && (
								<Grid item xs={12} container justify="center" alignItems="center">
									<Typography gutterBottom variant="h6" noWrap>
										No files selected
									</Typography>
								</Grid>
							)}
							{filesArray.map((file: any, index: number) => (
								<AttachedFileList
									{...{
										file,
										addRemark: (remark: string) => {
											let fileArr = [...filesArray];
											fileArr[index].remark = remark;
											setFilesArray(fileArr);
										},
									}}
								/>
							))}
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button autoFocus color="primary" onClick={onCancel}>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}

const AttachedFileList = (props: { file: any; addRemark: (text: string) => void }) => {
	const [openAddRemark, setOpenAddRemark] = React.useState(false);
	const { file, addRemark } = props;
	const [text, setText] = React.useState<string>("");
	const handleTextField = (event: any) => {
		setText(event.target.value);
	};
	const classes = useStyles();

	React.useEffect(() => {
		setText(file.remark);
	}, []);

	return (
		<Grid item key={file?.preview} xs={3}>
			<Card className={classes.root}>
				<CardMedia
					className={classes.media}
					image={file?.preview}
					title={file?.file?.name}
				/>
				<CardContent>
					<Box ml={1}>
						<Typography gutterBottom variant="subtitle2" noWrap>
							{file?.file?.name}
						</Typography>
						<Typography gutterBottom variant="caption" noWrap>
							{readableBytes(file?.file?.size)}
						</Typography>
					</Box>

					{openAddRemark ? (
						<Box display="flex">
							<TextField
								id="outlined-basic"
								label="Remark"
								value={text}
								onChange={handleTextField}
								inputProps={{
									"data-testid": "editable-input",
								}}
							/>
							<Box display="flex">
								<IconButton
									onClick={() => {
										addRemark(text);
										setOpenAddRemark(false);
									}}
									style={{ backgroundColor: "transparent" }}
									data-testid="editable-save"
								>
									<DoneIcon />
								</IconButton>
								<IconButton
									onClick={() => setOpenAddRemark(false)}
									style={{ backgroundColor: "transparent" }}
									data-testid="editable-cancel"
								>
									<CloseIcon />
								</IconButton>
							</Box>
						</Box>
					) : (
						<Box>
							<Button
								size="small"
								color="primary"
								onClick={() => setOpenAddRemark(true)}
							>
								{file.remark ? "View Remark" : "Add Remark"}
							</Button>
						</Box>
					)}
				</CardContent>
			</Card>
		</Grid>
	);
};

export default AttachFileForm;
