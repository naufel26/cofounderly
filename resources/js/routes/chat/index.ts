import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ChatController::conversations
* @see app/Http/Controllers/ChatController.php:16
* @route '/chat/conversations'
*/
export const conversations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conversations.url(options),
    method: 'get',
})

conversations.definition = {
    methods: ["get","head"],
    url: '/chat/conversations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ChatController::conversations
* @see app/Http/Controllers/ChatController.php:16
* @route '/chat/conversations'
*/
conversations.url = (options?: RouteQueryOptions) => {
    return conversations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::conversations
* @see app/Http/Controllers/ChatController.php:16
* @route '/chat/conversations'
*/
conversations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conversations.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ChatController::conversations
* @see app/Http/Controllers/ChatController.php:16
* @route '/chat/conversations'
*/
conversations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: conversations.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ChatController::conversations
* @see app/Http/Controllers/ChatController.php:16
* @route '/chat/conversations'
*/
const conversationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: conversations.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ChatController::conversations
* @see app/Http/Controllers/ChatController.php:16
* @route '/chat/conversations'
*/
conversationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: conversations.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ChatController::conversations
* @see app/Http/Controllers/ChatController.php:16
* @route '/chat/conversations'
*/
conversationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: conversations.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

conversations.form = conversationsForm

/**
* @see \App\Http\Controllers\ChatController::start
* @see app/Http/Controllers/ChatController.php:48
* @route '/chat/conversations/{user}'
*/
export const start = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/chat/conversations/{user}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ChatController::start
* @see app/Http/Controllers/ChatController.php:48
* @route '/chat/conversations/{user}'
*/
start.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return start.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::start
* @see app/Http/Controllers/ChatController.php:48
* @route '/chat/conversations/{user}'
*/
start.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ChatController::start
* @see app/Http/Controllers/ChatController.php:48
* @route '/chat/conversations/{user}'
*/
const startForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ChatController::start
* @see app/Http/Controllers/ChatController.php:48
* @route '/chat/conversations/{user}'
*/
startForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(args, options),
    method: 'post',
})

start.form = startForm

/**
* @see \App\Http\Controllers\ChatController::messages
* @see app/Http/Controllers/ChatController.php:70
* @route '/chat/conversations/{conversation}/messages'
*/
export const messages = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: messages.url(args, options),
    method: 'get',
})

messages.definition = {
    methods: ["get","head"],
    url: '/chat/conversations/{conversation}/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ChatController::messages
* @see app/Http/Controllers/ChatController.php:70
* @route '/chat/conversations/{conversation}/messages'
*/
messages.url = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { conversation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            conversation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        conversation: typeof args.conversation === 'object'
        ? args.conversation.id
        : args.conversation,
    }

    return messages.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::messages
* @see app/Http/Controllers/ChatController.php:70
* @route '/chat/conversations/{conversation}/messages'
*/
messages.get = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: messages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ChatController::messages
* @see app/Http/Controllers/ChatController.php:70
* @route '/chat/conversations/{conversation}/messages'
*/
messages.head = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: messages.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ChatController::messages
* @see app/Http/Controllers/ChatController.php:70
* @route '/chat/conversations/{conversation}/messages'
*/
const messagesForm = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: messages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ChatController::messages
* @see app/Http/Controllers/ChatController.php:70
* @route '/chat/conversations/{conversation}/messages'
*/
messagesForm.get = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: messages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ChatController::messages
* @see app/Http/Controllers/ChatController.php:70
* @route '/chat/conversations/{conversation}/messages'
*/
messagesForm.head = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: messages.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

messages.form = messagesForm

/**
* @see \App\Http\Controllers\ChatController::send
* @see app/Http/Controllers/ChatController.php:104
* @route '/chat/conversations/{conversation}/messages'
*/
export const send = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/chat/conversations/{conversation}/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ChatController::send
* @see app/Http/Controllers/ChatController.php:104
* @route '/chat/conversations/{conversation}/messages'
*/
send.url = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { conversation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            conversation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        conversation: typeof args.conversation === 'object'
        ? args.conversation.id
        : args.conversation,
    }

    return send.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::send
* @see app/Http/Controllers/ChatController.php:104
* @route '/chat/conversations/{conversation}/messages'
*/
send.post = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ChatController::send
* @see app/Http/Controllers/ChatController.php:104
* @route '/chat/conversations/{conversation}/messages'
*/
const sendForm = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: send.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ChatController::send
* @see app/Http/Controllers/ChatController.php:104
* @route '/chat/conversations/{conversation}/messages'
*/
sendForm.post = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: send.url(args, options),
    method: 'post',
})

send.form = sendForm

const chat = {
    conversations: Object.assign(conversations, conversations),
    start: Object.assign(start, start),
    messages: Object.assign(messages, messages),
    send: Object.assign(send, send),
}

export default chat