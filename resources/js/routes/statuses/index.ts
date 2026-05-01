import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\StatusController::index
* @see app/Http/Controllers/StatusController.php:13
* @route '/statuses'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/statuses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StatusController::index
* @see app/Http/Controllers/StatusController.php:13
* @route '/statuses'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StatusController::index
* @see app/Http/Controllers/StatusController.php:13
* @route '/statuses'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StatusController::index
* @see app/Http/Controllers/StatusController.php:13
* @route '/statuses'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\StatusController::index
* @see app/Http/Controllers/StatusController.php:13
* @route '/statuses'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StatusController::index
* @see app/Http/Controllers/StatusController.php:13
* @route '/statuses'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StatusController::index
* @see app/Http/Controllers/StatusController.php:13
* @route '/statuses'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\StatusController::store
* @see app/Http/Controllers/StatusController.php:35
* @route '/statuses'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/statuses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StatusController::store
* @see app/Http/Controllers/StatusController.php:35
* @route '/statuses'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StatusController::store
* @see app/Http/Controllers/StatusController.php:35
* @route '/statuses'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StatusController::store
* @see app/Http/Controllers/StatusController.php:35
* @route '/statuses'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StatusController::store
* @see app/Http/Controllers/StatusController.php:35
* @route '/statuses'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\StatusController::destroy
* @see app/Http/Controllers/StatusController.php:60
* @route '/statuses/{status}'
*/
export const destroy = (args: { status: number | { id: number } } | [status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/statuses/{status}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\StatusController::destroy
* @see app/Http/Controllers/StatusController.php:60
* @route '/statuses/{status}'
*/
destroy.url = (args: { status: number | { id: number } } | [status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { status: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { status: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            status: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        status: typeof args.status === 'object'
        ? args.status.id
        : args.status,
    }

    return destroy.definition.url
            .replace('{status}', parsedArgs.status.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StatusController::destroy
* @see app/Http/Controllers/StatusController.php:60
* @route '/statuses/{status}'
*/
destroy.delete = (args: { status: number | { id: number } } | [status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\StatusController::destroy
* @see app/Http/Controllers/StatusController.php:60
* @route '/statuses/{status}'
*/
const destroyForm = (args: { status: number | { id: number } } | [status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StatusController::destroy
* @see app/Http/Controllers/StatusController.php:60
* @route '/statuses/{status}'
*/
destroyForm.delete = (args: { status: number | { id: number } } | [status: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const statuses = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default statuses