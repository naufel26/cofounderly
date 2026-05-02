import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\OnboardingController::complete
* @see app/Http/Controllers/OnboardingController.php:25
* @route '/onboarding/complete'
*/
export const complete = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/onboarding/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OnboardingController::complete
* @see app/Http/Controllers/OnboardingController.php:25
* @route '/onboarding/complete'
*/
complete.url = (options?: RouteQueryOptions) => {
    return complete.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OnboardingController::complete
* @see app/Http/Controllers/OnboardingController.php:25
* @route '/onboarding/complete'
*/
complete.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OnboardingController::complete
* @see app/Http/Controllers/OnboardingController.php:25
* @route '/onboarding/complete'
*/
const completeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: complete.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OnboardingController::complete
* @see app/Http/Controllers/OnboardingController.php:25
* @route '/onboarding/complete'
*/
completeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: complete.url(options),
    method: 'post',
})

complete.form = completeForm

const onboarding = {
    complete: Object.assign(complete, complete),
}

export default onboarding