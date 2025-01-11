import {API_ROUTES} from "../constant";
import {FileUpload} from "../definitions";
import apiJwtService from "./apiJwtService";

const uploadFile = {
	
	async upload(formData: FormData) :Promise<any> {
        const url = `${API_ROUTES.UPLOAD_FILE}`;
		return await apiJwtService({
			endpoint: url,
			method: 'POST',
			formData: formData,
		}).catch((err) => {
			return {} as FileUpload;
		});
	},

	delete(fileNames: string[]) :Promise<any> {
		const url = `${API_ROUTES.DELETE_MULTIPLE_FILES}`
		return apiJwtService({
			endpoint: url,
			method: 'DELETE',
			data: fileNames
		});
	}
}

export default uploadFile;
