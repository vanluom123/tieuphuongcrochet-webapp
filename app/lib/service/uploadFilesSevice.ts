import { API_ROUTES } from "../constant";
import apiJwtService from "./apiJwtService";

const uploadFile = {

	async upload(formData: FormData): Promise<any> {
		const res = await apiJwtService({
			endpoint: API_ROUTES.FIREBASE_STORAGE,
			method: 'POST',
			formData: formData,
		});
		return res;
	},

	async delete(fileNames: string[]): Promise<any> {
		const res = await apiJwtService({
			endpoint: API_ROUTES.FIREBASE_STORAGE,
			method: 'DELETE',
			data: fileNames
		});
		return res;
	}
}

export default uploadFile;
