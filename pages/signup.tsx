
export default function SignUp () {
	return (
		<div className="antialiased font-sans flex justify-center h-full">
			<style global jsx>{`
					html,body, #__next{
						height: 100%
					}
					body{
						background-color: rgba(229, 231, 235, 1);
					}
				`}</style>
			<div className="mt-2 sm:mt-6 w-10/12 sm:w-2/3 max-w-xl">
				<div className="md:grid md:grid-cols-2 md:gap-8">
					<div className="mt-5 md:mt-0 md:col-span-2">
						<form action="/api/create-account" method="POST">
							<div className="shadow overflow-hidden rounded-lg">
								<div className="p-6 bg-white sm:p-8">
									<div>
										<img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
										<h2 className="my-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
											Create your account
										</h2>
									</div>
									<div className="grid grid-cols-4 gap-6">
										<div className="col-span-6 sm:col-span-4">
											<label htmlFor="username" className="block text-sm font-medium text-gray-700">User Name</label>
											<input type="text" name="username" id="username" autoComplete="username" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
										</div>
										<div className="col-span-6 sm:col-span-4">
											<label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email address</label>
											<input type="text" name="email" id="email-address" autoComplete="email" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
										</div>
										<div className="col-span-6 sm:col-span-4">
											<label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
											<input type="password" name="password" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
										</div>
										<div className="col-span-6 sm:col-span-4">
											<label htmlFor="password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
											<input type="password"  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
										</div>
									</div>
									<div className="mt-3 py-3 bg-gray-50 text-right">
										<input type="submit"  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" />
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}
