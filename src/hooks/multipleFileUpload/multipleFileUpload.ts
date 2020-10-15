import React, { useState, useEffect, useCallback } from "react";
import { AttachFile } from "../../models/AttachFile";
import useFileUpload from "../fileUpload";

const useMultipleFileUpload = () => {
	let { uploadFile: uploadFile, error: uploadingError } = useFileUpload();
	const [percentage, setPercentage] = useState(0);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const [uploadedFiles, setUploadedFiles] = useState<boolean[]>([]);
	const [totalFiles, setTotalFiles] = useState(0);

	useEffect(() => {
		if (uploadingError) {
			console.log("checkcheckError", uploadingError);
			setError("Uploading Error");
		}
	}, [uploadingError]);

	const multiplefileUpload = useCallback(
		async ({
			ref,
			refId,
			field,
			path,
			filesArray,
		}: {
			ref: string;
			refId: string;
			field: string;
			path: string;
			filesArray: AttachFile[];
		}) => {
			setTotalFiles(filesArray.length);
			for (let i = 0; i < filesArray.length; i++) {
				let file = filesArray[i];
				/*if file.id === already uploaded */
				if (!file.id) {
					let formData = new FormData();
					formData.append("files", file.file);
					formData.append("ref", ref);
					formData.append("refId", refId);
					formData.append("field", field);
					let fileInfo: any = JSON.stringify({
						alternativeText: file?.file?.name ? file.file.name : "",
						caption: file?.remark ? file.remark : "",
					});
					formData.append("fileInfo", fileInfo);
					formData.append("path", path);
					try {
						let uploadResponse = await uploadFile(formData);
						if (uploadResponse) {
							console.log("checkcheck", uploadResponse);
							let array = [...uploadedFiles];
							array[i] = true;
							setUploadedFiles(array);
						}
					} catch (err) {
						console.error(err);
					}
				}
			}
		},
		[setTotalFiles, setUploadedFiles]
	);

	React.useEffect(() => {
		let percentage = (uploadedFiles.length / totalFiles) * 100;

		if (!percentage) percentage = 0;

		if (percentage === 100) {
			setSuccess(true);
			percentage = 0;
		}

		setPercentage(percentage);
	}, [uploadedFiles, totalFiles]);

	return {
		percentage,
		error,
		success,
		multiplefileUpload,
	};
};

export default useMultipleFileUpload;
