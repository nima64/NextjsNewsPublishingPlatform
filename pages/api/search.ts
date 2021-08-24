import { NextApiRequest, NextApiResponse } from 'next';
import { getPostsByTag, getPostsByTitle } from '../../lib/api';
import db from '../../lib/db';
import { getAllPromise } from '../../lib/db';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	if (req.query.title) {
		let posts = await getPostsByTitle(req.query.title as string);
		return res.send(JSON.stringify(posts));
		// }
	} else if (req.query.tags) {
		let posts = await getPostsByTag(req.query.tags as string);
		return res.send(JSON.stringify(posts));
	}
	return res.status(404).send(`sorry that query doesn't exist`);
}