import { getAllPromise, getPromise } from "../../lib/db";
import PostType from "../../types/post";
import BaseLayout from "../../components/base_layout";
import { getUser } from "../../lib/auth";
import User from "../../types/user";
import { useRef } from "react";
var he = require('he');

const CreateComment = ({ postID }: any) => {
	let textAreaRef = useRef<HTMLTextAreaElement>(null);

	let submit = () => {
		fetch('/api/comment', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ postID: postID, comment: textAreaRef.current?.value })
		}).then(res => { if (res.status == 200) window.location.href = `/post/${postID}` })
	}

	return (
		<div className="flex items-center justify-center shadow-lg mb-4 ">
			<div className="w-full bg-white rounded-lg px-4 pt-2">
				<div className="flex flex-wrap -mx-3 mb-6">
					<h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg">Add a new comment</h2>
					<div className="w-full md:w-full px-3 mb-2 mt-2">
						<textarea ref={textAreaRef} className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 placeholder-gray-700 focus:outline-none focus:bg-white" name="body" placeholder='Type Your Comment' required></textarea>
					</div>
					<div className="w-full flex items-start md:w-full px-3">
						<div className="flex items-start w-1/2 text-gray-700 px-2 mr-auto">
							<svg fill="none" className="w-5 h-5 text-gray-600 mr-1" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<p className="text-xs md:text-sm pt-px">Some HTML is okay.</p>
						</div>
						<div className="-mr-1">
							<button onClick={submit} className=" text-white font-medium py-1 px-4 border rounded-lg tracking-wide mr-1 bg-indigo-500 hover:bg-indigo-600">Post Comment</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const Post = ({ post, user, comments }: { post?: PostType; user?: User; comments: any[]; }) => {
	return (
		<BaseLayout user={user}>
			<main className="mt-14 max-w-4xl px-10 mx-auto">
				{/* <article id="mainArticle" className="max-w-4xl px-10 mx-auto"> */}
				<article id="mainArticle" >
					{
						post && <div dangerouslySetInnerHTML={{ __html: he.decode(post.content) }}></div>
					}
				</article>
				<div id="comments" className="bg-indigo-200 rounded-md px-6 py-6 mt-8">

					<CreateComment postID={post?.postID} />
					<h3 className="font-medium">Comments</h3>
					<ul>
						{
							comments && comments.map((comment: any, i: number) => (
								<li key={i} className="mt-4">
									<div className="p-4 shadow-lg rounded-md bg-white">
										<p><b>{comment.username}</b> <span className="text-gray-700"> {comment.dateCreated}</span></p>
										<p>{comment.content} </p>
									</div>
								</li>
							))
						}
					</ul>
				</div>
				<div className="mt-16">
					<p></p>
				</div>
			</main>
		</BaseLayout>
	);
}

export async function getServerSideProps ({ params, req, res }: any) {
	let user = await getUser(req, res);
	let pid = params.pid;
	let post = null;
	let comment: any[] = [];
	let comments_query = `
			select * from comment c
			inner join
			user u
			on c.userID = u.userID
			where postID = ${pid}
			`;
	try {
		let post_result = await getPromise(`select * from posts where postID = ${pid}`);
		let comment_result = await getAllPromise(comments_query);
		post = post_result instanceof (Error) ? post : post_result;
		comment = comment_result instanceof (Error) ? comment : comment_result.rows;
	} catch (err) {
		console.log(err)
	}

	return {
		props: {
			'post': post,
			'user': user,
			comments: comment
		}
	}
}

export default Post;