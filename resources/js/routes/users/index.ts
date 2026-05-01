import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\UserSearchController::__invoke
* @see app/Http/Controllers/UserSearchController.php:12
* @route '/search/users'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/search/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserSearchController::__invoke
* @see app/Http/Controllers/UserSearchController.php:12
* @route '/search/users'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserSearchController::__invoke
* @see app/Http/Controllers/UserSearchController.php:12
* @route '/search/users'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserSearchController::__invoke
* @see app/Http/Controllers/UserSearchController.php:12
* @route '/search/users'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserSearchController::__invoke
* @see app/Http/Controllers/UserSearchController.php:12
* @route '/search/users'
*/
const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserSearchController::__invoke
* @see app/Http/Controllers/UserSearchController.php:12
* @route '/search/users'
*/
searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserSearchController::__invoke
* @see app/Http/Controllers/UserSearchController.php:12
* @route '/search/users'
*/
searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

search.form = searchForm

const users = {
    search: Object.assign(search, search),
}

export default users