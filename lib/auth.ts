import User from "../types/user";
import { applySession } from "./session";

export async function getUser(req: any, res: any): Promise<User | null> {
	await applySession(req, res);
	let user = req.session && req.session.user ? req.session.user : null;
	return user;
}