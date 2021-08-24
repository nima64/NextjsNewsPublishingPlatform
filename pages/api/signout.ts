import { withSession } from "../../lib/session";

function destroySessionPromise(req: any) {
	return new Promise((resolve, reject) => {
		if (!req.session)
			reject('no session object');

		req.session.destroy((err: Error) => {
			return err ? reject(err) : resolve('sucess');
		});
	});
}

export default withSession(async (req, res) => {
	if (req.method == 'GET' && req.session) {
		let msg;
		try {
			msg = await destroySessionPromise(req);
		} catch (err) {
			console.log(err);
			return res.status(404).send('');
		}
		res.send(msg);
	} else {
		res.send('');
	}
});