import React, { useState, useEffect, useMemo } from "react";
import { AttachFile } from "../../models/AttachFile";
import useFileUpload from "../fileUpload";

const useMultipleFileUpload = (
	filesArray?: AttachFile[],
	setFilesArray?: React.Dispatch<React.SetStateAction<AttachFile[]>>
) => {
	let { uploadFile, error: uploadingError, loadingStatus } = useFileUpload();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	useMemo(() => {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

	const multiplefileMorph = async ({
		related_id,
		related_type,
		field,
	}: {
		related_id: string;
		related_type: string;
		field: string;
	}) => {
		if (filesArray && setFilesArray) {
			let uploadError = null;
			try {
				setLoading(true);
				for (let i = 0; i < filesArray.length; i++) {
					let file = filesArray[i];
					/*if file.id === already uploaded */
					if (file.id) {
						let params = {
							upload_file_id: file.id,
							related_id,
							related_type,
							field,
							order: 3,
						};
						await uploadFile(params, i, true);
					}
				}
			} catch (err) {
				uploadError = err;
				setError(uploadError);
				console.error(uploadError);
			} finally {
				if (!error) console.log("success");
				setLoading(false);
				setSuccess(true);
			}
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
			let uploadError = null;
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
				uploadError = err;
				setError(uploadError);
				console.error(uploadError);
			} finally {
				if (!error) console.log("success");
				setSuccess(true);
			}
		}
	};
	return {
		loading,
		error,
		success,
		multiplefileUpload,
		multiplefileUploader,
		multiplefileMorph,
		setSuccess,
	};
};

export default useMultipleFileUpload;
