import React, { useState, useEffect } from "react";
import { AttachFile } from "../../models/AttachFile";
import useFileUpload from "../fileUpload";

const useMultipleFileUpload = (
	filesArray?: AttachFile[],
	setFilesArray?: React.Dispatch<React.SetStateAction<AttachFile[]>>
) => {
	let { uploadFile, error: uploadingError, loadingStatus } = useFileUpload();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState<boolean>(false);

	useEffect(() => {
		if (loadingStatus && filesArray && filesArray?.length && setFilesArray) {
			let arr = [...filesArray];
			arr[loadingStatus.index].uploadStatus = true;

			if (loadingStatus.loaded === loadingStatus.total) {
				arr[loadingStatus.index].uploaderConfig = undefined;
			} else {
				arr[loadingStatus.index].uploaderConfig = {
					loaded: loadingStatus.loaded,
					total: loadingStatus.total,
				};
			}

			setFilesArray(arr);
		}
	}, [loadingStatus]);

	useEffect(() => {
		if (uploadingError) {
			setError("Uploading Error");
		}
	}, [uploadingError]);

	const multiplefileUpload = async ({
		ref,
		refId,
		field,
		path,
		filesArray,
		source,
		setFilesArray,
		setUploadSuccess,
	}: {
		ref: string;
		refId: string;
		field: string;
		path: string;
		source?: string;
		filesArray: AttachFile[];
		setFilesArray: React.Dispatch<React.SetStateAction<AttachFile[]>>;
		setUploadSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
	}) => {
		try {
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
					if (source) {
						formData.append("source", source);
					}
					let uploadResponse = await uploadFile(formData);
					if (uploadResponse) {
						let arr = [...filesArray];
						arr[i].uploadStatus = true;
						arr[i].id = uploadResponse[0].id;
						setFilesArray(arr);
					}
				}
			}
		} catch (err) {
			console.error(err);
		} finally {
			if (setUploadSuccess) setUploadSuccess(true);
		}
	};

	const multiplefileUploader = async ({
		ref,
		refId,
		field,
		path,
	}: {
		ref?: string;
		refId?: string;
		field?: string;
		path?: string;
	}) => {
		if (filesArray && setFilesArray) {
			let error = null;
			try {
				for (let i = 0; i < filesArray.length; i++) {
					let file = filesArray[i];
					/*if file.id === already uploaded */
					if (!file.id) {
						let formData = new FormData();
						let fileInfo: any = JSON.stringify({
							alternativeText: file?.file?.name ? file.file.name : "",
							caption: file?.remark ? file.remark : "",
						});

						formData.append("files", file.file);
						formData.append("fileInfo", fileInfo);
						if (ref) formData.append("ref", ref);
						if (refId) formData.append("refId", refId);
						if (field) formData.append("field", field);
						if (path) formData.append("path", path);
						let uploadResponse = await uploadFile(formData, i);

						if (uploadResponse) {
							let arr = [...filesArray];
							arr[i].uploadStatus = true;
							arr[i].id = uploadResponse[0].id;
							setFilesArray(arr);
						}
					}
				}
			} catch (err) {
				error = err;
				setError(err);
				console.error(err);
			} finally {
				if (!error) console.log("success");
				setSuccess(true);
			}
		}
	};
	return {
		error,
		success,
		multiplefileUpload,
		multiplefileUploader,
		setSuccess,
	};
};

export default useMultipleFileUpload;
