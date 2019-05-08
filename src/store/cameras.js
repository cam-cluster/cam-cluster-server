const DEFAULT_STATE = {};

const actions = {
	register: ( camera ) => camera,
};

const handlers = {
	register: ( cameras, camera ) => ( { ...cameras, [ camera.mac ]: camera } ),
};

function reducer( state = DEFAULT_STATE, actionName, data ) {
	const handler = handlers[ actionName ];

	if ( handler ) {
		return handler( state, data );
	}
	return state;
}

export default {
	reducer,
	actions,
};