import sqlite3 from "sqlite3";
import mysql from 'mysql';
var sqlstring = require('sqlstring')

let con: mysql.Connection | null = null;

let options = {
	host: 'maria-database.czhqi7oxesf3.us-west-1.rds.amazonaws.com',
	port: 3306,
	user: 'dbuser',
	password: 'Kenneth12',
	database: 'blogpub'
};

if (process.env.NODE_ENV !== 'production') {
	let gb: any = global;
	if (!gb.dbconnection) {
		let db = mysql.createConnection(options);
		// let db = new sqlite3.Database('test.db', (err) => {
		// 	if (err)
		// 		console.log(err.message)
		// 	console.log(`connected to sqlite3`);
		// });
		gb.dbconnection = db;
	}
	con = gb.dbconnection;
}

function queryPromise (sql_query: string, params: any[] = []) {
	return new Promise((resolve, reject) => {
		if (!con) {
			return reject(new Error('db is not connected'));
		}
		con.query(sqlstring.format(sql_query, params), (err, results) => {
			if (err) {
				console.log(err);
				return reject(err.message)
			}
			if (!results[0])
				return resolve(null);
			// return resolve(Object.assign({}, results[0]));
			resolve(JSON.parse(JSON.stringify(results[0])));
		});
	});
}

export function runPromise (sql_query: string, params: any[] = []) {
	return queryPromise(sql_query, params);
}

export function getPromise (sql_query: string, params: any[] = []): Promise<any> {
	return queryPromise(sql_query, params);
}

export function getAllPromise (sql_query: string, params: any = []): Promise<{ count: number; rows: any[] } | Error> {
	return new Promise((resolve, reject) => {
		if (!con) {
			return reject(new Error('db is not connected'));
		}
		con.query(sqlstring.format(sql_query, params), (err, results: any[]) => {
			if (err) {
				console.log(err);
				return reject(err)
			}
			resolve({
				count: results.length,
				// rows: results.map(result => Object.assign({}, result))
				rows: results.map(result => JSON.parse(JSON.stringify(result)))
			});
		});
	});
}

export default con as mysql.Connection;