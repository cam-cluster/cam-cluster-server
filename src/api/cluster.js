import debugFactory from 'debug';

const debug = debugFactory( 'cam-cluster:api-cluster' );

const get = ( state ) => ( req, res ) => {
	const { cluster } = state;
	res.json( cluster );
};

const put = ( state, actions ) => ( req, res ) => {
	debug( 'put: %s', JSON.stringify( req.body ) );
	const data = req.body;
	const { cluster, cameras } = state;

	console.log( 'cluster update: ', data );
	// TODO: Validate inputs
	// TODO: Update all cameras with properties given.
	const newState = actions.cluster.update( data );
	const newCameras = Object.values( newState.cameras );

	console.log( 'newCameras: ', newCameras );
	newCameras.forEach( ( camera ) => {
		console.log( 'camera: ', camera );
	} );

	res.status( 200 ).json( newState.cluster );
}

export default { get, put };