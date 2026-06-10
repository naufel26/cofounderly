import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\SocialAuthController::redirect
* @see app/Http/Controllers/Auth/SocialAuthController.php:33
* @route '/auth/linkedin/redirect'
*/
export const redirect = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

redirect.definition = {
    methods: ["get","head"],
    url: '/auth/linkedin/redirect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::redirect
* @see app/Http/Controllers/Auth/SocialAuthController.php:33
* @route '/auth/linkedin/redirect'
*/
redirect.url = (options?: RouteQueryOptions) => {
    return redirect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::redirect
* @see app/Http/Controllers/Auth/SocialAuthController.php:33
* @route '/auth/linkedin/redirect'
*/
redirect.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::redirect
* @see app/Http/Controllers/Auth/SocialAuthController.php:33
* @route '/auth/linkedin/redirect'
*/
redirect.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirect.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::redirect
* @see app/Http/Controllers/Auth/SocialAuthController.php:33
* @route '/auth/linkedin/redirect'
*/
const redirectForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::redirect
* @see app/Http/Controllers/Auth/SocialAuthController.php:33
* @route '/auth/linkedin/redirect'
*/
redirectForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::redirect
* @see app/Http/Controllers/Auth/SocialAuthController.php:33
* @route '/auth/linkedin/redirect'
*/
redirectForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

redirect.form = redirectForm

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::callback
* @see app/Http/Controllers/Auth/SocialAuthController.php:38
* @route '/auth/linkedin/callback'
*/
export const callback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

callback.definition = {
    methods: ["get","head"],
    url: '/auth/linkedin/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::callback
* @see app/Http/Controllers/Auth/SocialAuthController.php:38
* @route '/auth/linkedin/callback'
*/
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::callback
* @see app/Http/Controllers/Auth/SocialAuthController.php:38
* @route '/auth/linkedin/callback'
*/
callback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::callback
* @see app/Http/Controllers/Auth/SocialAuthController.php:38
* @route '/auth/linkedin/callback'
*/
callback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::callback
* @see app/Http/Controllers/Auth/SocialAuthController.php:38
* @route '/auth/linkedin/callback'
*/
const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: callback.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::callback
* @see app/Http/Controllers/Auth/SocialAuthController.php:38
* @route '/auth/linkedin/callback'
*/
callbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: callback.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::callback
* @see app/Http/Controllers/Auth/SocialAuthController.php:38
* @route '/auth/linkedin/callback'
*/
callbackForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: callback.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

callback.form = callbackForm

const linkedin = {
    redirect: Object.assign(redirect, redirect),
    callback: Object.assign(callback, callback),
}

export default linkedin