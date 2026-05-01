import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import comments from './comments'
/**
* @see \App\Http\Controllers\PostController::store
* @see app/Http/Controllers/PostController.php:17
* @route '/posts'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/posts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PostController::store
* @see app/Http/Controllers/PostController.php:17
* @route '/posts'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PostController::store
* @see app/Http/Controllers/PostController.php:17
* @route '/posts'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PostController::store
* @see app/Http/Controllers/PostController.php:17
* @route '/posts'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PostController::store
* @see app/Http/Controllers/PostController.php:17
* @route '/posts'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PostController::like
* @see app/Http/Controllers/PostController.php:46
* @route '/posts/{post}/like'
*/
export const like = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: like.url(args, options),
    method: 'post',
})

like.definition = {
    methods: ["post"],
    url: '/posts/{post}/like',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PostController::like
* @see app/Http/Controllers/PostController.php:46
* @route '/posts/{post}/like'
*/
like.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { post: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: typeof args.post === 'object'
        ? args.post.id
        : args.post,
    }

    return like.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PostController::like
* @see app/Http/Controllers/PostController.php:46
* @route '/posts/{post}/like'
*/
like.post = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: like.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PostController::like
* @see app/Http/Controllers/PostController.php:46
* @route '/posts/{post}/like'
*/
const likeForm = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: like.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PostController::like
* @see app/Http/Controllers/PostController.php:46
* @route '/posts/{post}/like'
*/
likeForm.post = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: like.url(args, options),
    method: 'post',
})

like.form = likeForm

const posts = {
    store: Object.assign(store, store),
    like: Object.assign(like, like),
    comments: Object.assign(comments, comments),
}

export default posts