import User from '../types/user';
import db, { getPromise } from './db';
import { getAllPromise } from './db';

export async function getPostsByTitle (title: string) {
	let posts: any[] = [];
	try {
		let result = await getAllPromise(`select * from posts where lower(title) like lower('%${title}%') limit 20`);
		if (!(result instanceof (Error))) {
			posts = result.rows;
		}
	} catch (err) {
		console.log(err);
		return [];
	}
	return posts;
}

export async function getPostsByTag (tags_str: string) {
	return new Promise((resolve, reject) => {
		let posts: any = [];
		let tags: string[] = tags_str.split(',');

		if (tags) {
			// converts math,science,health to ('math'),('science'),('health')
			let tags_sql: string = tags.map((tag: string) => `('${tag.toLowerCase()}')`).join(',');
			try {
				db.serialize(() => {
					db.run('create TEMP table tag  (tag text not null)', (err: Error) => {
						if (err)
							reject(`error ${err.message}`);
					});
					db.run(`insert into temp.tag (tag) values ${tags_sql}`);
					db.each(`
						with combined_user_tags as (
						select group_concat(tag) 
						from (
							select *
							from temp.tag
							order by tag asc
						)),
						-- get posts which have tags from temptags
						filtered_posts as (
							select t.postID,group_concat(t.tag) as combined_tags 
								from tags t
							inner join temp.tag tt
							where lower(t.tag) = lower(tt.tag)
							group by t.postID
							-- check if post contains all tags from temptags
							having lower(combined_tags) = lower((select * from combined_user_tags))
						)
						select * from filtered_posts fp
						natural join
						post_like_comment 
					`, (err: Error, row: any) => {
						if (!err)
							posts.push(row);
					});
					db.run('drop table temp.tag', (err: Error) => {
						if (!err)
							resolve(posts);
					})
				});
			} catch (err) {
				console.log(err);
				reject(err);
			}
		}
	})
}

export async function getAllPosts (user?: User) {
	try {
		let result = null;

		if (user) {
			let posts_userlikes_likes_comments = `
				SELECT * FROM post_like_comment plc
				LEFT JOIN
				(select postID, userID as liked_by_me
					from "like" 
					where userID = ${user.userID}
				) b
				ON plc.postID = b.postID
			`;
			// result = await getAllPromise(`select * from posts p left outer join (select * from "like" lz where lz.userID = ${user.userID}) l on p.postID = l.postID limit 20`);
			result = await getAllPromise(posts_userlikes_likes_comments);
		} else {
			result = await getAllPromise(`select * from post_like_comment`);
		}
		// console.log(result)
		if (!(result instanceof (Error))) {
			return result.rows;
		}

	} catch (err) {
		console.log(err);
	}
	return [];
}
