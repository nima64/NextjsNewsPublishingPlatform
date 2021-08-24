import { getUser } from "../../lib/auth";
import { getPromise, runPromise } from '../../lib/db';
import { withSession } from "../../lib/session";

export default withSession(async (req, res) => {
	if (req.method == 'POST') {
		let session: any = req.session;
		if (session.user && req.body.postID) {
			try {
				let userID = session.user.userID;
				// console.log(req.body);
				let userAlreadyLiked = await getPromise(`select userID from like where userID = ${session.user.userID} and postID = ${req.body.postID}`)
				if (!userAlreadyLiked) {
					await runPromise(`insert into like (userID, postID) values (${session.user.userID},${req.body.postID})`);
					console.log('inserted')
				} else {
					await runPromise(`delete from like where userID = ${session.user.userID} and postID = ${req.body.postID}`);
					console.log('delted')
				}
				return res.send('');
			} catch (err) {
				console.log(err)
			}
		}
	}
	res.status(403).send('');
});