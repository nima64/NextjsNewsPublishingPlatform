import { applySession, withSession } from '../../lib/session';
import { getPromise, runPromise } from '../../lib/db';
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
	if (req.method == 'GET') return res.status(403).send('only post requests allowed');

	let { username, password, email } = req.body;

	if (username && password && email) {
		let user = await getPromise('select * from user where email=? or username=?', [email, username]);
		if (user) {
			console.log(user);
			if (user.email === email)
				return res.status(422).send('email already exists');
			if (user.username === username)
				return res.status(422).send('username already exists');
		}

		let created = await runPromise('insert into user (email,username,password) values (?,?,?)', [email, username, password]);
		if (created) {
			let newUser = await getPromise('select * from user where username=? and password=?', [username, password]);
			let session: any = req.session;
			session.user = newUser;
			return res.redirect('/');
		}
	}

	return res.status(400).send('');
});