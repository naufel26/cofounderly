import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ConnectionController::index
* @see app/Http/Controllers/ConnectionController.php:15
* @route '/connections'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/connections',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConnectionController::index
* @see app/Http/Controllers/ConnectionController.php:15
* @route '/connections'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConnectionController::index
* @see app/Http/Controllers/ConnectionController.php:15
* @route '/connections'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConnectionController::index
* @see app/Http/Controllers/ConnectionController.php:15
* @route '/connections'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConnectionController::index
* @see app/Http/Controllers/ConnectionController.php:15
* @route '/connections'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConnectionController::index
* @see app/Http/Controllers/ConnectionController.php:15
* @route '/connections'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConnectionController::index
* @see app/Http/Controllers/ConnectionController.php:15
* @route '/connections'
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
* @see \App\Http\Controllers\ConnectionController::send
* @see app/Http/Controllers/ConnectionController.php:81
* @route '/connections/{user}'
*/
export const send = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/connections/{user}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConnectionController::send
* @see app/Http/Controllers/ConnectionController.php:81
* @route '/connections/{user}'
*/
send.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return send.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConnectionController::send
* @see app/Http/Controllers/ConnectionController.php:81
* @route '/connections/{user}'
*/
send.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConnectionController::send
* @see app/Http/Controllers/ConnectionController.php:81
* @route '/connections/{user}'
*/
const sendForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: send.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConnectionController::send
* @see app/Http/Controllers/ConnectionController.php:81
* @route '/connections/{user}'
*/
sendForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: send.url(args, options),
    method: 'post',
})

send.form = sendForm

/**
* @see \App\Http\Controllers\ConnectionController::accept
* @see app/Http/Controllers/ConnectionController.php:109
* @route '/connections/{user}/accept'
*/
export const accept = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/connections/{user}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConnectionController::accept
* @see app/Http/Controllers/ConnectionController.php:109
* @route '/connections/{user}/accept'
*/
accept.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return accept.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConnectionController::accept
* @see app/Http/Controllers/ConnectionController.php:109
* @route '/connections/{user}/accept'
*/
accept.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConnectionController::accept
* @see app/Http/Controllers/ConnectionController.php:109
* @route '/connections/{user}/accept'
*/
const acceptForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConnectionController::accept
* @see app/Http/Controllers/ConnectionController.php:109
* @route '/connections/{user}/accept'
*/
acceptForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(args, options),
    method: 'post',
})

accept.form = acceptForm

/**
* @see \App\Http\Controllers\ConnectionController::ignore
* @see app/Http/Controllers/ConnectionController.php:122
* @route '/connections/{user}/ignore'
*/
export const ignore = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ignore.url(args, options),
    method: 'post',
})

ignore.definition = {
    methods: ["post"],
    url: '/connections/{user}/ignore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConnectionController::ignore
* @see app/Http/Controllers/ConnectionController.php:122
* @route '/connections/{user}/ignore'
*/
ignore.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return ignore.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConnectionController::ignore
* @see app/Http/Controllers/ConnectionController.php:122
* @route '/connections/{user}/ignore'
*/
ignore.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ignore.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConnectionController::ignore
* @see app/Http/Controllers/ConnectionController.php:122
* @route '/connections/{user}/ignore'
*/
const ignoreForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ignore.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConnectionController::ignore
* @see app/Http/Controllers/ConnectionController.php:122
* @route '/connections/{user}/ignore'
*/
ignoreForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ignore.url(args, options),
    method: 'post',
})

ignore.form = ignoreForm

/**
* @see \App\Http\Controllers\ConnectionController::remove
* @see app/Http/Controllers/ConnectionController.php:135
* @route '/connections/{user}'
*/
export const remove = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(args, options),
    method: 'delete',
})

remove.definition = {
    methods: ["delete"],
    url: '/connections/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ConnectionController::remove
* @see app/Http/Controllers/ConnectionController.php:135
* @route '/connections/{user}'
*/
remove.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return remove.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConnectionController::remove
* @see app/Http/Controllers/ConnectionController.php:135
* @route '/connections/{user}'
*/
remove.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ConnectionController::remove
* @see app/Http/Controllers/ConnectionController.php:135
* @route '/connections/{user}'
*/
const removeForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: remove.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConnectionController::remove
* @see app/Http/Controllers/ConnectionController.php:135
* @route '/connections/{user}'
*/
removeForm.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: remove.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

remove.form = removeForm

const connections = {
    index: Object.assign(index, index),
    send: Object.assign(send, send),
    accept: Object.assign(accept, accept),
    ignore: Object.assign(ignore, ignore),
    remove: Object.assign(remove, remove),
}

export default connections