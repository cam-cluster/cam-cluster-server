import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import proxy from 'express-http-proxy';
import path from 'path';
import store from './store';
import api from './api';
import { Server as WebSocketServer } from 'ws';

const port = process.env.PORT || 80;

function setApiRoutes ( app, store ) {
	const router = express.Router();

	Object.keys( api ).forEach( ( endpoint ) => {
		const methods = api[ endpoint ];
		Object.keys( methods ).forEach( ( methodName ) => {
			const path = '/' + endpoint;
			router[ methodName ]( path, ( req, res ) => {
				return methods[ methodName ]( store.getState(), store.getActions() )( req, res );
			} );
		} );
	} );

	// TODO: Add schema
	router.get( '/', ( req, res ) => {
		res.json( { message: 'cam-cluster API' } )
	} );

	app.use( '/api', router );
}

function serveDevDashboard( app ) {
	app.use( '/', proxy( 'http://localhost:3000' ) );
}

function serveDashboard( app ) {
	console.log( 'serveDashboard' );
	const dashboardPath = path.join( __dirname, '../cam-cluster-dashboard/build' );
	app.use( '/cam-cluster/cam-cluster-dashboard', express.static( dashboardPath ) );
	app.get( '/', ( req, res ) => {
		res.sendFile( path.join( dashboardPath, 'index.html' ) );
	} );
	app.get( '/index.html', ( req, res ) => {
		res.sendFile( path.join( dashboardPath, 'index.html' ) );
	} );
}

function createApp() {
	const app = express();

	app.use( bodyParser.urlencoded( { extended: true } ) );
	app.use( bodyParser.json() );

	setApiRoutes( app, store );

	if ( 'development' === process.env.NODE_ENV ) {
		serveDevDashboard( app );
	} else {
		serveDashboard( app );
	}

	return app;
	/*
	app.listen( port );
	console.log( 'wss: ', WebSocketServer );
	console.log( 'cam-cluster listening on port ' + port );
	*/
}

function createWebSocketServer( server ) {
	const wsServer = new WebSocketServer( { server } );
	console.log( 'setting up websocket server' );

	wsServer.on( 'connection', ( socket ) => {
		console.log( 'new ws connection' );
		// TODO: Add proper sync code to get this client's state updated
		socket.send( 'welcome' );

		socket.on( 'message', ( message ) => {
			// TODO: Add message handling
			console.log( 'ws client message: ', message );
		} );

		socket.on( 'close', ( reason ) => {
			// TODO: Clean up
			console.log( 'ws client close: ', reason );
		} );

		socket.on( 'error', ( error ) => {
			// TODO: Handle error
			console.log( 'ws client error: ', error );
		} );

		// TODO: Replace temporary code
		setInterval( () => {
			socket.send( 'testing update' );
		}, 1000 * 15 );
	} );

	return webSocketServer;
}

// Set up the server
const server = http.createServer( createApp() );
const webSocketServer = createWebSocketServer( server );

server.listen( port, () => {
	console.log( 'cam-cluster server listening on port ' + port );
} );
