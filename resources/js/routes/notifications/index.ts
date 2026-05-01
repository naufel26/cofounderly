import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\NotificationController::read
* @see app/Http/Controllers/NotificationController.php:10
* @route '/notifications/{id}/read'
*/
export const read = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: read.url(args, options),
    method: 'patch',
})

read.definition = {
    methods: ["patch"],
    url: '/notifications/{id}/read',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\NotificationController::read
* @see app/Http/Controllers/NotificationController.php:10
* @route '/notifications/{id}/read'
*/
read.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return read.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::read
* @see app/Http/Controllers/NotificationController.php:10
* @route '/notifications/{id}/read'
*/
read.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: read.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\NotificationController::read
* @see app/Http/Controllers/NotificationController.php:10
* @route '/notifications/{id}/read'
*/
const readForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: read.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NotificationController::read
* @see app/Http/Controllers/NotificationController.php:10
* @route '/notifications/{id}/read'
*/
readForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: read.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

read.form = readForm

/**
* @see \App\Http\Controllers\NotificationController::readAll
* @see app/Http/Controllers/NotificationController.php:17
* @route '/notifications/read-all'
*/
export const readAll = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: readAll.url(options),
    method: 'patch',
})

readAll.definition = {
    methods: ["patch"],
    url: '/notifications/read-all',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\NotificationController::readAll
* @see app/Http/Controllers/NotificationController.php:17
* @route '/notifications/read-all'
*/
readAll.url = (options?: RouteQueryOptions) => {
    return readAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::readAll
* @see app/Http/Controllers/NotificationController.php:17
* @route '/notifications/read-all'
*/
readAll.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: readAll.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\NotificationController::readAll
* @see app/Http/Controllers/NotificationController.php:17
* @route '/notifications/read-all'
*/
const readAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: readAll.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NotificationController::readAll
* @see app/Http/Controllers/NotificationController.php:17
* @route '/notifications/read-all'
*/
readAllForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: readAll.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

readAll.form = readAllForm

const notifications = {
    read: Object.assign(read, read),
    readAll: Object.assign(readAll, readAll),
}

export default notifications