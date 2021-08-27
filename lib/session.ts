import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import session from 'express-session';
// import sqlite3 from 'sqlite3';
// import session_sqlite from 'express-session-sqlite';
import exp from 'express';
import path from 'path';
import db from './db';

var MySQLStore = require('express-mysql-session')(session)

let options = {
	host: 'maria-database.czhqi7oxesf3.us-west-1.rds.amazonaws.com',
	port: 3306,
	user: 'dbuser',
	password: 'Kenneth12',
	database: 'blogpub'
};

// console.log(`path is ${path.join(__dirname, 'test.db')}`)
var mySession = session({
	store: new MySQLStore({}, db),
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
});

function runMiddleware (req: NextApiRequest, res: NextApiResponse, fn: exp.RequestHandler) {
	return new Promise((resolve, reject) => {
		fn(req as any, res as any, (result: any) => {
			if (result instanceof Error) {
				reject(result)
			}
			resolve(result)
		})
	})
}

export interface Session {
	session: session.Session & Partial<session.SessionData>;
	sessionID: string;
}

type NextApiRequestWithSession = NextApiRequest & Session;
type ApiHandler = (req: NextApiRequestWithSession, res: NextApiResponse) => void;

export const withSession = (handler: ApiHandler) => {
	const fn: NextApiHandler = async (req, res) => {
		await applySession(req, res);
		// try {
		// 	await runMiddleware(req, res, mySession)
		// } catch (err) {
		// 	console.log(err.message)
		// }
		return handler(req as any, res);
	}
	return fn;
}

export const applySession = async (req: any, res: any) => {
	try {
		await runMiddleware(req, res, mySession)
	} catch (err) {
		console.log(err.message)
	}
};

