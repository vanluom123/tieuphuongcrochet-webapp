import { API_ROUTES } from "../constant";
import { FileUpload } from "../definitions";
import apiService from "./apiService";

const uploadFile = {
	
	async upload(formData: FormData) :Promise<any> {
        const headers= { 'Content-Type': 'multipart/form-data' } 
        const url = `${API_ROUTES.UPLOAD_FILE}`;
		const res = await apiService({  
			endpoint: url,
			method: 'POST',
			formData,
			headers
		}).catch((err) => {
			console.log("err", err);
			return {} as FileUpload;
		});
		return res;
	},

	delete(fileNames: string[]) :Promise<any> {
		const url = `${API_ROUTES.DELETE_MULTIPLE_FILES}`
		return apiService({
			endpoint: url,
			method: 'DELETE',
			data: fileNames
		});
	}
}

export default uploadFile;
