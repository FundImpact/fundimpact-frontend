import React, { useState } from "react";
import { useIntl } from "react-intl";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import Close from "@material-ui/icons/Close";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	Grid,
	IconButton,
	Input,
	InputLabel,
	makeStyles,
	Switch,
	TextField,
	Typography,
} from "@material-ui/core";
import { readableBytes } from "../../../utils";
import { AttachFile } from "../../../models/AttachFile";

const useStyles = makeStyles((theme) => ({
	root: {
		height: 290,
		position: "relative",
	},
	buttonAddFiles: {
		marginLeft: theme.spacing(1),
	},
	media: {
		height: 160,
	},
	mediaListBox: {
		maxHeight: "500px",
		minHeight: "500px",
		overflow: "scroll",
		border: `3px solid ${theme.palette.text.primary}`,
		margin: theme.spacing(2),
		width: "100%",
		backgroundColor: theme.palette.action.selected,
	},
	remarkBox: {
		display: "flex",
		"& :hover": {
			"& $EditIcon": {
				opacity: 1,
			},
		},
	},
	EditIcon: {
		opacity: 0,
	},
	close: {
		color: theme.palette.error.main,
		position: "absolute",
		right: "0px",
		top: "0px",
	},
	button: {
		color: theme.palette.background.paper,
		marginRight: theme.spacing(2),
	},
	myCancelButton: {
		"&:hover": {
			color: "#d32f2f !important",
		},
		padding: theme.spacing(1),
		marginRight: theme.spacing(2),
	},
}));

function AttachFileForm(props: {
	open: boolean;
	handleClose: () => void;
	filesArray: AttachFile[];
	setFilesArray: React.Dispatch<React.SetStateAction<AttachFile[]>>;
	parentOnSave?: any;
}) {
	const formIsOpen = props.open;
	const onCancel = props.handleClose;
	const { filesArray, setFilesArray } = props;
	const intl = useIntl();
	const [multiple, setMultiple] = useState(false);
	const classes = useStyles();
	const { parentOnSave } = props;

	let nofilesSelected = intl.formatMessage({
		id: "noFilesSelectedForAttachFileForm",
		defaultMessage: "No Files Selected",
		description: "This text will be show on attach file form if no files are selected",
	});

	let uploadAssests = intl.formatMessage({
		id: "addAttachFileFormTitle",
		defaultMessage: "Upload Assests",
		description: "This text will be show on upload media form for title",
	});

	let saveButton = intl.formatMessage({
		id: "saveButtonForAttachFileForm",
		defaultMessage: "Save",
		description: "This text will be show on attach file form for save button",
	});

	let closeButton = intl.formatMessage({
		id: "addAttachFileFormTitle",
		defaultMessage: "Close",
		description: "This text will be show on attach file form for close button",
	});
	// React.useEffect(() => {
	// 	let percentage =
	// 		(filesArray.filter((elem) => elem.uploadingStatus === true).length /
	// 			filesArray.length) *
	// 		100;
	// 	if (percentage === 100 || !percentage) percentage = 0;

	// 	setLoadingPercentage(percentage);
	// }, [filesArray, onSaveCall]);

	const onSave = async () => {
		if (parentOnSave) parentOnSave();
		onCancel();
	};

	return (
		<React.Fragment>
			<Dialog
				onClose={onCancel}
				aria-labelledby="simple-dialog-title"
				open={formIsOpen}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle id="simple-dialog-title">{uploadAssests}</DialogTitle>
				<DialogContent dividers>
					<Grid container>
						<Grid item xs={12} container justify="space-between">
							<FormControl>
								<InputLabel
									shrink={false}
									htmlFor={"attachFileId"}
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
												uploadingStatus: false,
											});
										});

										setFilesArray([...filesArray, ...fileArr]);
									}}
									id={"attachFileId"}
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
										{nofilesSelected}
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
										removeFile: () => {
											let fileArr = [...filesArray];
											fileArr.splice(index, 1);
											setFilesArray(fileArr);
										},
									}}
								/>
							))}
						</Grid>
					</Grid>
				</DialogContent>

				<DialogActions>
					<Button
						autoFocus
						className={classes.button}
						variant="contained"
						color="secondary"
						onClick={onSave}
					>
						{saveButton}
					</Button>
					<Button className={classes.myCancelButton} onClick={onCancel}>
						{closeButton}
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}

const AttachedFileList = (props: {
	file: any;
	addRemark: (text: string) => void;
	removeFile: () => void;
}) => {
	const [openAddRemark, setOpenAddRemark] = React.useState(false);
	const { file, addRemark, removeFile } = props;
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
				{/*if not uploaded*/}
				{!file.id && (
					<IconButton
						className={classes.close}
						onClick={() => {
							removeFile();
						}}
					>
						<Close />
					</IconButton>
				)}
				<CardMedia
					className={classes.media}
					image={file?.preview ? file?.preview : file.url}
				/>
				<CardContent>
					<Box ml={1}>
						<Typography gutterBottom variant="subtitle2" noWrap>
							{`File-${file?.file?.name ? file?.file?.name : file.name}`}
						</Typography>
						<Typography gutterBottom variant="body2" noWrap>
							{`Size-${readableBytes(
								file?.file?.size ? file?.file?.size : file.size
							)}`}
						</Typography>
					</Box>
					{!file.id ? (
						<>
							{openAddRemark ? (
								<Box display="flex">
									<TextField
										id="outlined-basic"
										label="Remark"
										value={text}
										onChange={handleTextField}
										inputProps={{
											"data-testid": "attachFile-input",
										}}
									/>
									<Box display="flex">
										<IconButton
											onClick={() => {
												addRemark(text);
												setOpenAddRemark(false);
											}}
											style={{ backgroundColor: "transparent" }}
											data-testid="attachFile-save"
										>
											<DoneIcon fontSize="small" />
										</IconButton>
										<IconButton
											onClick={() => setOpenAddRemark(false)}
											style={{ backgroundColor: "transparent" }}
											data-testid="attachFile-cancel"
										>
											<CloseIcon fontSize="small" />
										</IconButton>
									</Box>
								</Box>
							) : (
								<Box className={classes.remarkBox}>
									{!file.remark ? (
										<Box>
											<Button
												size="small"
												color="primary"
												onClick={() => setOpenAddRemark(true)}
											>
												{"Add Remark"}
											</Button>
										</Box>
									) : (
										<Box ml={1} mb={1} display="flex">
											<Typography variant="body2" gutterBottom>
												{`Remark-${
													file.remark ? file.remark : file.caption
												}`}
											</Typography>
											<Box className={classes.EditIcon}>
												<IconButton
													onClick={() => setOpenAddRemark(true)}
													data-testid="attachFile-edit"
													size="small"
												>
													<EditOutlinedIcon fontSize="small" />
												</IconButton>
											</Box>
										</Box>
									)}
								</Box>
							)}
						</>
					) : (
						<Box ml={1}>
							{file.caption?.length > 0 && (
								<Typography variant="body2" gutterBottom>
									{`Remark-${file.caption}`}
								</Typography>
							)}
						</Box>
					)}
				</CardContent>
			</Card>
		</Grid>
	);
};

export default AttachFileForm;
