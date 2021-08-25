import { withSession } from '../../lib/session';
import db from '../../lib/db';
import { getPromise } from '../../lib/db';
import User from '../../types/user';

async function validate_user (username: string, password: string) {
	if (username && password) {
		let row: any = await getPromise(`select * from user where username = '${username}' and password = '${password}'`);
		if (!row)
			return false;
		if (row.userID) {
			return row as User;
		}
		if (row instanceof (Error)) {
			console.log(row.message);
		}
	}
	return false;
}

export default withSession(async (req, res) => {
	if (req.method == 'GET') {
		return res.status(404).send('');
	}

	let session: any = req.session;

	if (session.userID) {
		return res.send('already logged in')
	}

	let [username, password] = [req.body.username, req.body.password];
	let user = await validate_user(username, password);
	if (!user) {
		return res.status(404).send('user not found');
	}
	console.log(`logged user ${user.userID}`)
	session.user = user;

	return res.send(JSON.stringify(`user is now logged in`));
});
