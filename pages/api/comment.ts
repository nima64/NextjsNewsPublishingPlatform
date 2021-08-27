import { getPromise, runPromise } from '../../lib/db';
import { withSession } from "../../lib/session";

export default withSession(async (req, res) => {
	let foo = 'foo';
	if (req.method == 'POST') {
		let session: any = req.session;
		console.log(req.body)
		if (session.user && req.body.comment && req.body.postID) {
			try {
				let userID = session.user.userID;
				let postID = req.body.postID;
				let comment = req.body.comment;
				await runPromise(`insert into comment (userID, postID, content) values (?, ?, ?)`, [
					userID,
					postID,
					comment
				]);
				return res.send('');
			} catch (err) {
				console.log(err)
			}
		}
	}
	res.status(403).send('');
});