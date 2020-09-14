import React, { useState, useEffect } from "react";
import {
	Grid,
	Theme,
	Typography,
	makeStyles,
	FormControl,
	InputLabel,
	Input,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Close from "@material-ui/icons/Close";
import { FormikProps } from "formik";

const useStyles = makeStyles((theme: Theme) => ({
	uploadBox: {
		backgroundColor: theme.palette.grey[300],
		height: (props: { height?: string }) => props.height,
		alignItems: "center",
		position: "relative",
	},
	close: {
		color: theme.palette.error.main,
		position: "absolute",
		right: "0px",
		top: "0px",
	},
}));

//remove any
function UploadFiles<T>({
	title,
	formik,
	name,
	required,
	testId,
	dataTestId,
	id,
	logo,
	...props
}: {
	title: string;
	height?: string;
	formik: FormikProps<T>;
	name: string;
	required: boolean;
	testId: string;
	dataTestId: string;
	id: string;
	logo?: string;
}) {
	const classes = useStyles(props);
	const [previewImage, setPreviewImage] = useState<string | null>(logo || null);
	
	useEffect(() => {
		setPreviewImage(logo || "");
	}, [logo]);

	return (
		<Grid container className={classes.uploadBox}>
			{previewImage && (
				<>
					<Close className={classes.close} onClick={() => setPreviewImage(null)} />
					<img src={previewImage} style={{ width: "100%", height: "100%" }} alt="" />
				</>
			)}
			{!previewImage && (
				<Grid item xs={12}>
					<FormControl fullWidth>
						<InputLabel
							shrink={false}
							htmlFor={id}
							style={{ width: "100%", position: "static" }}
						>
							<Typography align="center" variant="h5" color="textPrimary">
								<AddCircleOutlineIcon fontSize="large" />
								<br />
								{title}
							</Typography>
						</InputLabel>

						<Input
							onChange={(e: any): void => {
								e.persist();
								e.preventDefault();
								setPreviewImage(URL.createObjectURL(e.target.files[0]));
								formik.setFieldValue(name, e.target.files[0]);
							}}
							id={id}
							onBlur={formik.handleBlur}
							required={required}
							name={name}
							data-testid={dataTestId}
							inputProps={{
								"data-testid": testId,
								accept: "image/jpeg,image/gif,image/png",
							}}
							type={"file"}
							style={{
								visibility: "hidden",
							}}
						/>
					</FormControl>
				</Grid>
			)}
		</Grid>
	);
}

export default UploadFiles;
