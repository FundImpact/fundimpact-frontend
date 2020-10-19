import React, { useState, useEffect, useCallback } from "react";
import { AttachFile } from "../../models/AttachFile";
import useFileUpload from "../fileUpload";

const useMultipleFileUpload = () => {
	let { uploadFile, error: uploadingError } = useFileUpload();
	const [percentage, setPercentage] = useState(0);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const [uploadedFiles, setUploadedFiles] = useState(0);
	const [totalFiles, setTotalFiles] = useState(0);

	useEffect(() => {
		if (uploadingError) {
			console.log("checkcheckError", uploadingError);
			setError("Uploading Error");
		}
	}, [uploadingError]);

	const multiplefileUpload = async ({
		ref,
		refId,
		field,
		path,
		filesArray,
		setFilesArray,
	}: {
		ref: string;
		refId: string;
		field: string;
		path: string;
		filesArray: AttachFile[];
		setFilesArray: React.Dispatch<React.SetStateAction<AttachFile[]>>;
	}) => {
		setTotalFiles(filesArray.filter((elem) => !elem.id).length);
		let filesUploaded = 0;
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
						filesUploaded++;
						let arr = [...filesArray];
						arr[i].uploadingStatus = true;
						arr[i].id = uploadResponse[0].id;
						setFilesArray(arr);
					}
				} catch (err) {
					console.error(err);
				}
			}
		}
		setUploadedFiles(filesUploaded);
	};

	React.useEffect(() => {
		let percentage = (uploadedFiles / totalFiles) * 100;

		if (!percentage) percentage = 0;

		if (percentage === 100) {
			setSuccess(true);
			percentage = 0;
		}
		// console.log("percentage", uploadedFiles, totalFiles, percentage);
		setPercentage(percentage);
	}, [uploadedFiles, totalFiles, percentage]);

	// console.log(percentage, error, success, uploadedFiles);
	return {
		percentage,
		error,
		success,
		multiplefileUpload,
	};
};

export default useMultipleFileUpload;
