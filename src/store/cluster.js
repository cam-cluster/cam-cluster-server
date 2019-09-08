const DEFAULT_STATE = { mode: 'idle' };

const actions = {
	update: ( cluster ) => cluster,
};

const handlers = {
	update: ( cluster, newCluster ) => ( { ...cluster, ...newCluster } ),
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