import { useState } from "react";

export function SearchInput({ searchResults, onChange, className = '' }: { searchResults: any[], onChange: any; className?: string; }) {
	let [listHovering, setListHovering] = useState(false);
	let [inputFocused, setInputFocused] = useState(false);
	return (
		<>
			{/* <Links links={['home', 'about']}></Links> */}
			<style jsx>{`
				input:focus-visible{
					outline: none;
				}
				input{
					font-family: arial, sans-serif;
					border: 1px solid #bbc0c4;
					border-radius: 25px;
					font-size: 0.95rem;
					transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out
					// transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out !default;
				}
				input:focus{
					  color: #212529;
						background-color: #fff;
						border-color: #86b7fe;
						outline: 0;
						box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
				}

				.list-group {
					display: flex;
					flex-direction: column;
					padding-left: 0;
					margin-bottom: 0;
					border-radius: 0.25rem;
				}
				.list-group-item {
					position: relative;
					display: block;
					padding: 0.5rem 1rem;
					color: #212529;
					text-decoration: none;
					background-color: #fff;
					// border: 1px solid rgba(0, 0, 0, 0.125);
					border-left-width: 1px;
					border-right-width: 1px;
					border-top-width: 1px;
					border-color: rgba(0, 0, 0, 0.125);
				}
				.list-group-item:hover {
					background-color: #efefef;
				}
				.list-group-item:first-child {
					border-top-left-radius: 15px;
					border-top-right-radius: 15px;
				}
				.list-group-item:last-child {
					border-bottom-right-radius: 15px;
					border-bottom-left-radius: 15px;
					border-bottom-width: 1px;
				}
			`}</style>
			<div className={"relative " + className}>
				<div className="relative w-80">
					<i className="search-input fa fa-search text-xl absolute left-3 top-2 text-gray-400"></i>
					<input onChange={onChange} className="w-full text-gray-700 h-8 py-4 pl-8 pr-4"
						placeholder="search..."
						onFocus={() => setInputFocused(true)}
						onBlur={() => setInputFocused(false)}
					></input>
				</div>
				{
					(listHovering || inputFocused) &&
					<ul
						onMouseOver={() => {
							console.log('hovering ' + listHovering);
							setListHovering(true);
						}}
						onMouseLeave={() => {
							setListHovering(false);
						}}

						id="search-list"
						style={{ borderRadius: '15px', fontSize: '0.9rem' }}
						className="shadow-md list-group mt-2 w-80 left-3 absolute">
						{
							searchResults.slice(0, 7).map((post, i) => (
								<li key={i} className="list-group-item bg-gray-400">
									<a className="block" href={`/post/${post.postID}`}>
										{post.title.substr(0, 50)}
									</a>
								</li>))
						}
					</ul>
				}
			</div>
		</>
	)
}