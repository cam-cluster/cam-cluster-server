import express from 'express';
import bodyParser from 'body-parser';
import proxy from 'express-http-proxy';
import path from 'path';
import store from './store';
import api from './api';

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

	app.listen( port );
	console.log( 'cam-cluster listening on port ' + port );
}

createApp();
