import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\UserRegisterController::register
* @see app/Http/Controllers/Auth/UserRegisterController.php:15
* @route '/user-register'
*/
export const register = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

register.definition = {
    methods: ["post"],
    url: '/user-register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\UserRegisterController::register
* @see app/Http/Controllers/Auth/UserRegisterController.php:15
* @route '/user-register'
*/
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\UserRegisterController::register
* @see app/Http/Controllers/Auth/UserRegisterController.php:15
* @route '/user-register'
*/
register.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\UserRegisterController::register
* @see app/Http/Controllers/Auth/UserRegisterController.php:15
* @route '/user-register'
*/
const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: register.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\UserRegisterController::register
* @see app/Http/Controllers/Auth/UserRegisterController.php:15
* @route '/user-register'
*/
registerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: register.url(options),
    method: 'post',
})

register.form = registerForm

const user = {
    register: Object.assign(register, register),
}

export default user