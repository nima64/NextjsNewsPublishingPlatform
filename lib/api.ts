import User from '../types/user';
import db, { getPromise, getAllPromise, runPromise } from './db';

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
	return new Promise(async (resolve, reject) => {
		let posts = null;
		let tags: string[] = tags_str.split(',');

		if (tags) {
			// converts math,science,health to ('math'),('science'),('health')
			// let tags_sql: string = tags.map((tag: string) => `('${tag.toLowerCase()}')`).join(',');
			let tags_sql = tags.map((tag: string) => [tag]);
			try {
				let run_queries = async () => {
					await runPromise('create TEMPORARY TABLE IF NOT EXISTS temptag (tag text not null)');
					await runPromise(`insert into temptag (tag) values ?`, [tags_sql])
					posts = await getAllPromise(`
						WITH combined_user_tags AS (
							SELECT group_concat(t.tag ORDER BY t.tag DESC) 
							FROM temptag t 
						),
						-- get posts which have tags from temptag
						filtered_posts as (
							select t.postID,group_concat(t.tag ORDER BY t.tag DESC) as combined_tags 
							from tags t
							inner join temptag tt
							ON lower(t.tag) = lower(tt.tag)
							group by t.postID
							-- check if post contains all tags from temptag
							having lower(combined_tags) = lower((select * from combined_user_tags))
						)
						select * from filtered_posts fp
						natural join
						post_like_comment 
						limit 10
					`);
					await runPromise('DROP TEMPORARY TABLE IF EXISTS temptag');
					if (!(posts instanceof Error)) resolve(posts.rows);
				};
				await run_queries();
			} catch (err) {
				console.log(err);
				reject([]);
			}
		}
	})
}

export async function getAllPosts (user?: User) {
	try {
		let result = null;

		if (user) {
			let posts_userlikes_likes_comments = `
				SELECT plc.*, b.liked_by_me FROM post_like_comment plc
				LEFT JOIN
				(select postID, userID as liked_by_me
					from likes 
					where userID = ${user.userID}
				) b
				ON plc.postID = b.postID
				limit 10
			`;
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
