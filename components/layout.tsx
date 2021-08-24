import Pills from "./pills";
import User from "../types/user";
import BaseLayout from "./base_layout";

const MailSubscription = () => (
	<div>
		<style jsx>{`
            button{
              transition: all .2s ease-in-out
            }
            button:hover{
              transform: scale(1.1);
            }
            .disable-scrollbars::-webkit-scrollbar {
                width: 0px;
                background: transparent; /* make scrollbar transparent */
            }
          `}</style>

		<div style={{ padding: '1rem 0', display: 'flex' }} >
			<Pills pills={['science', 'math', 'programming', 'science', 'health']}></Pills>
		</div>
		<div className="bg-indigo-400 p-5 shadow-md rounded-lg text-white text-center">
			<h4 className="font-bold my-3">
				<i className="fa fa-bell"></i> Join us!
			</h4>
			<p className="my-3">Signup for your daily dose of curated, high quality articles on all things science, health, programming, etc ...</p>
			{/* <div> 
              <input className="text-black pl-2" placeholder="email" type="text" /> 
            </div> */}
			<div>
				<button className="shadow-md bg-white my-4 text-gray-700 p-2 rounded-md">Subscribe</button>
			</div>
		</div>
	</div>
);

function Layout ({ user, children }: { user?: User, children: any }) {
	return (
		<BaseLayout user={user}>
			<main className="flex mx-auto max-w-5xl pt-5 mt-7">
				<div className="max-w-2xl mr-4 px-10" >
					{children}
				</div>
				<aside className="max-w-sm">
					<MailSubscription />
				</aside>
			</main>
		</BaseLayout>
	)
}

export default Layout;