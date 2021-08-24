interface PostType {
	postID: number;
	author: string,
	title: string;
	content: string;
	description: string;
	datePublished: string;
	total_likes?: number;
	total_comments?: number;
	liked_by_me?: number;
}
export default PostType;