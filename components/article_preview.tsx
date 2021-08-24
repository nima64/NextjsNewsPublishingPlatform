import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PostType from "../types/post";
import User from "../types/user";

const removeTimeZone = (time: string) => time.replace(/T.+/, '');

export default function ArticlePreview ({ post, user }: { post: PostType, user?: User }) {
	let [like, setLike] = useState(false);
	let [totalLikes, setTotalLikes] = useState(0);

	const likePost = () => (
		fetch('/api/like', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ 'postID': post.postID })
		}).then(res => {
			if (res.status == 200){
				let newtotal = !like ? totalLikes+1: totalLikes-1;
				setLike(!like);
				setTotalLikes(newtotal);
			}
		}));

	useEffect(() => { 
		setLike(Boolean(post.liked_by_me));
		setTotalLikes(Number(post.total_likes));
	}, []);

	return (
		<div className="home-post pt-11 bg-white" style={{ borderBottom: '1px solid #dcdcdc' }}>
			<p className="text-gray-600">{post.author} on {removeTimeZone(post.datePublished)} </p>
			<a href={`/post/${post.postID}`}>
				<h2 className="text-2xl font-semibold mb-2" >{post.title}</h2>
			</a>
			<p>{post.description}</p>
			<div className="py-5 text-gray-600">
				{
					[
						{ icon: like ? 'heart' : 'heart-o', text: totalLikes, clickH: likePost},
						{ icon: 'comment-o', text: Number(post.total_comments), clickH: () => window.location.href = `/post/${post.postID}` }
					].map((item, i) => (
						<button key={i} onClick={item.clickH} className="inline-block rounded-md hover:bg-gray-200 px-2 py-1 mr-3" style={{ fontSize: '0.95rem' }}>
							<i className={`fa fa-${item.icon} before:text-md mr-2`} aria-hidden="true"></i>
							<span>{item.text}</span>
						</button>
					))
				}
			</div>
		</div>
	)
}
