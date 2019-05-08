import debugFactory from 'debug';

const debug = debugFactory( 'cam-cluster:api-cameras' );

const get = ( state ) => ( req, res ) => {
	const { cameras } = state;
	res.json( cameras );
};

const post = ( state, actions ) => ( req, res ) => {
	debug( 'post: %s', JSON.stringify( req.body ) );
	const camera = req.body;

	actions.cameras.register( camera );
	res.status( 200 ).json( camera );
};

export default { get, post };