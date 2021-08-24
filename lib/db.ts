import sqlite3 from "sqlite3";

let con: sqlite3.Database | null = null;

if (process.env.NODE_ENV !== 'production') {
	let gb: any = global;
	if (!gb.dbconnection) {
		let db = new sqlite3.Database('test.db', (err) => {
			if (err)
				console.log(err.message)
			console.log(`connected to sqlite3`);
		});
		gb.dbconnection = db;
	}
	con = gb.dbconnection;
}

export function runPromise (sql_query: string, params: any = []) {
	return new Promise((resolve, reject) => {
		if (!con) {
			return reject(new Error('sqlite db is not connected'));
		}
		con.run(sql_query, params, (err) => {
			if (err) {
				console.log(err);
				reject(err)
			}
			resolve('sql query exectued');
		});
	});
}

export function getPromise (sql_query: string, params: any = []): Promise<any> {
	return new Promise((resolve, reject) => {
		if (!con) {
			return reject(new Error('sqlite db is not connected'));
		}
		con.get(sql_query, params, (err, row) => {
			if (err) {
				console.log(`err ${err}`)
				reject(err)
			}
			if (row == undefined) {
				resolve(null);
			}
			resolve(row);
		});
	});
}

export function getAllPromise (sql_query: string, params: any = []): Promise<{ count: number; rows: any[] } | Error> {
	return new Promise((resolve, reject) => {
		let rows: any[] = [];
		if (!con) {
			return reject(new Error('sqlite db is not connected'));
		}
		con.each(sql_query, params, (err, row) => {
			if (err) {
				console.log(err)
				reject(err)
			}
			rows.push(row);
		}, (err, count) => {
			if (err)
				reject(err)
			resolve({
				'count': count,
				'rows': rows
			})
		});


	});
}

export default con as sqlite3.Database;